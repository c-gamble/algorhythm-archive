import { CampaignOutput, City, PieChartItem } from "@/customTypes";
import { ListenerMap } from "@/components/track/audience/listener-map/ListenerMap";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import React, { useEffect, useRef, useState } from "react";
import { PIE_CHART_COLORS } from "@/constants";
import { camelCaseToTitleCase, trimToLength } from "@/utils/text";

export const Audience = ({ campaign }: { campaign: CampaignOutput }) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [chartWidth, setChartWidth] = useState(400);

    useEffect(() => {
        const updateChartWidth = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.offsetWidth);
            }
        };

        // Initial update
        updateChartWidth();

        // Update on window resize
        window.addEventListener("resize", updateChartWidth);

        // Cleanup
        return () => window.removeEventListener("resize", updateChartWidth);
    }, []);

    return (
        <div className="flex flex-row mt-8 w-full">
            <div className="flex flex-col w-[60%]">
                <div className="flex flex-col p-4 bg-white rounded-lg items-center w-full">
                    <p className="text-[14px] text-black w-full text-left mb-4 mt-2">
                        Listener Location
                    </p>
                    <div className="w-full">
                        <ListenerMap
                            cities={campaign.Audience.cities}
                            width="100%"
                        />
                    </div>
                    <div className="flex flex-row justify-start items-center w-full mt-4">
                        <p className="text-[14px] text-black w-full text-left">
                            <span className="font-medium">Top Cities:</span>{" "}
                            {campaign.Audience.cities
                                .map((city: City) => city.name)
                                .join("; ")}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col p-4 bg-white rounded-lg items-center mt-8 w-full">
                    <p className="text-[14px] text-black w-full text-left mb-2 mt-2">
                        Audience Summary
                    </p>
                    <div className="flex flex-row justify-start items-center w-full">
                        <p className="text-[14px] text-sixtyPBlack w-full text-left">
                            {campaign.Audience.summary}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[40%] ml-8 py-8 bg-white rounded-lg">
                <div
                    ref={chartContainerRef}
                    className="flex flex-col w-full items-center justify-center"
                >
                    <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mb-4">
                        Listener Age
                    </p>
                    <PieChart
                        series={[
                            {
                                data: campaign.Audience.ageDistribution.map(
                                    (age: PieChartItem, index: number) => ({
                                        id: index,
                                        value: age.value,
                                        label: camelCaseToTitleCase(age.name),
                                        color: PIE_CHART_COLORS[index],
                                    }),
                                ),
                                valueFormatter: (item) => `${item.value}%`,
                            },
                        ]}
                        width={chartWidth}
                        height={200}
                        sx={{
                            marginLeft: "-36px",
                        }}
                    />
                </div>
                <div
                    ref={chartContainerRef}
                    className="flex flex-col w-full items-center justify-center mt-8"
                >
                    <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mb-4">
                        Listener Sex
                    </p>
                    <PieChart
                        series={[
                            {
                                data: campaign.Audience.sexDistribution.map(
                                    (sex: PieChartItem, index: number) => ({
                                        id: index,
                                        value: sex.value,
                                        label: camelCaseToTitleCase(sex.name),
                                        color: PIE_CHART_COLORS[index],
                                    }),
                                ),
                                valueFormatter: (item) => `${item.value}%`,
                            },
                        ]}
                        width={chartWidth}
                        height={200}
                        sx={{
                            marginLeft: "-36px",
                        }}
                    />
                </div>
                <div
                    ref={chartContainerRef}
                    className="flex flex-col w-full items-center justify-center mt-8"
                >
                    <p className="text-[14px] text-eightyPBlack w-full font-semibold text-center mb-4">
                        Listener Ethnicity
                    </p>
                    <PieChart
                        series={[
                            {
                                data: campaign.Audience.ethnicityDistribution.map(
                                    (
                                        ethnicity: PieChartItem,
                                        index: number,
                                    ) => ({
                                        id: index,
                                        value: ethnicity.value,
                                        label: camelCaseToTitleCase(
                                            trimToLength(ethnicity.name, 5),
                                        ),
                                        color: PIE_CHART_COLORS[index],
                                    }),
                                ),
                                valueFormatter: (item) => `${item.value}%`,
                            },
                        ]}
                        width={chartWidth}
                        height={200}
                        sx={{
                            marginLeft: "-36px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
