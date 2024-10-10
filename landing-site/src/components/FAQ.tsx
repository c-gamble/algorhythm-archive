"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const questions = [
    {
        question: "How does Algorhythm help my artists?",
        answer: "While Algorhythm can not guarantee your songs will be Billboard-charting hits, it can help your team maximize market performance for any release. By boosting your releases' success rates over time, your team will save countless hours and marketing dollars spent on research and development.",
    },
    {
        question:
            "What makes Algorhythm different from other marketing and analysis tools?",
        answer: "Unlike marketing tools that rely on artist metadata or streaming numbers, Algorhythm's AI analyzes the music and audio itself to inform you of your next campaign strategies. Our engine is the first product of its kind that offers promotional materials powered by this scientific track-by-track basis.",
    },
    {
        question: "How does the Closed Alpha work?",
        answer: "Once you sign up for our waiting list, one of our team's experts will reach out in 1-3 business days to make your experience as smooth as possible. We'll explain how Algorhythm works and explore how we can assist you. Your feedback is crucial to us. As a Closed Alpha member, you'll get exclusive access to new features and be the first we contact for new improvements.",
    },
    // {
    //     question: "Do I have to pay to use Algorhythm?",
    //     answer: "",
    // },
    {
        question: "How does Algorhythm protect my data?",
        answer: "Our engine creates a separate instance of itself for each team and client. That instance functions independently of any other instance, ensuring that no material or output can be viewed by other clients. This way there are no data leaks and the instance can finetune itself for your specific tracks. Your files and information are then stored in encrypted databases that only your engine instance can access.",
    },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                alignItems: "center",
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
                    marginBottom: "60px",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "32px",
                    }}
                >
                    Frequently Asked Questions
                </p>
            </motion.div>

            {/* QUESTIONS */}
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
                {questions.map((q, i) => (
                    <motion.div
                        key={i}
                        style={{
                            width: "70%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            color: "#fff",
                            opacity: openIndex === i ? 1 : 0.7,
                            textAlign: "start",
                            padding: "20px",
                            borderBottom: "1px solid #fff",
                            cursor: "pointer",
                        }}
                        onClick={() => toggleQuestion(i)}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "20px",
                                }}
                            >
                                {q.question}
                            </p>
                            <span style={{ fontSize: "24px" }}>
                                {openIndex === i ? "-" : "+"}
                            </span>
                        </div>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 0.7 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        fontSize: "16px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {q.answer}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
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
                alignItems: "center",
                marginTop: "7vh",
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
                    marginBottom: "20px",
                }}
            >
                <p
                    style={{
                        letterSpacing: "1.1",
                        fontSize: "22px",
                    }}
                >
                    Frequently Asked Questions
                </p>
            </motion.div>

            {/* QUESTIONS */}
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
                {questions.map((q, i) => (
                    <motion.div
                        key={i}
                        style={{
                            width: "90%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            color: "#fff",
                            opacity: openIndex === i ? 1 : 0.7,
                            textAlign: "start",
                            padding: "20px",
                            borderBottom: "1px solid #fff",
                            cursor: "pointer",
                        }}
                        onClick={() => toggleQuestion(i)}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                }}
                            >
                                {q.question}
                            </p>
                            <span style={{ fontSize: "24px" }}>
                                {openIndex === i ? "-" : "+"}
                            </span>
                        </div>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 0.7 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        fontSize: "14px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {q.answer}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>
            <div style={{ height: "100px" }} />
        </motion.div>
    );
};
