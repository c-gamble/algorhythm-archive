"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AlogrhythmLogo from "../../public/assets/images/fg-white_bg-transparent.png";
import Link from "next/link";
import LinkedIn from "../../public/assets/icons/linkedin.svg";
import X from "../../public/assets/icons/x.svg";
import Instagram from "../../public/assets/icons/instagram.png";
import Home from "../../public/assets/icons/home.png";
import { useState, useEffect } from "react";

export type FooterProps = {
    scrollToFAQ: () => void;
};

export const Footer = (props: FooterProps) => {
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
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
    // const handleGoToTop = () => {
    //     props.goToTop();
    // };

    const handleGoToFAQ = () => {
        props.scrollToFAQ();
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, organization, email }),
            });

            if (response.ok) {
                alert("Successfully sent your message!");
                setName("");
                setOrganization("");
                setEmail("");
            } else {
                const body = await response.json();
                alert(body.message);
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    };

    return width > 500 ? (
        <motion.div
            style={{
                height: "75vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#fff",
                padding: "0px 40px",
            }}
        >
            {/* <div style={{ height: "60px" }} /> */}
            {/* WAITLIST */}
            <motion.div
                style={{
                    width: "100%",
                    backgroundImage:
                        "linear-gradient(105deg, #151379 0%, #141414 100%)",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "32px",
                        marginTop: "60px",
                    }}
                >
                    Contact Our Team
                </p>
                <p
                    style={{
                        fontSize: "18px",
                        opacity: 0.7,
                        marginTop: "20px",
                        textAlign: "center",
                        maxWidth: "450px",
                    }}
                >
                    Participate in Algorhythm&apos;s exclusive Closed Alpha.
                    Work closely with our team to get your artists to succeed.
                </p>
                <form onSubmit={handleSubmit}>
                    <motion.div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            marginTop: "20px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "200px",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                                marginRight: "5px",
                            }}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "200px",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                                marginLeft: "5px",
                            }}
                            required
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            width: "410px",
                            marginTop: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            marginBottom: "80px",
                        }}
                    >
                        <input
                            type="email"
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "300px",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                                marginRight: "5px",
                            }}
                            required
                        />
                        <button
                            type="submit"
                            style={{
                                width: "100px",
                                marginLeft: "5px",
                                borderRadius: "10px",
                                background: "#0054F9",
                                padding: "10px 23px",
                                cursor: "pointer",
                            }}
                        >
                            Contact
                        </button>
                    </motion.div>
                </form>
            </motion.div>

            {/* GO TO TOP */}
            {/* <motion.button
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    fontSize: "12px",
                    background: "#151379",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={handleGoToTop}
            >
                <Image src={Home} alt="Home" height={20} />
            </motion.button> */}

            {/* FOOTER */}
            <motion.div
                style={{
                    // marginTop: "40px",
                    marginBottom: "20px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image src={AlogrhythmLogo} alt="Alogrhythm Logo" height={50} />
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        maxWidth: "500px",
                        width: "100%",
                        marginTop: "20px",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    <Link
                        href="https://drive.google.com/file/d/1Cq3RQU9s1M1w-mseDvytJsy9lzPye4HI/view?usp=sharing"
                        target="_blank"
                        style={{ width: "100px" }}
                    >
                        Privacy Policy
                    </Link>
                    {/* <Link href="/" target="_blank">
                        Terms of Service
                    </Link> */}
                    <button
                        onClick={handleGoToFAQ}
                        style={{
                            width: "100px",
                        }}
                    >
                        FAQ
                    </button>
                    <Link
                        href="mailto:team@algorhythm.app"
                        target="_blank"
                        style={{
                            width: "100px",
                        }}
                    >
                        Support
                    </Link>
                </motion.div>
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        maxWidth: "250px",
                        width: "100%",
                        marginTop: "26px",
                        fontSize: "14px",
                    }}
                >
                    <Link
                        href="https://www.linkedin.com/company/algorhythmai/"
                        target="_blank"
                    >
                        <Image
                            src={LinkedIn}
                            alt="LinkedIn"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                    <Link
                        href="https://www.instagram.com/algorhythm.app/"
                        target="_blank"
                    >
                        <Image
                            src={Instagram}
                            alt="Instagram"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                    <Link
                        href="https://www.x.com/algorhythmapp"
                        target="_blank"
                    >
                        <Image
                            src={X}
                            alt="X"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                </motion.div>
                <p
                    style={{
                        marginTop: "40px",
                        opacity: 0.7,
                        fontSize: "12px",
                        textAlign: "center",
                    }}
                >
                    Copyright © 2024 Algorhythm AI, Inc.
                    <br />
                    All rights reserved.
                </p>
            </motion.div>
        </motion.div>
    ) : (
        <motion.div
            style={{
                height: "90vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#fff",
                padding: "0 20px",
            }}
        >
            {/* WAITLIST */}
            <motion.div
                style={{
                    width: "100%",
                    backgroundImage:
                        "linear-gradient(105deg, #151379 0%, #141414 100%)",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "80px 20px",
                    marginBottom: "40px",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "32px",
                    }}
                >
                    Contact Our Team
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        opacity: 0.7,
                        marginTop: "20px",
                        textAlign: "center",
                        maxWidth: "450px",
                    }}
                >
                    Participate in Algorhythm&apos;s exclusive Closed Alpha.
                    Work closely with our team to get your artists to succeed.
                </p>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        marginTop: "40px",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            width: "90%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "50%",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                                marginRight: "5px",
                            }}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "50%",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                                marginLeft: "5px",
                            }}
                            required
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            width: "90%",
                            marginTop: "16px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                        }}
                    >
                        <input
                            type="email"
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "10px",
                                width: "100%",
                                border: "rgba(255, 255, 255, 0.6) 1px solid",
                                background: "rgba(255, 255, 255, 0.3)",
                                outline: "none",
                            }}
                            required
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            width: "90%",
                            marginTop: "16px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                        }}
                    >
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                background: "#0054F9",
                                padding: "10px 23px",
                                cursor: "pointer",
                            }}
                        >
                            Contact
                        </button>
                    </motion.div>
                </form>
            </motion.div>

            {/* GO TO TOP */}
            {/* <motion.button
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    fontSize: "12px",
                    background: "#151379",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={handleGoToTop}
            >
                <Image src={Home} alt="Home" height={20} />
            </motion.button> */}

            {/* FOOTER */}
            <motion.div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "40px",
                }}
            >
                <Image src={AlogrhythmLogo} alt="Alogrhythm Logo" height={50} />
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        maxWidth: "500px",
                        width: "100%",
                        marginTop: "20px",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    <Link
                        href="https://drive.google.com/file/d/1Cq3RQU9s1M1w-mseDvytJsy9lzPye4HI/view?usp=sharing"
                        target="_blank"
                        style={{ width: "100px" }}
                    >
                        Privacy Policy
                    </Link>
                    {/* <Link href="/" target="_blank">
                        Terms of Service
                    </Link> */}
                    <button
                        onClick={handleGoToFAQ}
                        style={{
                            width: "100px",
                        }}
                    >
                        FAQ
                    </button>
                    <Link
                        href="mailto:team@algorhythm.app"
                        target="_blank"
                        style={{
                            width: "100px",
                        }}
                    >
                        Support
                    </Link>
                </motion.div>
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        maxWidth: "250px",
                        width: "100%",
                        marginTop: "26px",
                        fontSize: "14px",
                    }}
                >
                    <Link
                        href="https://www.linkedin.com/company/algorhythmai/"
                        target="_blank"
                    >
                        <Image
                            src={LinkedIn}
                            alt="LinkedIn"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                    <Link
                        href="https://www.instagram.com/algorhythm.app/"
                        target="_blank"
                    >
                        <Image
                            src={Instagram}
                            alt="Instagram"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                    <Link
                        href="https://www.x.com/algorhythmapp"
                        target="_blank"
                    >
                        <Image
                            src={X}
                            alt="X"
                            height={20}
                            style={{
                                filter: "invert(1)",
                            }}
                        />
                    </Link>
                </motion.div>
                <p
                    style={{
                        marginTop: "20px",
                        opacity: 0.7,
                        fontSize: "12px",
                        textAlign: "center",
                    }}
                >
                    Copyright © 2024 Algorhythm AI, Inc.
                    <br />
                    All rights reserved.
                </p>
            </motion.div>
        </motion.div>
    );
};
