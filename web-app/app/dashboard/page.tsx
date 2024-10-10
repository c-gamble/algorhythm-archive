"use client";

import { Navbar } from "@/components/global/Navbar";
import { UploadModal } from "@/components/global/UploadModal";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { UserData, CampaignOutput } from "@/customTypes";
import Image from "next/image";
import axios from "axios";
import { LoadingWave } from "@/components/global/LoadingWave";
import SearchIcon from "@/assets/icons/search.png";
import SortIcon from "@/assets/icons/sort.png";
import AddTrackIcon from "@/assets/icons/add-track.png";
import NoCampaigns from "@/assets/no-campaigns.png";
import { Overview } from "@/components/track/overview/Overview";
import { CreativeVision } from "@/components/track/creative-vision/CreativeVision";
import { Engagement } from "@/components/track/engagement/Engagement";
import { Audience } from "@/components/track/audience/Audience";
import { Analysis } from "@/components/track/analysis/Analysis";
import { SortModal } from "@/components/global/SortModal";
import { toast } from "react-hot-toast";
import { AuthenticatedImage } from "@/components/global/AuthenticatedImage";
import { FeedbackModal } from "@/components/global/FeedbackModal";

const blobCache: { [key: string]: Blob } = {};

export default function Page() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [showNavbar, setShowNavbar] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [view, setView] = useState("analysis");
    const [activeCampaign, setActiveCampaign] = useState<CampaignOutput | null>(
        null,
    );
    const [isNavbarTransitioning, setIsNavbarTransitioning] = useState(false);
    const [userData, setUserData] = useState(null as UserData | null);
    const [searchQuery, setSearchQuery] = useState("");
    const [displayedCampaigns, setDisplayedCampaigns] = useState<
        CampaignOutput[]
    >([]);
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const [currentSort, setCurrentSort] = useState("Newest first");

    const sortCampaigns = (
        campaigns: CampaignOutput[],
        option: string,
    ): CampaignOutput[] => {
        const sorted = [...campaigns];
        switch (option) {
            case "Newest first":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );
            case "Oldest first":
                return sorted.sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                );
            case "Track title: A-Z":
                return sorted.sort((a, b) =>
                    a.trackInfo.name.localeCompare(b.trackInfo.name),
                );
            case "Artist first name: A-Z":
                return sorted.sort((a, b) =>
                    a.trackInfo.artist.name
                        .split(" ")[0]
                        .localeCompare(b.trackInfo.artist.name.split(" ")[0]),
                );
            case "Artist last name: A-Z":
                return sorted.sort((a, b) => {
                    const aLastName = a.trackInfo.artist.name
                        .split(" ")
                        .slice(-1)[0];
                    const bLastName = b.trackInfo.artist.name
                        .split(" ")
                        .slice(-1)[0];
                    return aLastName.localeCompare(bLastName);
                });
            case "Last accessed":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.accessed || 0).getTime() -
                        new Date(a.accessed || 0).getTime(),
                );
            default:
                return sorted;
        }
    };

    const handleSort = (option: string) => {
        setCurrentSort(option);
        const sorted = sortCampaigns(displayedCampaigns, option);
        setDisplayedCampaigns(sorted);
    };

    const handleSetActiveCampaign = async (campaign: CampaignOutput | null) => {
        if (campaign === null) {
            setActiveCampaign(null);
            setView("analysis");
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/update/accessed/${campaign.id}`,
            );
            if (response.status === 200) {
                setActiveCampaign(campaign);
                setSearchQuery("");
                setView("analysis");
            } else {
                console.error("Error updating campaign:", response.data.error);
                toast.error("Error updating campaign!");
            }
        } catch (error: any) {
            console.error("Error fetching campaign:", error);
            toast.error("Error fetching campaign!");
        }
    };

    const handleRefresh = (field: string) => {};

    const onSuccessfulUpload = async () => {
        toast.success("Track uploaded successfully!");
        if (session?.user?.id) {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/${session.user.id}`,
                );
                if (response.data.status === 200) {
                    setUserData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    useEffect(() => {
        if (userData?.campaigns) {
            const sorted = sortCampaigns(userData.campaigns, currentSort);
            setDisplayedCampaigns(sorted);
        }
    }, [userData?.campaigns]);

    useEffect(() => {
        if (userData?.campaigns) {
            let filtered = userData.campaigns.filter(
                (campaign) =>
                    campaign.trackInfo.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    campaign.trackInfo.artist.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );

            // Apply the current sort
            const sorted = sortCampaigns(filtered, currentSort);

            setDisplayedCampaigns(sorted);
        }
    }, [searchQuery, userData?.campaigns, currentSort]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.email) {
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/user/${session.user.id}`,
                    );
                    if (response.data.status === 200) {
                        setUserData(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setIsLoading(false);
        };

        if (status !== "loading") {
            fetchUserData();
        }
    }, [session, status]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-backgroundGrey flex justify-center items-center">
                <LoadingWave />
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="h-full w-full flex">
            {showUploadModal && (
                <UploadModal
                    setShowUploadModal={setShowUploadModal}
                    onSuccessfulUpload={onSuccessfulUpload}
                />
            )}
            {showFeedbackModal && (
                <FeedbackModal setShowFeedbackModal={setShowFeedbackModal} />
            )}
            <Navbar
                showUploadModal={showUploadModal}
                setShowUploadModal={setShowUploadModal}
                campaigns={userData?.campaigns || []}
                activeCampaign={activeCampaign}
                setActiveCampaign={handleSetActiveCampaign}
                creditsRemaining={userData?.creditsRemaining || 0}
                showNavbar={showNavbar}
                setShowNavbar={setShowNavbar}
                isNavbarTransitioning={isNavbarTransitioning}
                setIsNavbarTransitioning={setIsNavbarTransitioning}
                showFeedbackModal={showFeedbackModal}
                setShowFeedbackModal={setShowFeedbackModal}
            />
            <div
                className={`flex-grow h-full bg-backgroundGrey transition-all duration-300 ease-in-out ${
                    showNavbar ? "ml-[255px]" : "ml-0"
                }`}
            >
                <div className="w-full flex flex-col justify-start items-start px-10 pt-24">
                    {activeCampaign && (
                        <>
                            <div className="w-full text-left flex items-center h-[49px]">
                                <AuthenticatedImage
                                    src={activeCampaign.trackInfo.imageURL}
                                    alt={activeCampaign.trackInfo.name}
                                    height={49}
                                    width={49}
                                    className="rounded-md mr-4"
                                />
                                <div className="flex flex-col justify-center h-full">
                                    <p className="text-[22px] font-medium text-black leading-tight">
                                        {activeCampaign.trackInfo.name}
                                    </p>
                                    <p className="text-[14px] font-normal text-sixtyPBlack leading-tight">
                                        {activeCampaign.trackInfo.artist.name}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[calc(100%+5rem)] -ml-[2.5rem] flex flex-row mt-10 border-b border-solid border-twentyPBlack">
                                {[
                                    "analysis",
                                    "audience",
                                    "engagement",
                                    "creative-vision",
                                    "overview",
                                ].map((buttonView) => (
                                    <button
                                        key={buttonView}
                                        className={`font-medium text-[16px] px-4 ${
                                            view === buttonView
                                                ? "text-black"
                                                : "text-fortyPBlack"
                                        } pb-4 relative w-[200px]`}
                                        onClick={() => setView(buttonView)}
                                    >
                                        <span className="block truncate">
                                            {buttonView === "creative-vision"
                                                ? "Creative Vision"
                                                : buttonView === "overview"
                                                ? "Track Overview"
                                                : buttonView
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  buttonView.slice(1)}
                                        </span>
                                        <span
                                            className={`absolute -bottom-[1.25px] left-0 right-0 h-[2px] ${
                                                view === buttonView
                                                    ? "bg-black"
                                                    : "bg-transparent"
                                            }`}
                                        ></span>
                                    </button>
                                ))}
                            </div>
                            {view === "analysis" ? (
                                <Analysis
                                    campaign={activeCampaign}
                                    handleRefresh={handleRefresh}
                                    view={view}
                                    blobCache={blobCache}
                                    isNavbarTransitioning={
                                        isNavbarTransitioning
                                    }
                                />
                            ) : view === "audience" ? (
                                <Audience campaign={activeCampaign} />
                            ) : view === "engagement" ? (
                                <Engagement
                                    campaign={activeCampaign}
                                    handleRefresh={handleRefresh}
                                />
                            ) : view === "creative-vision" ? (
                                <CreativeVision campaign={activeCampaign} />
                            ) : (
                                view === "overview" && (
                                    <Overview
                                        campaign={activeCampaign}
                                        view={view}
                                        blobCache={blobCache}
                                        isNavbarTransitioning={
                                            isNavbarTransitioning
                                        }
                                    />
                                )
                            )}
                        </>
                    )}
                    {!activeCampaign && (
                        <>
                            <div className="w-full text-left">
                                <p className="text-[26px] font-medium text-black">
                                    Welcome, {userData?.name.split(" ")[0]}
                                </p>
                                <p className="text-[16px] text-black font-light">
                                    Your Campaigns
                                </p>
                            </div>

                            {userData?.campaigns &&
                            userData?.campaigns.length > 0 ? (
                                <>
                                    <div className="w-full flex flex-row justify-start items-center mt-8">
                                        <div className="w-[calc(100%-87px-12px-160px-12px)] mr-[12px] relative">
                                            <input
                                                type="text"
                                                placeholder="Search by track or artist name..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full text-[16px] text-black font-light px-4 py-2 pr-10 rounded-md border bg-white border-[#E5E5E5]"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <Image
                                                    src={SearchIcon.src}
                                                    alt="Search"
                                                    height={24}
                                                    width={24}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setShowSortModal(!showSortModal)
                                            }
                                            ref={sortButtonRef}
                                            className="w-[87px] mr-[12px] flex flex-row justify-center items-center px-4 py-2 rounded-md bg-white text-sixtyPBlack font-light text-[16px] shadow-sm"
                                        >
                                            <Image
                                                src={SortIcon.src}
                                                alt="Sort"
                                                height={14}
                                                width={16}
                                                className="mr-2"
                                            />
                                            Sort
                                        </button>
                                        <SortModal
                                            isOpen={showSortModal}
                                            onClose={() =>
                                                setShowSortModal(false)
                                            }
                                            onSort={handleSort}
                                            buttonRef={sortButtonRef}
                                        />
                                        <button
                                            onClick={() =>
                                                setShowUploadModal(true)
                                            }
                                            className="w-[160px] flex flex-row justify-center items-center px-4 py-2 rounded-md bg-navy text-white font-light text-[16px]"
                                        >
                                            <Image
                                                src={AddTrackIcon.src}
                                                alt="Sort"
                                                height={13.5}
                                                width={13.5}
                                                className="mr-2"
                                            />
                                            New Track
                                        </button>
                                    </div>

                                    <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 w-full">
                                        {displayedCampaigns.map(
                                            (campaign: CampaignOutput) => (
                                                <button
                                                    key={campaign.id}
                                                    className="rounded-md relative shadow-md w-[250px] h-[250px] text-left"
                                                    onClick={() =>
                                                        handleSetActiveCampaign(
                                                            campaign,
                                                        )
                                                    }
                                                >
                                                    <AuthenticatedImage
                                                        src={
                                                            campaign.trackInfo
                                                                .imageURL
                                                        }
                                                        alt={
                                                            campaign.trackInfo
                                                                .name
                                                        }
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-md"
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-white px-2 py-[8px] rounded-b-md">
                                                        <p className="text-[16px] font-medium text-black truncate">
                                                            {
                                                                campaign
                                                                    .trackInfo
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-[16px] font-light text-black tracking-wide truncate">
                                                            {
                                                                campaign
                                                                    .trackInfo
                                                                    .artist.name
                                                            }
                                                            ,{" "}
                                                            {new Date(
                                                                campaign.date,
                                                            ).getMonth() + 1}
                                                            /
                                                            {new Date(
                                                                campaign.date,
                                                            ).getDate()}
                                                            /
                                                            {new Date(
                                                                campaign.date,
                                                            ).getFullYear()}
                                                        </p>
                                                    </div>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex flex-col justify-center items-center mt-[20vh] text-center">
                                    <Image
                                        src={NoCampaigns.src}
                                        alt="No campaigns"
                                        height={180}
                                        width={184}
                                    />
                                    <p className="text-[20px] font-medium text-sixtyPBlack mt-6">
                                        No campaigns yet!
                                    </p>
                                    <p className="text-[16px] font-regular text-fiftyPBlack mt-2 max-w-[280px]">
                                        Click the &quot;+ New Track&quot; button
                                        to start a new campaign
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
