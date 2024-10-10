import React, { useState } from "react";
import Image from "next/image";
import { ArtistCollaboration, BrandCollaboration } from "@/customTypes";
import ChevronIcon from "@/assets/icons/chevron-down.png";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";

interface CollaborationSelectorProps {
    artistCollaborations: ArtistCollaboration[];
    brandCollaborations: BrandCollaboration[];
    activeCollaboration: ArtistCollaboration | BrandCollaboration;
    setActiveCollaboration: (
        collaboration: ArtistCollaboration | BrandCollaboration,
    ) => void;
}

export const CollaborationSelector: React.FC<CollaborationSelectorProps> = ({
    artistCollaborations,
    brandCollaborations,
    activeCollaboration,
    setActiveCollaboration,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const allCollaborations: (ArtistCollaboration | BrandCollaboration)[] = [
        ...artistCollaborations,
        ...brandCollaborations,
    ];

    const handleSelect = (
        collaboration: ArtistCollaboration | BrandCollaboration,
    ) => {
        setActiveCollaboration(collaboration);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <div
                className="flex items-center justify-between w-full p-2 bg-white rounded-md cursor-pointer text-black text-[11px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {activeCollaboration ? (
                    <div className="flex items-center">
                        <Image
                            src={activeCollaboration.imageURL}
                            alt={activeCollaboration.name}
                            width={19}
                            height={19}
                            className="rounded-md mr-2"
                        />
                        <span>{activeCollaboration.name}</span>
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
                    {allCollaborations.map((collaboration, index) => (
                        <div
                            key={index}
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(collaboration)}
                        >
                            <Image
                                src={collaboration.imageURL}
                                alt={collaboration.name}
                                width={30}
                                height={30}
                                className="rounded-md mr-2"
                            />
                            <span>{collaboration.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
