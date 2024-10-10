import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoadingWave } from "@/components/global/LoadingWave";
import { Feedback } from "@/customTypes";
import { upload } from "@vercel/blob/client";

export const FeedbackModal = ({
    setShowFeedbackModal,
}: {
    setShowFeedbackModal: (show: boolean) => void;
}) => {
    const [errorDescription, setErrorDescription] = useState("");
    const [errorType, setErrorType] = useState<Feedback | null>(null);
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const screenshotDropzoneRef = useRef<HTMLDivElement>(null);
    const screenshotFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !isLoading
            ) {
                setShowFeedbackModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowFeedbackModal, isLoading]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleScreenshotFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshotFile(e.target.files[0]);
        }
    };

    const handleScreenshotDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                setScreenshotFile(file);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let screenshotURL;

            if (screenshotFile) {
                const screenshotBlob = await upload(
                    screenshotFile.name,
                    screenshotFile,
                    {
                        access: "public",
                        handleUploadUrl: "/api/upload/image",
                    },
                );
                screenshotURL = screenshotBlob.url;
            }

            const formData = new FormData();
            formData.append("errorDescription", errorDescription);
            formData.append("errorType", errorType || "");
            if (screenshotURL) formData.append("screenshotURL", screenshotURL);

            if (!errorType || !errorDescription) {
                throw new Error("Please include all required fields.");
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.status !== 200) {
                throw new Error("Invalid response status");
            }
            toast.success("Thank you for your feedback!");
            setShowFeedbackModal(false);
        } catch (error: any) {
            console.error("Error during feedback submission:", error);
            toast.error(
                error.message || "An error occurred. Please try again.",
            );
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
                    <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>
                    <div className="absolute right-0 top-0 p-8">
                            <button
                                type="button"
                                onClick={() => setShowFeedbackModal(false)}
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
                                Error Description{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={errorDescription}
                                onChange={(e) =>
                                    setErrorDescription(e.target.value)
                                }
                                placeholder="Please describe the error you encountered..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-navy focus:border-navy resize-none"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-6">
                            <label className="block text-[16px] font-medium text-black mb-2">
                                Error Type{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {Object.values([
                                    "Interface Bug",
                                    "Incorrect Output",
                                    "Feature Request",
                                    "Change Request",
                                    "Unknown Error",
                                    "Other",
                                ]).map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            checked={errorType === type}
                                            onChange={() =>
                                                setErrorType(type as Feedback)
                                            }
                                            className="mr-2 cursor-pointer w-4 h-4 text-navy border-fiftyPBlack focus:ring-navy"
                                            required
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-[16px] font-medium text-black mb-2">
                                Screenshot (optional)
                            </label>
                            <div
                                ref={screenshotDropzoneRef}
                                onDragOver={handleDragOver}
                                onDrop={handleScreenshotDrop}
                                className="border-2 border-gray-300 border-dashed rounded-md p-4 cursor-pointer"
                            >
                                {screenshotFile ? (
                                    <Image
                                        src={URL.createObjectURL(
                                            screenshotFile,
                                        )}
                                        alt="Screenshot"
                                        width={400}
                                        height={300}
                                        className="mx-auto"
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        Drag and drop a screenshot or click to
                                        upload
                                    </div>
                                )}
                                <input
                                    ref={screenshotFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleScreenshotFileChange}
                                    className="sr-only"
                                />
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-navy text-white px-6 py-3 rounded-md hover:bg-navyLighter"
                            >
                                Submit Feedback
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
                        Submitting your feedback...
                    </p>
                </div>
            )}
        </div>
    );
};
