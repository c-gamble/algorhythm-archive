import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface AuthenticatedImageProps extends Omit<ImageProps, "src"> {
    src: string;
}

export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    src,
    alt,
    width,
    height,
    className,
    style,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(
                    `/api/asset/image?imageURL=${encodeURIComponent(src)}`,
                    {
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch image");
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImageSrc(objectUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImage();

        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [src]);

    const combinedStyle: React.CSSProperties = {
        ...style,
        position: "relative" as React.CSSProperties["position"], // Type assertion added
        overflow: "hidden",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    if (!imageSrc) {
        return (
            <div className={className} style={combinedStyle} {...props}>
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            "linear-gradient(90deg, #f3f4f6 25%, #e0e0e0 50%, #f3f4f6 75%)",
                        backgroundSize: "200% 100%",
                        animation: "skeleton-loading 1.5s infinite linear",
                    }}
                />
            </div>
        );
    }

    return (
        <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
            {...props}
        />
    );
};
