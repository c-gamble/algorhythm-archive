"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Feature3Image from "../../public/assets/images/features/3.png";
import { useState, useEffect } from "react";

export const Feature3 = () => {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const updateDimensions = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    return width > 500 ? (
        <motion.div
            style={{
                height: "80vh",
                width: "100vw",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                backgroundImage:
                    "linear-gradient(180deg, #141378 0%, #141348 100%)",
            }}
        >
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
                            fontWeight: 500,
                            marginBottom: "16px",
                            lineHeight: "1.2",
                            maxWidth: "400px",
                        }}
                    >
                        Generate audience engagement strategies
                    </p>
                    <p
                        style={{
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: "40px",
                            fontSize: `${18 - 0.005 * (1492 - width)}px`,
                            maxWidth: "435px",
                        }}
                    >
                        Get tailored recommendations on how to{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            connect
                        </span>{" "}
                        with your audience. Gather insights on ideal playlists
                        to pitch to, potential brand and artist collaborations,
                        and more. Maximize your promotion with precision.
                    </p>
                </motion.div>
            </motion.div>
            <motion.div
                style={{
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    padding: "0 0",
                }}
            >
                <Image
                    src={Feature3Image}
                    alt="Feature 3"
                    height={height * 0.8}
                />
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
                    "linear-gradient(180deg, #141378 0%, #141348 100%)",
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
                <Image src={Feature3Image} alt="Feature 3" />
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
                    Generate audience engagement strategies
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
                    Get tailored recommendations on how to{" "}
                    <span
                        style={{
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 1)",
                        }}
                    >
                        connect
                    </span>{" "}
                    with your audience. Gather insights on ideal playlists to
                    pitch to, potential brand and artist collaborations, and
                    more. Maximize your promotion with precision.
                </p>
            </motion.div>
        </motion.div>
    );
};
