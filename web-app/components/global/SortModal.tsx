import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CheckmarkIcon from "@/assets/icons/checkmark.png";

export const SortModal = ({
    isOpen,
    onClose,
    onSort,
    buttonRef,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSort: (sortOption: string) => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
    const [selectedOption, setSelectedOption] = useState("Newest first");
    const modalRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        "Newest first",
        "Oldest first",
        "Track title: A-Z",
        "Artist first name: A-Z",
        "Artist last name: A-Z",
        "Last accessed",
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                buttonRef.current !== event.target
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onSort(option);
    };

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="absolute bg-white rounded-lg shadow-sm w-[259px] z-50 mt-2"
            style={{
                top: buttonRef.current
                    ? buttonRef.current.offsetTop +
                      buttonRef.current.offsetHeight
                    : 0,
                left: buttonRef.current ? buttonRef.current.offsetLeft : 0,
            }}
        >
            <div className="px-4 pt-4 pb-2 border-1 border-solid border-eightyPBlack">
                <h2 className="text-[16px] font-medium text-eightyPBlack">
                    Sort By
                </h2>
            </div>
            <div className="px-4 pb-2">
                {sortOptions.map((option) => (
                    <button
                        key={option}
                        className="w-full text-left py-2 px-4 hover:bg-gray-100 flex items-center"
                        onClick={() => handleOptionClick(option)}
                    >
                        <div className="w-6 mr-2 flex justify-center">
                            {selectedOption === option && (
                                <Image
                                    src={CheckmarkIcon.src}
                                    alt="Selected"
                                    width={16.3}
                                    height={12.02}
                                />
                            )}
                        </div>
                        <span className="text-sixtyPBlack">{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
