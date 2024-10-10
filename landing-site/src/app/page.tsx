"use client";

import React from "react";
import { Main } from "@/components/Main";
import { Feature1 } from "@/components/Feature1";
import { Feature2 } from "@/components/Feature2";
import { Feature3 } from "@/components/Feature3";
import { Feature4 } from "@/components/Feature4";
import { Engine } from "@/components/Engine";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { MainProps } from "@/components/Main";
import { FooterProps } from "@/components/Footer";

type OtherProps = {};

type SectionComponent =
    | { id: "main"; Component: React.ComponentType<MainProps>; props: "main" }
    | {
          id: "footer";
          Component: React.ComponentType<FooterProps>;
          props: "footer";
      }
    | {
          id: string;
          Component: React.ComponentType<OtherProps>;
          props?: undefined;
      };

const sections: SectionComponent[] = [
    { id: "main", Component: Main, props: "main" },
    { id: "feature1", Component: Feature1 },
    { id: "feature2", Component: Feature2 },
    { id: "feature3", Component: Feature3 },
    { id: "feature4", Component: Feature4 },
    { id: "engine", Component: Engine },
    { id: "faq", Component: FAQ },
    { id: "footer", Component: Footer, props: "footer" },
];

export default function Home() {
    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="app-container">
            {sections.map((section) => (
                <section key={section.id} id={section.id}>
                    {section.props === "main" ? (
                        <section.Component
                            scrollToFeature1={() => scrollToSection("feature1")}
                            scrollToFooter={() => scrollToSection("footer")}
                        />
                    ) : section.props === "footer" ? (
                        <section.Component
                            scrollToFAQ={() => scrollToSection("faq")}
                        />
                    ) : (
                        <section.Component />
                    )}
                </section>
            ))}
        </div>
    );
}
