"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import Wordmark from "@/assets/wordmark.png";
import NavbarIcon from "@/assets/icons/navbar-toggle.png";
import AddTrackIcon from "@/assets/icons/add-track.png";
import SearchIcon from "@/assets/icons/search.png";
import CartIcon from "@/assets/icons/cart.png";
// import AccountIcon from "@/assets/icons/account.png";
import FeedbackIcon from "@/assets/icons/feedback.png";
import LogoutIcon from "@/assets/icons/logout.png";
import ActiveCartIcon from "@/assets/icons/active-cart.png";
import { CampaignOutput } from "@/customTypes";
import { signOut } from "next-auth/react";

type NavbarProps = {
    showUploadModal: boolean;
    setShowUploadModal: (show: boolean) => void;
    campaigns: CampaignOutput[];
    activeCampaign: CampaignOutput | null;
    setActiveCampaign: (campaign: CampaignOutput | null) => void;
    creditsRemaining: number;
    showNavbar: boolean;
    setShowNavbar: (show: boolean) => void;
    isNavbarTransitioning: boolean;
    setIsNavbarTransitioning: (isTransitioning: boolean) => void;
    showFeedbackModal: boolean;
    setShowFeedbackModal: (show: boolean) => void;
};

export const Navbar = ({
    showUploadModal,
    setShowUploadModal,
    campaigns,
    activeCampaign,
    setActiveCampaign,
    creditsRemaining,
    showNavbar,
    setShowNavbar,
    isNavbarTransitioning,
    setIsNavbarTransitioning,
    showFeedbackModal,
    setShowFeedbackModal,
}: NavbarProps) => {
    const handleToggleNavbar = () => {
        setShowNavbar(!showNavbar);
        setIsNavbarTransitioning(true);
        setTimeout(() => {
            setIsNavbarTransitioning(false);
        }, 300);
    };

    const handleGoHome = () => {
        setActiveCampaign(null as CampaignOutput | null);
    };

    return (
        <>
            <AnimatePresence>
                {showNavbar && (
                    <motion.div
                        initial={{ x: -255 }}
                        animate={{ x: 0 }}
                        exit={{ x: -255 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 w-[255px] h-full bg-white flex flex-col justify-between p-4 z-10"
                    >
                        <div className="flex flex-col justify-start">
                            <div className="flex flex-row">
                                <Image
                                    src={Wordmark.src}
                                    alt="Wordmark"
                                    width={129}
                                    height={34}
                                    onClick={handleGoHome}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>

                            <div className="flex flex-row mt-8 items-center justify-between">
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="bg-navy rounded px-4 py-2 flex items-center justify-center w-[180px]"
                                >
                                    <Image
                                        src={AddTrackIcon.src}
                                        alt="Add Track"
                                        width={12}
                                        height={12}
                                        className="mr-2"
                                    />
                                    New Track
                                </button>
                                <button
                                    className="bg-[#EFEFEF] rounded w-[36px] h-[36px] flex flex-row items-center justify-center"
                                    onClick={() => {
                                        setActiveCampaign(
                                            null as CampaignOutput | null,
                                        );
                                    }}
                                >
                                    <Image
                                        src={SearchIcon.src}
                                        alt="Search"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>

                            <div className="text-left mt-6 text-textGrey text-[10px] font-semibold">
                                Today
                            </div>
                            <div className="flex flex-col w-full -mx-4">
                                {(
                                    campaigns.filter(
                                        (campaign: CampaignOutput) => {
                                            const now = new Date();
                                            const twentyFourHoursAgo = new Date(
                                                now.getTime() -
                                                    24 * 60 * 60 * 1000,
                                            );
                                            const campaignDate = new Date(
                                                campaign.date,
                                            );
                                            const accessedDate = new Date(
                                                campaign.accessed,
                                            );
                                            return (
                                                campaignDate >
                                                    twentyFourHoursAgo ||
                                                accessedDate >
                                                    twentyFourHoursAgo
                                            );
                                        },
                                    ) || []
                                ).map((campaign: CampaignOutput) => (
                                    <button
                                        key={campaign.id}
                                        className={`w-full min-w-[calc(100%+16px)] text-left mr-2 pr-2 pl-2 ml-2 py-[6px] mt-2 rounded-md ${
                                            campaign.id === activeCampaign?.id
                                                ? "bg-activeBg font-semibold"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setActiveCampaign(campaign);
                                        }}
                                    >
                                        <p className="text-black text-[14px]">
                                            {campaign.trackInfo.name}
                                        </p>
                                        <p className="text-textGrey text-[10px]">
                                            {campaign.trackInfo.artist.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            {/* <div className="flex flex-col w-full -mx-4">
                                <button
                                    className="w-full min-w-[calc(100%+16px)] text-left mr-2 pr-2 pl-2 ml-2 py-[10px] mt-2 rounded-md flex flex-row items-center justify-start"
                                    onClick={() => setShowCreditsPage(true)}
                                    style={{
                                        backgroundColor: showCreditsPage
                                            ? "rgba(21, 19, 121, 0.1)"
                                            : "rgba(0, 0, 0, 0.04)",
                                    }}
                                >
                                    <Image
                                        src={
                                            showCreditsPage
                                                ? ActiveCartIcon.src
                                                : CartIcon.src
                                        }
                                        alt="Cart"
                                        width={15}
                                        height={15}
                                        className="mr-[12px]"
                                        style={{}}
                                    />
                                    <span
                                        className="text-[16px] mr-[4px]"
                                        style={{
                                            color: showCreditsPage
                                                ? "#151379"
                                                : "black",
                                        }}
                                    >
                                        {creditsRemaining}
                                    </span>
                                    <p
                                        className="text-[14px]"
                                        style={{
                                            color: showCreditsPage
                                                ? "#151379"
                                                : "rgba(0, 0, 0, 0.7)",
                                        }}
                                    >
                                        credits remaining
                                    </p>
                                </button>
                            </div> */}

                            <div className="h-[1px] bg-thirtyPBlack mt-4 mb-2 px-4 w-full" />

                            {/* <div className="flex flex-col w-full -mx-4">
                                <button
                                    className="w-full min-w-[calc(100%+16px)] text-left mr-2 pr-2 pl-2 ml-2 py-[8px] rounded-md flex flex-row items-center justify-start"
                                    onClick={() => null}
                                >
                                    <Image
                                        src={AccountIcon.src}
                                        alt="Account"
                                        width={23}
                                        height={23}
                                        className="mr-[12px]"
                                    />
                                    <p className="text-fiftyPBlack text-[14px]">
                                        My Account
                                    </p>
                                </button>
                            </div> */}

                            <div className="flex flex-col w-full -mx-4">
                                <button
                                    className="w-full min-w-[calc(100%+16px)] text-left mr-2 pr-2 pl-2 ml-2 py-[8px] rounded-md flex flex-row items-center justify-start"
                                    onClick={() => setShowFeedbackModal(true)}
                                >
                                    <Image
                                        src={FeedbackIcon.src}
                                        alt="Feedback"
                                        width={21}
                                        height={21}
                                        className="mr-[12px]"
                                    />
                                    <p className="text-fiftyPBlack text-[14px]">
                                        Send Feedback
                                    </p>
                                </button>
                            </div>

                            <div className="flex flex-col w-full -mx-4">
                                <button
                                    className="w-full min-w-[calc(100%+16px)] text-left mr-2 pr-2 pl-2 ml-2 py-[8px] rounded-md flex flex-row items-center justify-start"
                                    onClick={() => signOut()}
                                >
                                    <Image
                                        src={LogoutIcon.src}
                                        alt="Log Out"
                                        width={21}
                                        height={21}
                                        className="mr-[12px]"
                                    />
                                    <p className="text-fiftyPBlack text-[14px]">
                                        Log Out
                                    </p>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                animate={{
                    x: showNavbar ? 220 : 16,
                    rotate: showNavbar ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleToggleNavbar()}
                className="fixed top-[25px] left-0 bg-transparent border-none cursor-pointer z-10"
            >
                <Image
                    src={NavbarIcon.src}
                    alt="Toggle Navbar"
                    width={17}
                    height={17}
                />
            </motion.button>
        </>
    );
};
