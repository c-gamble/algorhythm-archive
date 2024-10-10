"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CampaignOutput, KeyTrait, NotableMoment, Track } from "@/customTypes";
import { AudioVisualizer } from "@/components/track/analysis/audio-visualizer/AudioVisualizer";
import Image from "next/image";
import axios from "axios";

import PlayIcon from "@/assets/icons/play.png";
import PauseIcon from "@/assets/icons/pause.png";
import RefreshIcon from "@/assets/icons/refresh.png";
import { FeatureChart } from "@/components/track/analysis/feature-chart/FeatureChart";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const Analysis = ({
    campaign,
    handleRefresh,
    view,
    blobCache,
    isNavbarTransitioning,
}: {
    campaign: CampaignOutput;
    handleRefresh: (field: string) => void;
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

        if (view !== "analysis") {
            stopAudio();
        }

        // Cleanup function to ensure audio stops when component unmounts
        return () => {
            stopAudio();
        };
    }, [view, campaign]);
    return (
        <div className="flex flex-col justify-start mt-8 w-full">
            <div className="flex flex-row justify-between mt-4 w-full">
                <div
                    ref={parentDivRef}
                    className="bg-white flex flex-col items-start justify-between px-[16px] py-6 rounded-lg w-full"
                >
                    <p className="text-black text-[14px]">
                        What Will Stick with Listeners
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
                                        {moment.description.split(":")[0]} (
                                        {formatTime(moment.start)} -{" "}
                                        {formatTime(moment.end)})
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
                                    </div>
                                </div>
                            ),
                        )}
                </div>
                {/* <div className="bg-white flex flex-col items-start justify-start px-[16px] py-6 ml-8 rounded-lg w-[30%]">
                    <p className="text-[14px] text-black ">
                        Similar Sounding Tracks
                    </p>
                    {campaign.Analysis.similarTracks.length > 0 &&
                        campaign.Analysis.similarTracks.map(
                            (track: Track, index: number) => (
                                <div
                                    key={index}
                                    className="flex flex-row items-center justify-start w-full mt-4"
                                >
                                    <Image
                                        src={track.imageURL}
                                        alt={track.name}
                                        height={45}
                                        width={45}
                                        className="mr-4 rounded-md"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-[14px] text-black">
                                            {track.name}
                                        </p>
                                        <p className="text-[14px] text-sixtyPBlack">
                                            {track.artist.name}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                </div> */}
            </div>
            <div className="flex flex-row w-full rounded-lg bg-white mt-8">
                <div className="flex flex-row items-center justify-between p-8 w-full">
                    <div className="flex-shrink-0">
                        <FeatureChart
                            audioFeatures={campaign.Analysis.audioFeatures}
                            axisColor="#000000b3"
                            textColor=""
                            displayColor="blue"
                            height={400}
                            width={400}
                            textSize={10}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-start ml-12 mt-10 flex-grow h-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            <p className="text-[14px] text-black">
                                Your track&apos;s key traits:
                            </p>
                            {/* <Image
                                src={RefreshIcon.src}
                                alt="Refresh"
                                height={14}
                                width={14}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleRefresh("Analysis.keyTraits")
                                }
                            /> */}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                            {campaign.Analysis.keyTraits.map(
                                (keyTrait: KeyTrait, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-start justify-start p-4 bg-greyBg rounded-lg"
                                    >
                                        <p className="text-[14px] text-black">
                                            {keyTrait.name}
                                        </p>
                                        <p className="text-[12px] text-sixtyPBlack mt-[4px]">
                                            {keyTrait.description}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
