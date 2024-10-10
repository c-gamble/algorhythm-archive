"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AlogrhythmLogo from "../../public/assets/images/fg-white_bg-transparent.png";
import { Particles } from "@/components/Particles";
import { useEffect, useState } from "react";

export type MainProps = {
    scrollToFooter: () => void;
    scrollToFeature1: () => void;
};

export const Main = (props: MainProps) => {
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
                height: "110vh",
                width: "100vw",
                display: "flex",
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "flex-start",
                backgroundImage: "url(/assets/images/main-background.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                position: "relative",
            }}
        >
            {/* NAVBAR */}
            <motion.div
                style={{
                    width: "100%",
                    height: "115px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "20px 60px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        height: "50px",
                        position: "relative",
                        width: "auto",
                    }}
                >
                    <Image
                        src={AlogrhythmLogo}
                        alt="Alogrhythm Logo"
                        height={50}
                    />
                </div>
                <motion.div
                    style={{
                        position: "fixed",
                        top: "30px",
                        right: "60px",
                        zIndex: 1000,
                    }}
                    // className={`join-button ${
                    //     props.isScrolling ||
                    //     props.currentIndex === props.waitlistIndex
                    //         ? "hidden"
                    //         : ""
                    // }`}
                >
                    <button
                        type="submit"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            borderRadius: "10px",
                            backgroundImage:
                                "linear-gradient(90deg, #2622F1 0%, #12107C 100%)",
                            padding: "10px 23px",
                            cursor: "pointer",
                        }}
                        onClick={props.scrollToFooter}
                    >
                        Contact
                    </button>
                </motion.div>
            </motion.div>

            {/* PARTICLES */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: "hidden",
                    // zIndex: 99,
                }}
            >
                <motion.div
                    style={{
                        position: "absolute",
                        bottom: `${-100 - 0.3 * (1492 - width)}px`,
                        right: `${-350 - 0.01 * (1492 - width)}px`,
                        transform: "rotate(-30deg) scale(1.5)",
                    }}
                >
                    <Particles />
                </motion.div>
            </motion.div>

            {/* CONTENT */}
            <div style={{ height: "70px" }} />
            <motion.div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "0 60px",
                    color: "white",
                    zIndex: 100,
                }}
            >
                <p
                    style={{
                        fontSize: `${84 - 0.02 * (1492 - width)}px`,
                        lineHeight: "0.9",
                        letterSpacing: "1px",
                        fontWeight: 500,
                    }}
                >
                    Get your artists to
                    <br />
                    <span style={{ fontStyle: "italic" }}>break through</span>
                    <br />
                    the noise
                </p>
                <p
                    style={{
                        marginTop: "20px",
                        opacity: 0.7,
                        fontSize: `${24 - 0.005 * (1492 - width)}px`,
                        maxWidth: "530px",
                        lineHeight: "1.15",
                    }}
                >
                    Boost your artist&apos;s digital marketing strategy with AI
                    audio analysis. Perfect aesthetics, pinpoint audiences, and
                    elevate your next campaign.
                </p>
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "30px",
                    }}
                >
                    <motion.button
                        style={{
                            padding: "10px 20px",
                            fontSize: `${20 - 0.005 * (1492 - width)}px`,
                            backgroundImage:
                                "linear-gradient(90deg, #2622F1 0%, #12107C 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                        }}
                        onClick={props.scrollToFooter}
                    >
                        Contact Our Team
                    </motion.button>
                    <motion.button
                        style={{
                            padding: "10px 20px",
                            fontSize: `${20 - 0.005 * (1492 - width)}px`,
                            backgroundColor: "transparent",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "10px",
                            marginLeft: "20px",
                            cursor: "pointer",
                        }}
                        onClick={props.scrollToFeature1}
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    ) : (
        <motion.div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "flex-start",
                backgroundImage: "url(/assets/images/mobile-background.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                position: "relative",
            }}
        >
            {/* NAVBAR */}
            <motion.div
                style={{
                    width: "100%",
                    height: "115px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "20px 40px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        height: "30px",
                        position: "relative",
                        width: "auto",
                    }}
                >
                    <Image
                        src={AlogrhythmLogo}
                        alt="Alogrhythm Logo"
                        height={30}
                    />
                </div>
                {/* <motion.div
                    style={{
                        position: "fixed",
                        top: "44px",
                        right: "40px",
                        zIndex: 1000,
                    }}
                    // className={`join-button ${
                    //     props.isScrolling ||
                    //     props.currentIndex === props.waitlistIndex
                    //         ? "hidden"
                    //         : ""
                    // }`}
                >
                    <button
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "white",
                        }}
                        onClick={props.scrollToFooter}
                    >
                        Contact
                    </button>
                </motion.div> */}
            </motion.div>

            {/* PARTICLES */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: "hidden",
                    // zIndex: 99,
                }}
            >
                <motion.div
                    style={{
                        position: "absolute",
                        bottom: `-200px`,
                        right: `-60px`,
                        transform: "rotate(-25deg) scale(1.2)",
                    }}
                >
                    <Particles />
                </motion.div>
            </motion.div>

            {/* CONTENT */}
            <div style={{ height: "60px" }} />
            <motion.div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "0 60px",
                    color: "white",
                    zIndex: 100,
                }}
            >
                <p
                    style={{
                        fontSize: "38px",
                        lineHeight: "0.9",
                        letterSpacing: "1px",
                        minWidth: "360px",
                        fontWeight: 500,
                    }}
                >
                    Get your artists to <br />
                    <span style={{ fontStyle: "italic" }}>
                        break through
                    </span>{" "}
                    <br />
                    the noise
                </p>
                <p
                    style={{
                        marginTop: "20px",
                        opacity: 0.7,
                        fontSize: "14px",
                        maxWidth: "530px",
                        lineHeight: "1.15",
                    }}
                >
                    Boost your artist&apos;s digital marketing strategy with AI
                    audio analysis. Perfect aesthetics, pinpoint audiences, and
                    elevate your next campaign.
                </p>
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "30px",
                    }}
                >
                    <motion.button
                        style={{
                            padding: "10px 20px",
                            fontSize: "12px",
                            backgroundImage:
                                "linear-gradient(90deg, #2E16C5 0%, #0D0C49 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                        }}
                        onClick={props.scrollToFooter}
                    >
                        Contact Our Team
                    </motion.button>
                    <motion.button
                        style={{
                            padding: "10px 20px",
                            fontSize: "12px",
                            backgroundColor: "transparent",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "10px",
                            marginLeft: "20px",
                            cursor: "pointer",
                        }}
                        onClick={props.scrollToFeature1}
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
