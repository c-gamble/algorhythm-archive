"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Feature2Image from "../../public/assets/images/features/2.png";
import { useState, useEffect } from "react";

export const Feature2 = () => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const updateWidth = () => {
            setWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    return width > 500 ? (
        <motion.div
            style={{
                height: "75vh",
                width: "100vw",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                backgroundImage:
                    "linear-gradient(180deg, #141348 0%, #141378 100%)",
            }}
        >
            <motion.div
                style={{
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginTop: "40px",
                }}
            >
                <Image src={Feature2Image} alt="Feature 2" />
            </motion.div>
            <motion.div
                style={{
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 40px",
                }}
            >
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <p
                        style={{
                            fontSize: `${32 - 0.009 * (1492 - width)}px`,
                            color: "#fff",
                            marginBottom: "16px",
                            lineHeight: "1.2",
                            maxWidth: "400px",
                        }}
                    >
                        Identify the track&apos;s target audience before release
                    </p>
                    <p
                        style={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: 500,
                            marginBottom: "40px",
                            fontSize: `${18 - 0.005 * (1492 - width)}px`,
                            maxWidth: "435px",
                        }}
                    >
                        Detect who your artist&apos;s target audience and first
                        listeners are. From key demographics, listening habits,
                        regional locations, and much more, find out exactly
                        where your music&apos;s{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            superfans
                        </span>{" "}
                        are waiting.
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    ) : (
        <motion.div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundImage:
                    "linear-gradient(180deg, #141348 0%, #141378 100%)",
            }}
        >
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}
            >
                <Image src={Feature2Image} alt="Feature 2" />
            </motion.div>
            <div style={{ height: "40px" }} />
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 40px",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontSize: "22px",
                        color: "#fff",
                        marginBottom: "16px",
                        lineHeight: "1.2",
                        maxWidth: "400px",
                    }}
                >
                    Identify the track&apos;s target audience before release
                </p>
                <p
                    style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 500,
                        marginBottom: "40px",
                        fontSize: "14px",
                        maxWidth: "435px",
                    }}
                >
                    Detect who your artist&apos;s target audience and first
                    listeners are. From key demographics, listening habits,
                    regional locations, and much more, find out exactly where
                    your music&apos;s{" "}
                    <span
                        style={{
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 1)",
                        }}
                    >
                        superfans
                    </span>{" "}
                    are waiting.
                </p>
            </motion.div>
        </motion.div>
    );
};
