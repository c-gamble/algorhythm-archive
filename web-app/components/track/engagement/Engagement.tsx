import {
    ArtistCollaboration,
    BrandCollaboration,
    CampaignOutput,
    Playlist,
} from "@/customTypes";
// import RefreshIcon from "@/assets/icons/refresh.png";
import SpotifyIcon from "@/assets/icons/spotify.png";
import InstagramIcon from "@/assets/icons/instagram.png";
import CopyIcon from "@/assets/icons/copy.png";
// import RegenerateIcon from "@/assets/icons/regenerate.png";
import { useState } from "react";
import Image from "next/image";
import { camelCaseToTitleCase, trimToLength } from "@/utils/text";
import { PlaylistSelector } from "@/components/track/engagement/PlaylistSelector";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";

export const Engagement = ({
    campaign,
    handleRefresh,
}: {
    campaign: CampaignOutput;
    handleRefresh: (field: string) => void;
}) => {
    const [activePlaylist, setActivePlaylist] = useState<Playlist>(
        campaign.Engagement.editorialPlaylists[0],
    );
    const [suggestedPitch, setSuggestedPitch] = useState<string>(
        campaign.Engagement.editorialPlaylists[0].suggestedPitch,
    );

    useEffect(() => {
        setSuggestedPitch(activePlaylist.suggestedPitch);
    }, [activePlaylist]);

    const handlePitchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuggestedPitch(e.target.value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestedPitch);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="flex flex-row mt-8 w-full">
            <div className="flex flex-col w-[70%]">
                <div className="flex flex-col py-4 px-8 bg-white rounded-lg items-start w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4 mt-2">
                        Suggested Artist Collaborations
                    </p>
                    <div className="flex flex-row items-start justify-between w-full">
                        <div className="flex flex-col justify-start items-start mr-8">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Larger than you
                                </p>
                                {/* <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.artistCollaborations.larger",
                                        )
                                    }
                                /> */}
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.artistCollaborations.larger.map(
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
                        </div>
                        <div className="flex flex-col justify-start items-start mr-8">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Perfect fit
                                </p>
                                {/* <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.artistCollaborations.perfect",
                                        )
                                    }
                                /> */}
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.artistCollaborations.perfect.map(
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
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Smaller than you
                                </p>
                                {/* <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.artistCollaborations.smaller",
                                        )
                                    }
                                /> */}
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.artistCollaborations.smaller.map(
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
                                                            // open in new tab
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
                        </div>
                    </div>
                </div>
                <div className="flex flex-col py-4 px-8 bg-white rounded-lg items-start w-full mt-8">
                    <p className="text-[14px] text-black w-full text-left mb-4 mt-2">
                        Suggested Brand &amp; Creator Collaborations
                    </p>
                    {/* <div className="flex flex-row items-start justify-between w-full">
                        <div className="flex flex-col justify-start items-start mr-8">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Larger than you
                                </p>
                                <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.brandCollaborations.larger",
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.brandCollaborations.larger.map(
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
                                                className="rounded-md"
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
                                                <p className="text-[12px] text-sixtyPBlack">
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
                        </div>
                        <div className="flex flex-col justify-start items-start mr-8">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Perfect fit
                                </p>
                                <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.brandCollaborations.perfect",
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.brandCollaborations.perfect.map(
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
                                                className="rounded-md"
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
                                                <p className="text-[12px] text-sixtyPBlack">
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
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-[14px] text-black mr-2 text-seventyFivePBlack">
                                    Smaller than you
                                </p>
                                <Image
                                    src={RefreshIcon.src}
                                    alt="Refresh"
                                    width={12}
                                    height={12}
                                    onClick={() =>
                                        handleRefresh(
                                            "Engagement.brandCollaborations.smaller",
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start w-full">
                                {campaign.Engagement.brandCollaborations.smaller.map(
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
                                                className="rounded-md"
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
                                                <p className="text-[12px] text-sixtyPBlack">
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
                        </div>
                    </div> */}
                    <div className="flex flex-col items-center justify-center w-full text-black mt-12 mb-12 text-[14px]">
                        Coming soon!
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[30%] ml-8 p-4 bg-white rounded-lg">
                <p className="text-[14px] text-black w-full text-left mt-2">
                    Suggested Editorial Playlists to Pitch
                </p>
                <div className="flex flex-col justify-start items-start w-full">
                    {campaign.Engagement.editorialPlaylists.map(
                        (playlist: Playlist, index: number) => (
                            <div
                                key={index}
                                className="flex flex-row justify-start items-center w-full mt-4"
                            >
                                <Image
                                    src={playlist.imageURL}
                                    alt={playlist.name}
                                    width={39}
                                    height={39}
                                    className="rounded-md"
                                />
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <p className="text-[14px] text-black flex flex-row items-center">
                                        {trimToLength(playlist.name, 15)}
                                        <Image
                                            src={SpotifyIcon.src}
                                            alt="Spotify"
                                            width={14}
                                            height={14}
                                            className="ml-2"
                                            onClick={() =>
                                                window.open(playlist.spotifyURL)
                                            }
                                        />
                                    </p>
                                    <p className="text-[12px] text-sixtyPBlack">
                                        {playlist.description}
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </div>
                <p className="text-[14px] text-black w-full text-left mt-8">
                    Suggested 3rd Party Playlists to Pitch
                </p>
                <div className="flex flex-col justify-start items-start w-full">
                    {campaign.Engagement.thirdPartyPlaylists.map(
                        (playlist: Playlist, index: number) => (
                            <div
                                key={index}
                                className="flex flex-row justify-start items-center w-full mt-4"
                            >
                                <Image
                                    src={playlist.imageURL}
                                    alt={playlist.name}
                                    width={39}
                                    height={39}
                                    className="rounded-md"
                                />
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <p className="text-[14px] text-black flex flex-row items-center">
                                        {trimToLength(playlist.name, 15)}
                                        <Image
                                            src={SpotifyIcon.src}
                                            alt="Spotify"
                                            width={14}
                                            height={14}
                                            className="ml-2"
                                            onClick={() =>
                                                window.open(playlist.spotifyURL)
                                            }
                                        />
                                    </p>
                                    <p className="text-[12px] text-sixtyPBlack">
                                        {playlist.description}
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </div>

                <div className="flex justify-center items-center w-full mt-8 px-4">
                    <div className="flex flex-col rounded-lg bg-backgroundGrey w-full p-4">
                        <p className="text-[14px] text-black w-full text-left">
                            Craft your pitch to a playlist
                        </p>
                        <div className="flex flex-col w-full px-4 bg-white rounded-md mt-4 border-2 border-tenPBlack">
                            <PlaylistSelector
                                editorialPlaylists={
                                    campaign.Engagement.editorialPlaylists
                                }
                                thirdPartyPlaylists={
                                    campaign.Engagement.thirdPartyPlaylists
                                }
                                activePlaylist={activePlaylist}
                                setActivePlaylist={setActivePlaylist}
                            />
                        </div>
                        <p className="text-[11px] text-black w-full text-left mt-4 flex flex-row items-center justify-between">
                            Suggested description
                            <div className="flex flex-row items-center">
                                <Image
                                    src={CopyIcon.src}
                                    alt="Copy"
                                    width={10}
                                    height={10}
                                    onClick={handleCopy}
                                    className="mr-4"
                                />
                                {/* <Image
                                    src={RegenerateIcon.src}
                                    alt="Regenerate"
                                    width={10}
                                    height={10}
                                /> */}
                            </div>
                        </p>
                        <textarea
                            className="w-full text-[11px] resize-none p-4 bg-white rounded-md text-sixtyPBlack mt-2 min-h-[120px]"
                            value={suggestedPitch}
                            onChange={handlePitchChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
