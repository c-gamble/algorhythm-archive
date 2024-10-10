"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Feature1Image from "../../public/assets/images/features/1.png";
import { useState, useEffect } from "react";

export const Feature1 = () => {
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

    // console.log(200 - 0.001 * (1890 - width));

    return width > 500 ? (
        <motion.div
            style={{
                // height: "80vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                backgroundImage:
                    "linear-gradient(180deg, #000000 0%, #141348 100%)",
            }}
        >
            {/* HEADER */}
            <motion.div
                style={{
                    minHeight: "380px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    textAlign: "center",
                    // padding: `${150 - 1 * (1890 - width)}px 20px`,
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: `${36 - 0.009 * (1492 - width)}px`,
                    }}
                >
                    The AI marketing tool for record labels.
                </p>
                <p
                    style={{
                        fontSize: `${22 - 0.005 * (1492 - width)}px`,
                        color: "rgba(255, 255, 255, 0.7)",
                        // marginTop: "10px",
                    }}
                >
                    Our engine powers all parts of a new release&apos;s life
                    cycle.
                </p>
            </motion.div>
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
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
                        textAlign: "left",
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
                                // minWidth: "400px",
                                fontWeight: 500,
                            }}
                        >
                            Uncover the unique traits of your artists&apos;
                            music
                        </p>
                        <p
                            style={{
                                color: "rgba(255, 255, 255, 0.7)",
                                marginBottom: "40px",
                                fontSize: `${18 - 0.005 * (1492 - width)}px`,
                                maxWidth: "435px",
                            }}
                        >
                            Understand the DNA of your artist&apos;s music. From
                            melodic complexity, drum pattern syncopation, guitar
                            tone distortion, and billions other parameters, our
                            engine can analyze your song on a{" "}
                            <span
                                style={{
                                    fontWeight: 500,
                                    color: "rgba(255, 255, 255, 1)",
                                }}
                            >
                                microscopic
                            </span>{" "}
                            level.
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
                        padding: "0 40px",
                        marginTop: "40px",
                    }}
                >
                    <Image src={Feature1Image} alt="Feature 1" />
                </motion.div>
            </motion.div>
        </motion.div>
    ) : (
        <motion.div
            style={{
                // height: "90vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundImage:
                    "linear-gradient(180deg, #000000 0%, #141348 100%)",
            }}
        >
            <motion.div
                style={{
                    minHeight: "300px",
                    height: "16vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "left",
                    padding: "40px 40px",
                }}
            >
                <p
                    style={{
                        color: "#fff",
                        fontSize: "22px",
                        fontWeight: 500,
                        minWidth: "400px",
                        textAlign: "center",
                    }}
                >
                    The AI marketing tool for record labels.
                </p>
                <p
                    style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "16px",
                        minWidth: "250px",
                        textAlign: "center",
                    }}
                >
                    Our engine powers all parts of a new release&apos;s life
                    cycle.
                </p>
            </motion.div>
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}
            >
                <Image src={Feature1Image} alt="Feature 1" />
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
                        fontWeight: 500,
                    }}
                >
                    Uncover the unique traits of your artists&apos; music
                </p>
                <p
                    style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: "40px",
                        fontSize: "14px",
                        maxWidth: "435px",
                    }}
                >
                    Understand the DNA of your artist&apos;s music. From melodic
                    complexity, drum pattern syncopation, guitar tone
                    distortion, and billions other parameters, our engine can
                    analyze your song on a{" "}
                    <span
                        style={{
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 1)",
                        }}
                    >
                        microscopic
                    </span>{" "}
                    level.
                </p>
            </motion.div>
        </motion.div>
    );
};
