import { Track } from "@/customTypes";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { del } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { feedbackAlert } from "@/utils/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
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

        const formData = await req.formData();

        const errorDescription = formData.get("errorDescription") as string;
        const errorType = formData.get("errorType") as string;
        const screenshotURL = formData.get("screenshotURL") as string;

        const feedback = {
            description: errorDescription,
            type: errorType,
            screenshotURL: "" as any,
        };

        if (screenshotURL) {
            console.log("Processing screenshot upload");
            try {
                const screenshotBuffer = await fetch(screenshotURL).then(
                    (res) => res.arrayBuffer(),
                );

                const screenshotFileExtension = screenshotURL.split(".").pop();
                const screenshotKey = `images/${uuidv4()}.${screenshotFileExtension}`;

                const screenshotUploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME as string,
                    Key: screenshotKey,
                    Body: Buffer.from(screenshotBuffer),
                    ContentType: `images/${screenshotFileExtension}`,
                };

                await s3.send(new PutObjectCommand(screenshotUploadParams));
                console.log("Image uploaded to S3 successfully");

                await del(screenshotURL, {
                    token: process.env.BLOB_READ_WRITE_TOKEN,
                });
                console.log("Deleted screenshot from Vercel Blob");

                const s3ImageURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${screenshotKey}`;
                feedback.screenshotURL = s3ImageURL;
            } catch (error) {
                console.error("Error in screenshot processing:", error);
                throw error;
            }
        } else {
            console.log("Using default track cover");
            feedback.screenshotURL = null;
        }

        const dbClient = createClient(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_KEY as string,
        );

        try {
            const insertionResponse = await dbClient
                .from("feedback")
                .insert([
                    {
                        user: session.user.id,
                        description: feedback.description,
                        type: feedback.type,
                        screenshot_url: feedback.screenshotURL,
                    },
                ])
                .select();

            if (
                insertionResponse.error ||
                !insertionResponse.data ||
                !insertionResponse.data.length
            ) {
                console.error(
                    "Error inserting feedback:",
                    insertionResponse.error,
                );
                return NextResponse.json(
                    {
                        message: "Error processing request",
                        error: "Failed to insert feedback",
                    },
                    { status: 500, headers },
                );
            }

            console.log("Feedback data inserted successfully");
        } catch (error) {
            console.error("Error in database insertion:", error);
            throw error;
        }

        const userResponse = await dbClient
            .from("users")
            .select("*")
            .eq("id", session.user.id);

        if (
            userResponse.error ||
            !userResponse.data ||
            !userResponse.data.length
        ) {
            console.error("Error fetching user data:", userResponse.error);
            return NextResponse.json(
                {
                    message: "Error processing request",
                    error: "Failed to fetch user data",
                },
                { status: 500, headers },
            );
        }

        const user = userResponse.data[0];

        const organizationResponse = await dbClient
            .from("organizations")
            .select("*")
            .eq("id", user.organization);

        if (
            organizationResponse.error ||
            !organizationResponse.data ||
            !organizationResponse.data.length
        ) {
            console.error(
                "Error fetching organization data:",
                organizationResponse.error,
            );
            return NextResponse.json(
                {
                    message: "Error processing request",
                    error: "Failed to fetch organization data",
                },
                { status: 500, headers },
            );
        }

        const organization = organizationResponse.data[0];

        try {
            await feedbackAlert(
                user.name,
                organization.name,
                user.email,
                feedback.type,
                feedback.description,
            );
        } catch (error) {
            console.error("Error sending feedback alert:", error);
            throw error;
        }

        return NextResponse.json(
            { message: "Feedback submitted successfully" },
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
