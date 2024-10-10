"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Feature1 from "../../public/assets/images/description/1.png";
import Feature2 from "../../public/assets/images/description/2.png";
import Feature3 from "../../public/assets/images/description/3.png";

export const Description = () => {
    return (
        <motion.div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
            }}
        >
            {/* HEADER */}
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "32px",
                    }}
                >
                    The AI multi-tool for record labels
                </p>
                <p
                    style={{
                        fontSize: "18px",
                        opacity: 0.7,
                        marginTop: "10px",
                    }}
                >
                    Our engine powers all parts of the music industry&apos;s
                    life cycle.
                </p>
            </motion.div>

            {/* FEATURES */}
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    color: "#fff",
                    textAlign: "center",
                    marginTop: "80px",
                    padding: "0 20px",
                }}
            >
                <motion.div
                    style={{
                        width: "30%",
                        height: "400px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                    }}
                >
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "40px",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        Artist Discovery &amp; Development
                    </p>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            opacity: 0.7,
                            fontSize: "16px",
                            marginBottom: "50px",
                            marginRight: "20px",
                        }}
                    >
                        Enhance your productivity by connecting with your
                        favorite tools, keeping all your essentials in one
                        place.
                    </p>

                    <motion.div
                        style={{
                            position: "relative",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: "hidden",
                            borderRadius: "10px",
                        }}
                    >
                        <Image src={Feature1} alt="Feature 1" />
                    </motion.div>
                </motion.div>
                <motion.div
                    style={{
                        width: "30%",
                        height: "400px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                    }}
                >
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "40px",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        Marketing &amp; Promotion Strategy
                    </p>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            opacity: 0.7,
                            fontSize: "16px",
                            marginBottom: "50px",
                            marginRight: "20px",
                        }}
                    >
                        Define and track your goals, breaking down objectives
                        into achievable tasks to keep your targets in sight.
                    </p>

                    <motion.div
                        style={{
                            position: "relative",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: "hidden",
                            borderRadius: "10px",
                        }}
                    >
                        <Image src={Feature2} alt="Feature 2" />
                    </motion.div>
                </motion.div>
                <motion.div
                    style={{
                        width: "30%",
                        height: "400px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                    }}
                >
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "40px",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        IP &amp; Content Protection
                    </p>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            opacity: 0.7,
                            fontSize: "16px",
                            marginBottom: "50px",
                            marginRight: "20px",
                        }}
                    >
                        With end-to-end encryption, your data is securely stored
                        and protected from unauthorized access.
                    </p>

                    <motion.div
                        style={{
                            position: "relative",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: "hidden",
                            borderRadius: "10px",
                        }}
                    >
                        <Image src={Feature3} alt="Feature 3" />
                    </motion.div>
                </motion.div>
            </motion.div>

            <div style={{ height: "100px" }} />
        </motion.div>
    );
};
