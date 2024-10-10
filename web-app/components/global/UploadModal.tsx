import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UploadIcon from "@/assets/icons/upload.png";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoadingWave } from "@/components/global/LoadingWave";
import { upload } from "@vercel/blob/client";

const analysisMessages = [
    "Processing audio file...",
    "Extracting lyrics...",
    "Analyzing audio features...",
    "Highlighting key traits...",
    "Listening for what will stick...",
    "Identifying your ideal listeners...",
    "Writing playlist pitches...",
    "Assembling collaborations...",
    "Building your creative vision...",
    "Saving your campaign...",
];

export const UploadModal = ({
    setShowUploadModal,
    onSuccessfulUpload,
}: {
    setShowUploadModal: (show: boolean) => void;
    onSuccessfulUpload: () => void;
}) => {
    const [isFile, setIsFile] = useState(true);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [artist, setArtist] = useState("");
    const [instagramURL, setInstagramURL] = useState("");
    const [spotifyURL, setSpotifyURL] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisMessage, setAnalysisMessage] = useState(
        "Analyzing your music...",
    );

    const modalRef = useRef<HTMLDivElement>(null);
    const audioDropzoneRef = useRef<HTMLDivElement>(null);
    const imageDropzoneRef = useRef<HTMLDivElement>(null);
    const audioFileInputRef = useRef<HTMLInputElement>(null);
    const imageFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            const changeMessage = () => {
                if (messageIndex < analysisMessages.length - 1) {
                    setAnalysisMessage(analysisMessages[messageIndex]);
                    messageIndex++;
                    setTimeout(changeMessage, Math.random() * 4000 + 6000); // Random duration between 6 and 10 seconds
                } else {
                    setAnalysisMessage(analysisMessages[messageIndex]); // Set the last message
                }
            };
            changeMessage();
        }
    }, [isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !isLoading
            ) {
                setShowUploadModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowUploadModal, isLoading]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleFileDrop = (
        e: React.DragEvent<HTMLDivElement>,
        fileType: "audio" | "image",
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (
                fileType === "audio" &&
                (file.type === "audio/mpeg" || file.type === "audio/wav")
            ) {
                setAudioFile(file);
            } else if (fileType === "image" && file.type.startsWith("image/")) {
                setImageFile(file);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let audioURL, imageURL;

            if (audioFile) {
                const audioBlob = await upload(audioFile.name, audioFile, {
                    access: "public",
                    handleUploadUrl: "/api/upload/audio",
                });
                audioURL = audioBlob.url;
            }

            if (imageFile) {
                const imageBlob = await upload(imageFile.name, imageFile, {
                    access: "public",
                    handleUploadUrl: "/api/upload/image",
                });
                imageURL = imageBlob.url;
            }

            const formData = new FormData();
            formData.append("isFile", isFile ? "true" : "false");
            formData.append("name", name);
            formData.append("artist", artist);
            formData.append("instagramURL", instagramURL);
            formData.append("spotifyURL", spotifyURL);
            if (audioURL) formData.append("audioURL", audioURL);
            if (imageURL) formData.append("imageURL", imageURL);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setShowUploadModal(false);
            if (response.status === 200) {
                onSuccessfulUpload();
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
            {!isLoading ? (
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-8 w-[682px] max-h-[90vh] overflow-y-auto z-[10000] relative text-black"
                >
                    <h2 className="text-2xl font-bold mb-6">New Analysis</h2>
                    <div className="absolute right-0 top-0 p-8">
                            <button
                                type="button"
                                onClick={() => setShowUploadModal(false)}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" height="24" 
                                    viewBox="0 0 24 24" fill="none" 
                                    stroke-width="2" 
                                    stroke-linecap="round" stroke-linejoin="round"
                                    className="stroke-gray-600 hover:stroke-gray-950"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-[16px] font-medium text-black mb-2">
                                Input File{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={isFile}
                                        onChange={() => setIsFile(true)}
                                        className="mr-2 cursor-pointer w-4 h-4 text-navy border-fiftyPBlack focus:ring-navy"
                                    />
                                    Upload file
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={!isFile}
                                        onChange={() => setIsFile(false)}
                                        className="mr-2 cursor-pointer w-4 h-4 text-navy border-fiftyPBlack focus:ring-navy"
                                    />
                                    Insert Spotify link (beta)
                                </label>
                            </div>
                        </div>

                        {isFile ? (
                            <>
                                <div className="mb-6">
                                    <div
                                        ref={audioDropzoneRef}
                                        className="bg-inputBg rounded-lg p-8 text-center cursor-pointer hover:bg-activeBg transition-colors"
                                        onDrop={(e) =>
                                            handleFileDrop(e, "audio")
                                        }
                                        onDragOver={handleDragOver}
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "audioFileInput",
                                                )
                                                ?.click()
                                        }
                                    >
                                        <Image
                                            src={UploadIcon}
                                            alt="Upload"
                                            width={23}
                                            height={30}
                                            className="mx-auto"
                                        />
                                        <p className="mt-[10px] text-[12px] font-medium text-sixtyPBlack">
                                            {audioFile
                                                ? audioFile.name
                                                : "Upload a file or drag and drop here"}
                                        </p>
                                        <p className="mt-[2px] text-[10px] font-light text-seventyPBlack">
                                            Accepted formats: .mp3
                                        </p>
                                        <input
                                            type="file"
                                            accept="audio/mpeg"
                                            onChange={handleAudioFileChange}
                                            className="hidden"
                                            id="audioFileInput"
                                            ref={audioFileInputRef}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-[16px] font-medium text-black mb-1"
                                    >
                                        Track Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-inputBg focus:outline-navy rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="artist"
                                        className="block text-[16px] font-medium text-black mb-1"
                                    >
                                        Track Artist{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="artist"
                                        value={artist}
                                        onChange={(e) =>
                                            setArtist(e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-inputBg focus:outline-navy rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="imageFile"
                                        className="block text-[16px] font-medium text-black mb-1"
                                    >
                                        Track Cover
                                    </label>
                                    <div
                                        ref={imageDropzoneRef}
                                        className="bg-inputBg focus:outline-navy rounded-md p-2"
                                        onDrop={(e) =>
                                            handleFileDrop(e, "image")
                                        }
                                        onDragOver={handleDragOver}
                                    >
                                        {imageFile ? (
                                            <p>{imageFile.name}</p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="flex items-center text-gray-600"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "imageFileInput",
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                    />
                                                </svg>
                                                Upload image
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="hidden"
                                            id="imageFileInput"
                                            ref={imageFileInputRef}
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label
                                        htmlFor="instagramURL"
                                        className="block text-[16px] font-medium text-black mb-1"
                                    >
                                        Instagram Link
                                    </label>
                                    <input
                                        type="text"
                                        id="instagramURL"
                                        value={instagramURL}
                                        onChange={(e) =>
                                            setInstagramURL(e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-inputBg focus:outline-navy rounded-md"
                                        placeholder="https://www.instagram.com/"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="mb-6">
                                <label
                                    htmlFor="spotifyURL"
                                    className="block text-[16px] font-medium text-black mb-1"
                                >
                                    Spotify URL
                                </label>
                                <input
                                    type="text"
                                    id="spotifyURL"
                                    value={spotifyURL}
                                    onChange={(e) =>
                                        setSpotifyURL(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-inputBg focus:outline-navy rounded-md"
                                />
                            </div>
                        )}

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-8 py-2 border-2 border-thirtyPBlack rounded-md text-fiftyPBlack"
                                onClick={() => setShowUploadModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2 bg-navy text-white rounded-md disabled:opacity-50"
                            >
                                {isLoading ? "Uploading..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-8 w-[682px] h-[550px] overflow-y-auto z-[10000] relative flex flex-col items-center justify-center"
                >
                    <LoadingWave />
                    <p className="text-center mt-4 text-[16px] text-eightyPBlack">
                        {analysisMessage}
                    </p>
                </div>
            )}
        </div>
    );
};
