import {
    CampaignOutput,
    PinterestImage,
    Track,
    ArtistCollaboration,
    BrandCollaboration,
    SpecificMoodboardImages,
} from "@/customTypes";
import { camelCaseToTitleCase } from "@/utils/text";
import Image from "next/image";
import { useState } from "react";
import Masonry from "react-responsive-masonry";
import { CollaborationSelector } from "@/components/track/creative-vision/CollaborationSelector";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";

export const CreativeVision = ({ campaign }: { campaign: CampaignOutput }) => {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [activeCollaboration, setActiveCollaboration] = useState<
        ArtistCollaboration | BrandCollaboration
    >(campaign.Engagement.artistCollaborations.larger[0]);

    return (
        <div className="flex flex-row mt-8 w-full items-center justify-center">
            <div className="flex flex-col w-[90%] bg-white py-4 px-8 rounded-lg max-h-[calc(100vh-300px)] overflow-y-scroll">
                <p className="text-[14px] text-black w-full text-left mb-4">
                    Moodboard
                </p>
                <div className="w-full flex flex-row justify-start items-center">
                    {campaign.CreativeVision.moodboard.keywords.map(
                        (keyword: string, index: number) => (
                            <button
                                key={index}
                                className="flex flex-row items-center justify-center rounded-md px-4 py-2 mr-4"
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
                <div className="flex w-full mt-4">
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
                                    className="w-full flex justify-center"
                                >
                                    <img
                                        src={image.imageURL}
                                        alt="moodboard image"
                                        className="rounded-md"
                                    />
                                </div>
                            ))}
                    </Masonry>
                </div>
            </div>
            {/* <div className="flex flex-col w-[40%] ml-8">
                <div className="flex flex-col p-4 bg-white rounded-lg items-center w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4">
                        Similar Release Campaigns
                    </p>
                    <div className="flex flex-row justify-between space-x-4 items-center w-full">
                        {campaign.CreativeVision.similarCampaigns.map(
                            (track: Track, index: number) => (
                                <div key={index} className="flex flex-col">
                                    <Image
                                        src={track.imageURL}
                                        alt="track image"
                                        width={128}
                                        height={128}
                                        className="rounded-md"
                                    />
                                    <p className="text-[14px] text-black w-full text-left mt-2">
                                        {track.name}
                                    </p>
                                    <p className="text-[14px] text-sixtyPBlack w-full text-left -mt-[2px]">
                                        {track.artist.name}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-4 bg-white rounded-lg items-center w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4">
                        Ideas for Your Campaigns
                    </p>
                    <div className="flex flex-row justify-start items-center w-full">
                        <p className="text-[14px] text-sixtyPBlack mr-2 text-left">
                            A collaboration with
                        </p>
                        <div className="border-2 border-tenPBlack rounded-md min-w-[200px]">
                            <CollaborationSelector
                                artistCollaborations={[
                                    ...campaign.Engagement.artistCollaborations
                                        .larger,
                                    ...campaign.Engagement.artistCollaborations
                                        .perfect,
                                    ...campaign.Engagement.artistCollaborations
                                        .smaller,
                                ]}
                                brandCollaborations={[
                                    ...campaign.Engagement.brandCollaborations
                                        .larger,
                                    ...campaign.Engagement.brandCollaborations
                                        .perfect,
                                    ...campaign.Engagement.brandCollaborations
                                        .smaller,
                                ]}
                                activeCollaboration={activeCollaboration}
                                setActiveCollaboration={setActiveCollaboration}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center w-full mt-4">
                        <Masonry columnsCount={3} gutter="16px">
                            {campaign.CreativeVision.suggestedCampaigns
                                .filter(
                                    (
                                        suggestedCampaign: SpecificMoodboardImages,
                                    ) =>
                                        suggestedCampaign.collaborator.name ===
                                        activeCollaboration.name,
                                )[0]
                                .images.map((image: string, index: number) => (
                                    <div
                                        key={index}
                                        className="w-full flex justify-center"
                                    >
                                        <Image
                                            src={image}
                                            alt="suggested campaign image"
                                            className="rounded-md"
                                            height={128}
                                            width={128}
                                        />
                                    </div>
                                ))}
                        </Masonry>
                    </div>
                </div>
            </div> */}
        </div>
    );
};
