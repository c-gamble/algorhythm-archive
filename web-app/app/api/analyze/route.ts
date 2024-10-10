import { Track } from "@/customTypes";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { del } from "@vercel/blob";
import { handleAxiosError } from "@/utils/axios";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const logWorkerCall = (workerName: string) => {
    console.log(`${new Date().toISOString()} - Calling ${workerName} worker`);
};

export async function POST(req: Request) {
    console.log("Starting POST request processing");

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            console.log("Authentication failed");
            return NextResponse.json(
                { message: "unauthenticated" },
                { status: 401, headers },
            );
        }

        console.log("Authentication successful");

        const s3 = new S3Client({
            region: process.env.AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            },
        });

        let track: Track = {
            name: "",
            artist: {
                name: "",
                instagramURL: "",
            },
            imageURL: "",
            s3Key: "",
        };

        const audioFileId = uuidv4();
        console.log(`Generated audioFileId: ${audioFileId}`);

        const formData = await req.formData();

        const isFile = formData.get("isFile") === "true";

        console.log(`Processing ${isFile ? "file upload" : "Spotify URL"}`);

        if (isFile) {
            console.log("Processing file upload");
            // send invalid if artist name is empty
            if (!formData.get("artist")) {
                return NextResponse.json(
                    { message: "Artist is required" },
                    { status: 400 },
                );
            }

            const audioURL = formData.get("audioURL") as string;

            if (!audioURL) {
                console.log("No audio file uploaded");
                return NextResponse.json(
                    { message: "No audio file uploaded" },
                    { status: 400 },
                );
            } else {
                console.log("Uploading audio file to S3");
                try {
                    const audioBuffer = await fetch(audioURL).then((res) =>
                        res.arrayBuffer(),
                    );

                    const audioFileExtension = audioURL.split(".").pop();
                    const audioKey = `audio/${audioFileId}.${audioFileExtension}`;

                    const audioUploadParams = {
                        Bucket: process.env.S3_BUCKET_NAME as string,
                        Key: audioKey,
                        Body: Buffer.from(audioBuffer),
                        ContentType: "audio/mpeg",
                    };

                    await s3.send(new PutObjectCommand(audioUploadParams));
                    console.log("Audio file uploaded to S3 successfully");

                    await del(audioURL, {
                        token: process.env.BLOB_READ_WRITE_TOKEN,
                    });
                    console.log("Deleted audio file from Vercel Blob");

                    track.name = (formData.get("name") as string) || "Unknown";
                    track.artist = {
                        name: formData.get("artist") as string,
                        instagramURL:
                            (formData.get("instagramURL") as string) || "",
                        spotifyURL: "",
                    };
                    track.s3Key = audioKey;
                } catch (error) {
                    console.error("Error in audio file processing:", error);
                    throw error;
                }
            }

            let imageURL = formData.get("imageURL") as string;
            if (imageURL) {
                console.log("Processing image upload");
                try {
                    const imageBuffer = await fetch(imageURL).then((res) =>
                        res.arrayBuffer(),
                    );

                    const imageFileExtension = imageURL.split(".").pop();
                    const imageKey = `images/${audioFileId}.${imageFileExtension}`;

                    const imageUploadParams = {
                        Bucket: process.env.S3_BUCKET_NAME as string,
                        Key: imageKey,
                        Body: Buffer.from(imageBuffer),
                        ContentType: `images/${imageFileExtension}`,
                    };

                    await s3.send(new PutObjectCommand(imageUploadParams));
                    console.log("Image uploaded to S3 successfully");

                    await del(imageURL, {
                        token: process.env.BLOB_READ_WRITE_TOKEN,
                    });
                    console.log("Deleted image from Vercel Blob");

                    const s3ImageURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
                    track.imageURL = s3ImageURL;
                } catch (error) {
                    console.error("Error in image processing:", error);
                    throw error;
                }
            } else {
                console.log("Using default track cover");
                track.imageURL = process.env.DEFAULT_TRACK_COVER_URL as string;
            }
        } else {
            console.log("Processing Spotify URL");
            const spotifyURL = formData.get("spotifyURL") as string;
            try {
                const downloadResponse = await axios.post(
                    `${process.env.UPLOAD_WORKER_URL}/upload`,
                    {
                        spotifyURL: spotifyURL,
                        bucketName: process.env.S3_BUCKET_NAME as string,
                        s3Key: audioFileId,
                    },
                );

                if (downloadResponse.status !== 200) {
                    console.error(
                        "Error in Spotify download:",
                        downloadResponse.data,
                    );
                    return NextResponse.json(
                        { message: "Error processing Spotify URL" },
                        { status: 500 },
                    );
                }

                track = downloadResponse.data.track; // guarantees everything is defined
                console.log("Spotify track processed successfully");
            } catch (error) {
                console.error("Error in Spotify URL processing:", error);
                throw error;
            }
        }

        console.log("sending track to workers for analysis", track);

        const artistSpotifyIDResponse = await axios.post(
            `${process.env.ARTISTS_WORKER_URL}/spotify-id`,
            { artistName: track.artist.name },
        );
        const artistSpotifyID = artistSpotifyIDResponse.data.spotify_id;
        console.log("Artist Spotify ID:", artistSpotifyID);

        const artistChartmetricIDResponse = await axios.post(
            `${process.env.ARTISTS_WORKER_URL}/chartmetric-id`,
            { artistName: track.artist.name },
        );
        const artistChartmetricID =
            artistChartmetricIDResponse.data.chartmetric_id;
        console.log("Artist Chartmetric ID:", artistChartmetricID);

        if (
            !artistSpotifyID ||
            artistSpotifyID === "" ||
            !artistChartmetricID ||
            artistChartmetricID === ""
        ) {
            console.error("Error getting artist IDs");
            return NextResponse.json(
                { message: "Could not find artist." },
                { status: 500 },
            );
        }

        if (!track.artist.spotifyURL || track.artist.spotifyURL === "") {
            const spotifyURLResponse = await axios.post(
                `${process.env.ARTISTS_WORKER_URL}/spotify-url`,
                { artistName: track.artist.name },
            );
            track.artist.spotifyURL = spotifyURLResponse.data.spotify_url;
        }

        if (!track.artist.instagramURL || track.artist.instagramURL === "") {
            const instagramURLResponse = await axios.post(
                `${process.env.ARTISTS_WORKER_URL}/instagram-url`,
                { artistChartmetricID },
            );
            track.artist.instagramURL = instagramURLResponse.data.instagram_url;
        }

        console.log("Finalized track:", track);

        // Start embeddings and transcription requests immediately
        logWorkerCall("Transcription");
        const transcriptionPromise = axios
            .post(`${process.env.TRANSCRIPTION_WORKER_URL}`, {
                s3Key: track.s3Key,
            })
            .catch((error) => handleAxiosError("Transcription", error))
            .then((response) => {
                console.log(
                    `${new Date().toISOString()} - Transcription worker completed`,
                );
                return response.data;
            });

        // Start features request as soon as embeddings are available
        logWorkerCall("Features");
        const featuresPromise = axios
            .post(`${process.env.FEATURES_WORKER_URL}`, { s3Key: track.s3Key })
            .catch((error) => handleAxiosError("Features", error))
            .then((response) => {
                console.log(
                    `${new Date().toISOString()} - Features worker completed`,
                );
                return response.data;
            });

        // Start requests that don't depend on transcription or features
        logWorkerCall("Artist Collaborations");
        const artistCollaborationsPromise = axios
            .post(`${process.env.ARTIST_COLLABORATIONS_WORKER_URL}`, {
                artistSpotifyID,
            })
            .catch((error) => handleAxiosError("Artist Collaborations", error))
            .then((response) => {
                console.log(
                    `${new Date().toISOString()} - Artist Collaborations worker completed`,
                );
                return response.data;
            });

        // logWorkerCall("Brand Collaborations");
        // const brandCollaborationsPromise = axios
        //     .post(`${process.env.BRAND_COLLABORATIONS_WORKER_URL}`, { track })
        //     .catch((error) => handleAxiosError("Brand Collaborations", error))
        //     .then((response) => {
        //         console.log(
        //             `${new Date().toISOString()} - Brand Collaborations worker completed`,
        //         );
        //         return response.data;
        //     });

        // Wait for transcription, features, and collaborations to be available
        const [
            transcription,
            features,
            artistCollaborations,
            // brandCollaborations,
        ] = await Promise.all([
            transcriptionPromise,
            featuresPromise,
            artistCollaborationsPromise,
            // brandCollaborationsPromise,
        ]);

        const brandCollaborations = {
            larger: [],
            perfect: [],
            smaller: [],
        };

        const {
            audioFeatures,
            quantizedAudioFeatures,
            additionalFeatures,
            quantizedAdditionalFeatures,
            genres,
        } = features;

        const remainingPromises = [
            logWorkerCall("Key Traits"),
            axios
                .post(`${process.env.KEY_TRAITS_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    quantizedAudioFeatures,
                    additionalFeatures,
                })
                .catch((error) => {
                    console.error(`Error in Key Traits worker:`, error);
                    return {
                        error: `Key Traits worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Key Traits worker completed`,
                    );
                    console.log("Key Traits response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Key Traits worker",
                        );
                        return {
                            error: "Invalid response from Key Traits worker",
                        };
                    }
                }),

            logWorkerCall("Notable Moments"),
            axios
                .post(`${process.env.NOTABLE_MOMENTS_WORKER_URL}`, {
                    transcription,
                })
                .catch((error) => {
                    console.error(`Error in Notable Moments worker:`, error);
                    return {
                        error: `Notable Moments worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Notable Moments worker completed`,
                    );
                    console.log("Notable Moments response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Notable Moments worker",
                        );
                        return {
                            error: "Invalid response from Notable Moments worker",
                        };
                    }
                }),

            logWorkerCall("Age Distribution"),
            axios
                .post(`${process.env.AGE_DISTRIBUTION_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                })
                .catch((error) => {
                    console.error(`Error in Age Distribution worker:`, error);
                    return {
                        error: `Age Distribution worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Age Distribution worker completed`,
                    );
                    console.log("Age Distribution response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Age Distribution worker",
                        );
                        return {
                            error: "Invalid response from Age Distribution worker",
                        };
                    }
                }),

            logWorkerCall("Sex Distribution"),
            axios
                .post(`${process.env.SEX_DISTRIBUTION_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                })
                .catch((error) => {
                    console.error(`Error in Sex Distribution worker:`, error);
                    return {
                        error: `Sex Distribution worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Sex Distribution worker completed`,
                    );
                    console.log("Sex Distribution response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Sex Distribution worker",
                        );
                        return {
                            error: "Invalid response from Sex Distribution worker",
                        };
                    }
                }),

            logWorkerCall("Ethnicity Distribution"),
            axios
                .post(`${process.env.ETHNICITY_DISTRIBUTION_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                })
                .catch((error) => {
                    console.error(
                        `Error in Ethnicity Distribution worker:`,
                        error,
                    );
                    return {
                        error: `Ethnicity Distribution worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Ethnicity Distribution worker completed`,
                    );
                    console.log(
                        "Ethnicity Distribution response:",
                        response.data,
                    );
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Ethnicity Distribution worker",
                        );
                        return {
                            error: "Invalid response from Ethnicity Distribution worker",
                        };
                    }
                }),

            logWorkerCall("Cities"),
            axios
                .post(`${process.env.CITIES_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                })
                .catch((error) => {
                    console.error(`Error in Cities worker:`, error);
                    return { error: `Cities worker failed: ${error.message}` };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Cities worker completed`,
                    );
                    console.log("Cities response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error("Invalid response from Cities worker");
                        return { error: "Invalid response from Cities worker" };
                    }
                }),

            logWorkerCall("Editorial Playlists"),
            axios
                .post(`${process.env.EDITORIAL_PLAYLISTS_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                    trackTitle: track.name,
                })
                .catch((error) => {
                    console.error(
                        `Error in Editorial Playlists worker:`,
                        error,
                    );
                    return {
                        error: `Editorial Playlists worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Editorial Playlists worker completed`,
                    );
                    console.log("Editorial Playlists response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Editorial Playlists worker",
                        );
                        return {
                            error: "Invalid response from Editorial Playlists worker",
                        };
                    }
                }),

            logWorkerCall("Third Party Playlists"),
            axios
                .post(`${process.env.THIRD_PARTY_PLAYLISTS_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    audioFeatures,
                    additionalFeatures,
                    trackTitle: track.name,
                })
                .catch((error) => {
                    console.error(
                        `Error in Third Party Playlists worker:`,
                        error,
                    );
                    return {
                        error: `Third Party Playlists worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Third Party Playlists worker completed`,
                    );
                    console.log(
                        "Third Party Playlists response:",
                        response.data,
                    );
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error(
                            "Invalid response from Third Party Playlists worker",
                        );
                        return {
                            error: "Invalid response from Third Party Playlists worker",
                        };
                    }
                }),

            logWorkerCall("Moodboard"),
            axios
                .post(`${process.env.MOODBOARD_WORKER_URL}`, {
                    lyrics: transcription.lyrics,
                    genres,
                })
                .catch((error) => {
                    console.error(`Error in Moodboard worker:`, error);
                    return {
                        error: `Moodboard worker failed: ${error.message}`,
                    };
                })
                .then((response: any) => {
                    console.log(
                        `${new Date().toISOString()} - Moodboard worker completed`,
                    );
                    console.log("Moodboard response:", response.data);
                    if (response && response.data) {
                        return response.data;
                    } else {
                        console.error("Invalid response from Moodboard worker");
                        return {
                            error: "Invalid response from Moodboard worker",
                        };
                    }
                }),
        ];
        // Wait for all remaining promises to resolve
        const results = await Promise.all(remainingPromises);
        const cleanedResults = results.filter((item) => item !== undefined);
        const [
            keyTraits,
            notableMoments,
            ageDistribution,
            sexDistribution,
            ethnicityDistribution,
            cities,
            editorialPlaylists,
            thirdPartyPlaylists,
            moodboard,
        ] = cleanedResults;
        const suggestedCampaigns: any = [];

        // Start audience summary request
        logWorkerCall("Audience Summary");
        const audienceSummary = await axios
            .post(`${process.env.AUDIENCE_SUMMARY_WORKER_URL}`, {
                cities,
                ageDistribution,
                sexDistribution,
                ethnicityDistribution,
                lyrics: transcription.lyrics,
                audioFeatures,
                additionalFeatures,
            })
            .catch((error) => handleAxiosError("Audience Summary", error))
            .then((response) => {
                console.log(
                    `${new Date().toISOString()} - Audience Summary worker completed`,
                );
                return response.data;
            });

        if (
            !transcription ||
            !features ||
            !artistCollaborations ||
            !keyTraits ||
            !notableMoments ||
            !ageDistribution ||
            !sexDistribution ||
            !ethnicityDistribution ||
            !cities ||
            !editorialPlaylists ||
            !thirdPartyPlaylists ||
            !moodboard ||
            moodboard.error ||
            !audienceSummary
        ) {
            const errorMessage = "Error processing request!";
            console.error(`Analysis error: ${errorMessage}`);
            return NextResponse.json(
                { message: errorMessage },
                { status: 500, headers },
            );
        }

        console.log("Inserting campaign data into database");
        const dbClient = createClient(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_KEY as string,
        );

        try {
            const insertionResponse = await dbClient
                .from("campaigns")
                .insert([
                    {
                        date: new Date().toISOString(),
                        accessed: new Date().toISOString(),
                        user_id: session?.user?.id,
                        track_info: track,
                        analysis: {
                            notableMoments,
                            similarTracks: [],
                            keyTraits,
                            audioFeatures,
                            additionalFeatures,
                            genres,
                        },
                        audience: {
                            cities,
                            ageDistribution,
                            sexDistribution,
                            ethnicityDistribution,
                            summary: audienceSummary.summary,
                        },
                        engagement: {
                            artistCollaborations,
                            brandCollaborations,
                            editorialPlaylists,
                            thirdPartyPlaylists,
                        },
                        creative_vision: {
                            moodboard,
                            similarCampaigns: [],
                            suggestedCampaigns,
                        },
                    },
                ])
                .select();

            if (
                insertionResponse.error ||
                !insertionResponse.data ||
                !insertionResponse.data.length
            ) {
                console.error(
                    "Error inserting campaign:",
                    insertionResponse.error,
                );
                return NextResponse.json(
                    {
                        message: "Error processing request",
                        error: "Failed to insert campaign",
                    },
                    { status: 500, headers },
                );
            }

            console.log("Campaign data inserted successfully");
        } catch (error) {
            console.error("Error in database insertion:", error);
            throw error;
        }

        return NextResponse.json(
            { message: "Campaign processed successfully" },
            { status: 200, headers },
        );
    } catch (error) {
        console.error("Unhandled error in request processing:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { message: "Error processing request", error: errorMessage },
            { status: 500, headers },
        );
    }
}
