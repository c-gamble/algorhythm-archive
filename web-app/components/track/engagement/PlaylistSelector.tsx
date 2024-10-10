import React, { useState } from "react";
import Image from "next/image";
import { Playlist } from "@/customTypes";
import ChevronIcon from "@/assets/icons/chevron-down.png";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";
import { trimToLength } from "@/utils/text";

interface PlaylistSelectorProps {
    editorialPlaylists: Playlist[];
    thirdPartyPlaylists: Playlist[];
    activePlaylist: Playlist;
    setActivePlaylist: (playlist: Playlist) => void;
}

export const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({
    editorialPlaylists,
    thirdPartyPlaylists,
    activePlaylist,
    setActivePlaylist,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const allPlaylists: Playlist[] = [
        ...editorialPlaylists,
        ...thirdPartyPlaylists,
    ];

    const handleSelect = (playlist: Playlist) => {
        setActivePlaylist(playlist);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <div
                className="flex items-center justify-between w-full p-2 bg-white rounded-md cursor-pointer text-black text-[11px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {activePlaylist ? (
                    <div className="flex items-center">
                        <Image
                            src={activePlaylist.imageURL}
                            alt={activePlaylist.name}
                            width={19}
                            height={19}
                            className="rounded-md mr-2"
                        />
                        <span>{activePlaylist.name}</span>
                    </div>
                ) : (
                    <span>Select a playlist</span>
                )}
                <Image
                    src={ChevronIcon}
                    alt="chevron"
                    width={8}
                    className={`w-4 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto text-black text-[11px]">
                    {allPlaylists.map((playlist, index) => (
                        <div
                            key={index}
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(playlist)}
                        >
                            <Image
                                src={playlist.imageURL}
                                alt={playlist.name}
                                width={30}
                                height={30}
                                className="rounded-md mr-2"
                            />
                            <span>{trimToLength(playlist.name, 15)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
