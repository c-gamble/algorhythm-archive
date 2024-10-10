"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Engine1 from "../../public/assets/images/engine/1.png";
import Engine2 from "../../public/assets/images/engine/2.png";
import Engine3 from "../../public/assets/images/engine/3.png";
import Engine3Mobile from "../../public/assets/images/engine/3-mobile.png";
import { useState, useEffect } from "react";

export const Engine = () => {
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
                flexDirection: "column",
                justifyContent: "center",
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
                        fontSize: `${32 - 0.009 * (1492 - width)}px`,
                    }}
                >
                    Under the hood of Algorhythm&apos;s engine
                </p>
                <p
                    style={{
                        fontSize: `${18 - 0.005 * (1492 - width)}px`,
                        color: "rgba(255, 255, 255, 0.7)",
                        // marginTop: "10px",
                    }}
                >
                    We empower your artists with state-of-the-art artificial
                    intelligence.
                </p>
            </motion.div>

            {/* CARDS */}
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
                        width: "28%",
                        height: "375px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                        padding: "0 10px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "60px",
                            height: "250px",
                        }}
                    >
                        <Image src={Engine1} alt="Engine 1" height={100} />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: `${16 - 0.005 * (1492 - width)}px`,
                            marginRight: "20px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        By breaking music down into its fundamental parts, our
                        engine analyzes what makes each song tick, almost like
                        extracting the track&apos;s{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            genetic code
                        </span>
                        .
                    </p>
                </motion.div>
                <motion.div
                    style={{
                        width: "28%",
                        height: "375px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                        padding: "0 10px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "60px",
                            height: "250px",
                        }}
                    >
                        <Image src={Engine2} alt="Engine 2" height={125} />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: `${16 - 0.005 * (1492 - width)}px`,
                            marginRight: "20px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        The engine takes your track&apos;s genetic code and
                        finds the listeners, audiences, and potential fans who
                        respond well to music with{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            similar traits
                        </span>
                        .
                    </p>
                </motion.div>
                <motion.div
                    style={{
                        width: "28%",
                        height: "375px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "#1E1E1E",
                        borderRadius: "10px",
                        textAlign: "left",
                        padding: "0 10px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "60px",
                            height: "250px",
                        }}
                    >
                        <Image src={Engine3} alt="Engine 3" height={200} />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: `${16 - 0.005 * (1492 - width)}px`,
                            marginRight: "20px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        We provide you with a{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            comprehensive marketing strategy
                        </span>
                        , backed by our scientific market analysis and tailored
                        to your ideal listeners.
                    </p>
                </motion.div>
            </motion.div>

            <div style={{ height: "100px" }} />
        </motion.div>
    ) : (
        <motion.div
            style={{
                height: "120vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
                    padding: "0 10px",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "20px",
                    }}
                >
                    Under the hood of Algorhythm&apos;s engine
                </p>
                <p
                    style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginTop: "4px",
                    }}
                >
                    We empower your artists with state-of-the-art artificial
                    intelligence.
                </p>
            </motion.div>

            {/* CARDS */}
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    color: "#fff",
                    textAlign: "center",
                    marginTop: "40px",
                    padding: "0 20px",
                }}
            >
                <motion.div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "10px",
                        textAlign: "center",
                        padding: "0 10px",
                        marginBottom: "20px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                            height: "100px",
                        }}
                    >
                        <Image src={Engine1} alt="Engine 1" height={80} />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "12px",
                            marginRight: "20px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        By breaking music down into its fundamental parts, our
                        engine analyzes what makes each song tick, almost like
                        extracting the track&apos;s{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            genetic code
                        </span>
                        .
                    </p>
                </motion.div>
                <motion.div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "10px",
                        textAlign: "center",
                        padding: "0 10px",
                        marginBottom: "20px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                            height: "100px",
                        }}
                    >
                        <Image src={Engine2} alt="Engine 2" height={100} />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "12px",
                            marginRight: "20px",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        The engine takes your track&apos;s genetic code and
                        finds the listeners, audiences, and potential fans who
                        respond well to music with{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            similar traits
                        </span>
                        .
                    </p>
                </motion.div>
                <motion.div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "10px",
                        textAlign: "center",
                        padding: "0 10px",
                        marginBottom: "20px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                            height: "100px",
                        }}
                    >
                        <Image
                            src={Engine3Mobile}
                            alt="Engine 3 Mobile"
                            height={150}
                        />
                    </motion.div>
                    <p
                        style={{
                            marginLeft: "20px",
                            marginTop: "16px",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "12px",
                            marginRight: "20px",
                            textAlign: "center",
                        }}
                    >
                        We provide you with a{" "}
                        <span
                            style={{
                                fontWeight: 500,
                                color: "rgba(255, 255, 255, 1)",
                            }}
                        >
                            comprehensive marketing strategy
                        </span>
                        , backed by our scientific market analysis and tailored
                        to your ideal listeners.
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
