import {
    CampaignOutput,
    NotableMoment,
    PinterestImage,
    PieChartItem,
    ArtistCollaboration,
    BrandCollaboration,
    Playlist,
} from "@/customTypes";
import { AudioVisualizer } from "@/components/track/analysis/audio-visualizer/AudioVisualizer";
import { ListenerMap } from "@/components/track/audience/listener-map/ListenerMap";
import axios from "axios";
import PlayIcon from "@/assets/icons/play.png";
import PauseIcon from "@/assets/icons/pause.png";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-responsive-masonry";
import { PieChart } from "@mui/x-charts/PieChart";
import { camelCaseToTitleCase, trimToLength } from "@/utils/text";
import { PIE_CHART_COLORS } from "@/constants";
import SpotifyIcon from "@/assets/icons/spotify.png";
import InstagramIcon from "@/assets/icons/instagram.png";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";

export const Overview = ({
    campaign,
    view,
    blobCache,
    isNavbarTransitioning,
}: {
    campaign: CampaignOutput;
    view: string;
    blobCache: { [key: string]: Blob };
    isNavbarTransitioning: boolean;
}) => {
    const [blob, setBlob] = useState<Blob>();
    const visualizerRef = useRef<HTMLCanvasElement>(null);
    const parentDivRef = useRef<HTMLDivElement>(null);
    const [parentWidth, setParentWidth] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<number | null>(null);

    const [activeTag, setActiveTag] = useState<string | null>(null);

    const fetchAudio = useCallback(async () => {
        const cacheKey = campaign.trackInfo.s3Key;

        if (cacheKey && blobCache[cacheKey]) {
            setBlob(blobCache[cacheKey]);
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(blobCache[cacheKey]);
            } else {
                audioRef.current = new Audio(
                    URL.createObjectURL(blobCache[cacheKey]),
                );
            }
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/asset/track`,
                { fileKey: campaign.trackInfo.s3Key },
            );

            const data = response.data;
            const blobData = atob(data.blob);
            const arrayBuffer = new ArrayBuffer(blobData.length);
            const view = new Uint8Array(arrayBuffer);
            for (let i = 0; i < blobData.length; i++) {
                view[i] = blobData.charCodeAt(i);
            }
            const newBlob = new Blob([arrayBuffer], {
                type: "audio/mpeg",
            });

            // Store the blob in the cache
            if (cacheKey) blobCache[cacheKey] = newBlob;

            setBlob(newBlob);
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(newBlob);
            } else {
                audioRef.current = new Audio(URL.createObjectURL(newBlob));
            }
        } catch (error) {
            console.error("Error fetching audio:", error);
        }
    }, [campaign.trackInfo.s3Key]);

    useEffect(() => {
        fetchAudio();

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, [fetchAudio]);

    useEffect(() => {
        const handleResize = () => {
            if (parentDivRef.current) {
                setParentWidth(parentDivRef.current.clientWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const togglePlayPause = (index: number, start: number, end: number) => {
        if (audioRef.current) {
            const stopAudio = () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        checkTime,
                    );
                    audioRef.current.removeEventListener("ended", stopAudio);
                    setIsPlaying(null);
                }
            };

            const checkTime = () => {
                if (audioRef.current && audioRef.current.currentTime >= end) {
                    stopAudio();
                }
            };
            if (isPlaying === index) {
                audioRef.current.pause();
                audioRef.current.removeEventListener("timeupdate", checkTime);
                audioRef.current.removeEventListener("ended", stopAudio);
                setIsPlaying(null);
            } else {
                if (isPlaying !== null) {
                    audioRef.current.pause();
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        checkTime,
                    );
                    audioRef.current.removeEventListener("ended", stopAudio);
                }
                audioRef.current.currentTime = start;
                audioRef.current.play();
                setIsPlaying(index);

                audioRef.current.addEventListener("timeupdate", checkTime);
                audioRef.current.addEventListener("ended", stopAudio);
            }
        }
    };

    useEffect(() => {
        const stopAudio = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Reset playback position
                setIsPlaying(null);
            }
        };

        if (view !== "overview") {
            stopAudio();
        }

        // Cleanup function to ensure audio stops when component unmounts
        return () => {
            stopAudio();
        };
    }, [view, campaign]);

    return (
        <div className="flex flex-row mt-8 w-full">
            <div className="flex flex-col w-[40%]">
                <div className="flex flex-col p-4 bg-white rounded-lg items-center w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4">
                        What Listeners Will Remember
                    </p>
                    {blob &&
                        campaign.Analysis.notableMoments.length > 0 &&
                        campaign.Analysis.notableMoments.map(
                            (moment: NotableMoment, index: number) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-start w-full bg-greyBg rounded-lg p-4 mt-4"
                                >
                                    <h2 className="text-[14px] text-eightyPBlack mb-4">
                                        {moment.description}
                                    </h2>
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <Image
                                            src={
                                                isPlaying === index
                                                    ? PauseIcon.src
                                                    : PlayIcon.src
                                            }
                                            alt={
                                                isPlaying === index
                                                    ? "Pause"
                                                    : "Play"
                                            }
                                            height={
                                                isPlaying === index ? 20 : 18
                                            }
                                            width={
                                                isPlaying === index ? 20 : 16
                                            }
                                            onClick={() =>
                                                togglePlayPause(
                                                    index,
                                                    moment.start,
                                                    moment.end,
                                                )
                                            }
                                            className="cursor-pointer mr-2"
                                            style={{
                                                opacity:
                                                    isPlaying === index
                                                        ? 0.7
                                                        : 1,
                                            }}
                                        />
                                        {!isNavbarTransitioning && (
                                            <AudioVisualizer
                                                ref={visualizerRef}
                                                blob={blob}
                                                width={parentWidth - 32}
                                                height={50}
                                                barWidth={2}
                                                gap={0}
                                                barColor={"rgba(0, 0, 0, 0.2)"}
                                                highlightStart={moment.start}
                                                highlightEnd={moment.end}
                                                highlightColor={
                                                    "rgba(0, 0, 0, 0.7)"
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                </div>
                <div className="flex flex-col w-full bg-white py-4 px-8 rounded-lg mt-8 max-h-[600px]">
                    <p className="text-[14px] text-black w-full text-left mb-4">
                        Moodboard
                    </p>
                    <div className="w-full flex flex-wrap justify-start items-center mb-4">
                        {campaign.CreativeVision.moodboard.keywords.map(
                            (keyword: string, index: number) => (
                                <button
                                    key={index}
                                    className="flex flex-row items-center justify-center rounded-md px-4 py-2 mr-2 mb-2"
                                    // onClick={() => {
                                    //     activeTag === keyword
                                    //         ? setActiveTag(null)
                                    //         : setActiveTag(keyword);
                                    // }}
                                    style={{
                                        backgroundColor:
                                            activeTag === keyword
                                                ? "#505050"
                                                : "#EFEFEF",
                                        color:
                                            activeTag === keyword
                                                ? "white"
                                                : "rgba(0, 0, 0, 0.6)",
                                    }}
                                >
                                    <p className="text-[14px] w-full text-center">
                                        #{camelCaseToTitleCase(keyword)}
                                    </p>
                                </button>
                            ),
                        )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <div className="h-full overflow-y-auto pr-2">
                            <Masonry columnsCount={3} gutter="16px">
                                {campaign.CreativeVision.moodboard.images
                                    .filter((image: PinterestImage) =>
                                        activeTag
                                            ? image.keywords.includes(activeTag)
                                            : true,
                                    )
                                    .map((image, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex justify-center mb-4"
                                        >
                                            <img
                                                src={image.imageURL}
                                                alt="moodboard image"
                                                className="rounded-md w-full"
                                            />
                                        </div>
                                    ))}
                            </Masonry>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[60%] ml-8">
                <div className="flex flex-col px-8 py-4 bg-white rounded-lg items-center w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4">
                        Suggested Collaborations
                    </p>
                    <div className="flex flex-row items-start justify-between w-full">
                        <div className="flex flex-col justify-start items-start">
                            {campaign.Engagement.artistCollaborations.perfect
                                .slice(0, 2)
                                .map(
                                    (
                                        collab: ArtistCollaboration,
                                        index: number,
                                    ) => (
                                        <div
                                            key={index}
                                            className="flex flex-row justify-start items-center w-full mt-4"
                                        >
                                            <Image
                                                src={collab.imageURL}
                                                alt={collab.name}
                                                width={39}
                                                height={39}
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "39px",
                                                    height: "39px",
                                                }}
                                            />
                                            <div className="flex flex-col justify-start items-start ml-2">
                                                <p className="text-[14px] text-black flex flex-row items-center">
                                                    {collab.name}
                                                    <Image
                                                        src={SpotifyIcon.src}
                                                        alt="Spotify"
                                                        width={14}
                                                        height={14}
                                                        className="ml-2"
                                                        onClick={() =>
                                                            window.open(
                                                                collab.spotifyURL,
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p className="text-[12px] text-black font-semibold">
                                                    <span className="text-sixtyPBlack font-light">
                                                        Similarity:{" "}
                                                    </span>
                                                    {collab.similarity.toFixed(
                                                        0,
                                                    )}
                                                    %
                                                </p>
                                                {/* <p className="text-[12px] text-black font-semibold">
                                                    <span className="text-sixtyPBlack font-light">
                                                        Audience similarity:{" "}
                                                    </span>
                                                    {(
                                                        collab.audienceSimilarity *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </p> */}
                                            </div>
                                        </div>
                                    ),
                                )}
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            {campaign.Engagement.brandCollaborations.perfect
                                .slice(0, 2)
                                .map(
                                    (
                                        collab: BrandCollaboration,
                                        index: number,
                                    ) => (
                                        <div
                                            key={index}
                                            className="flex flex-row justify-start items-center w-full mt-4"
                                        >
                                            <Image
                                                src={collab.imageURL}
                                                alt={collab.name}
                                                width={39}
                                                height={39}
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "39px",
                                                    height: "39px",
                                                }}
                                            />
                                            <div className="flex flex-col justify-start items-start ml-2">
                                                <p className="text-[14px] text-black flex flex-row items-center">
                                                    {collab.name}
                                                    <Image
                                                        src={InstagramIcon.src}
                                                        alt="Instagram"
                                                        width={14}
                                                        height={14}
                                                        className="ml-2"
                                                        onClick={() =>
                                                            window.open(
                                                                collab.instagramURL,
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p className="text-[12px] text-sixtyPBlack font-light">
                                                    {collab.tags
                                                        .map((tag: string) =>
                                                            camelCaseToTitleCase(
                                                                tag,
                                                            ),
                                                        )
                                                        .join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                        </div>
                        <div className="flex flex-col justify-start items-start max-w-[250px]">
                            <div className="flex flex-row justify-start items-center w-full mt-4">
                                <Image
                                    src={
                                        campaign.Engagement
                                            .editorialPlaylists[0].imageURL
                                    }
                                    alt={
                                        campaign.Engagement
                                            .editorialPlaylists[0].name
                                    }
                                    width={39}
                                    height={39}
                                    className="rounded-md"
                                />
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <p className="text-[14px] text-black flex flex-row items-center">
                                        {trimToLength(
                                            campaign.Engagement
                                                .editorialPlaylists[0].name,
                                            20,
                                        )}
                                        <Image
                                            src={SpotifyIcon.src}
                                            alt="Spotify"
                                            width={14}
                                            height={14}
                                            className="ml-2"
                                            onClick={() =>
                                                window.open(
                                                    campaign.Engagement
                                                        .editorialPlaylists[0]
                                                        .spotifyURL,
                                                )
                                            }
                                        />
                                    </p>
                                    <p className="text-[12px] text-sixtyPBlack">
                                        Editorial Playlist
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-start items-center w-full mt-4">
                                <Image
                                    src={
                                        campaign.Engagement
                                            .thirdPartyPlaylists[0].imageURL
                                    }
                                    alt={
                                        campaign.Engagement
                                            .thirdPartyPlaylists[0].name
                                    }
                                    width={39}
                                    height={39}
                                    className="rounded-md"
                                />
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <p className="text-[14px] text-black flex flex-row items-center">
                                        {trimToLength(
                                            campaign.Engagement
                                                .thirdPartyPlaylists[0].name,
                                            20,
                                        )}
                                        <Image
                                            src={SpotifyIcon.src}
                                            alt="Spotify"
                                            width={14}
                                            height={14}
                                            className="ml-2"
                                            onClick={() =>
                                                window.open(
                                                    campaign.Engagement
                                                        .editorialPlaylists[0]
                                                        .spotifyURL,
                                                )
                                            }
                                        />
                                    </p>
                                    <p className="text-[12px] text-sixtyPBlack">
                                        Third-Party Playlist
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-4 bg-white rounded-lg items-center w-full mt-8">
                    <p className="text-[14px] text-black w-full text-left mb-4 mt-2">
                        Target Audience
                    </p>
                    <div className="w-full">
                        <ListenerMap
                            cities={campaign.Audience.cities}
                            width="100%"
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-4">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mt-2">
                                Listener Age
                            </p>
                            <PieChart
                                series={[
                                    {
                                        data: campaign.Audience.ageDistribution.map(
                                            (
                                                age: PieChartItem,
                                                index: number,
                                            ) => ({
                                                id: index,
                                                value: age.value,
                                                label: camelCaseToTitleCase(
                                                    age.name,
                                                ),
                                                color: PIE_CHART_COLORS[index],
                                            }),
                                        ),
                                        valueFormatter: (item) =>
                                            `${item.value}%`,
                                    },
                                ]}
                                width={200}
                                height={200}
                                margin={{
                                    left: 50,
                                    right: 50,
                                }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mt-2">
                                Listener Sex
                            </p>
                            <PieChart
                                series={[
                                    {
                                        data: campaign.Audience.sexDistribution.map(
                                            (
                                                sex: PieChartItem,
                                                index: number,
                                            ) => ({
                                                id: index,
                                                value: sex.value,
                                                label: camelCaseToTitleCase(
                                                    sex.name,
                                                ),
                                                color: PIE_CHART_COLORS[index],
                                            }),
                                        ),
                                        valueFormatter: (item) =>
                                            `${item.value}%`,
                                    },
                                ]}
                                width={200}
                                height={200}
                                margin={{
                                    left: 50,
                                    right: 50,
                                }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mt-2">
                                Listener Ethnicity
                            </p>
                            <PieChart
                                series={[
                                    {
                                        data: campaign.Audience.ethnicityDistribution.map(
                                            (
                                                ethnicity: PieChartItem,
                                                index: number,
                                            ) => ({
                                                id: index,
                                                value: ethnicity.value,
                                                label: camelCaseToTitleCase(
                                                    trimToLength(
                                                        ethnicity.name,
                                                        10,
                                                    ),
                                                ),
                                                color: PIE_CHART_COLORS[index],
                                            }),
                                        ),
                                        valueFormatter: (item) =>
                                            `${item.value}%`,
                                    },
                                ]}
                                width={200}
                                height={200}
                                margin={{
                                    left: 50,
                                    right: 50,
                                }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
