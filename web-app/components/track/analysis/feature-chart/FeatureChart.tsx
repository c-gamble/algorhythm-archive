import { camelCaseToTitleCase } from "@/utils/text";
import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Text } from "recharts";

interface AudioFeatures {
    [key: string]: number;
}

interface CustomRadarChartProps {
    audioFeatures: AudioFeatures;
    axisColor?: string;
    textColor?: string;
    displayColor?: string;
    height?: number;
    width?: number;
    textSize?: number;
}

const CustomDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
        <rect
            x={cx - 4}
            y={cy - 4}
            width={8}
            height={8}
            fill={fill}
            stroke={fill}
        />
    );
};

const LABEL_POSITIONS = [
    { x: 50, y: 5 }, // Top
    { x: 90, y: 25 }, // Top Right
    { x: 90, y: 75 }, // Bottom Right
    { x: 50, y: 95 }, // Bottom
    { x: 10, y: 75 }, // Bottom Left
    { x: 10, y: 25 }, // Top Left
];

const CustomAxisTick = (props: any) => {
    const {
        payload,
        textColor,
        textSize,
        cx,
        cy,
        index,
        chartWidth,
        chartHeight,
    } = props;
    const words = payload.value.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word: string) => {
        if ((currentLine + word).length <= 15) {
            currentLine += (currentLine ? " " : "") + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) {
        lines.push(currentLine);
    }

    const position = LABEL_POSITIONS[index % LABEL_POSITIONS.length];
    const labelX = (position.x / 100) * chartWidth;
    const labelY = (position.y / 100) * chartHeight;

    return (
        <g>
            {lines.map((line: string, lineIndex: number) => (
                <Text
                    key={lineIndex}
                    x={labelX}
                    y={labelY + lineIndex * (textSize || 12)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize={textSize || 12}
                >
                    {line}
                </Text>
            ))}
        </g>
    );
};

export const FeatureChart: React.FC<CustomRadarChartProps> = ({
    audioFeatures,
    axisColor = "#999",
    textColor = "#333",
    displayColor = "green",
    height = 600,
    width = 600,
    textSize = 12,
}) => {
    const data = Object.entries(audioFeatures).map(([name, value]) => ({
        name: camelCaseToTitleCase(name),
        value,
    }));

    return (
        <RadarChart
            height={height}
            width={width}
            outerRadius="80%"
            data={data}
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            }}
        >
            <PolarGrid stroke={axisColor} />
            <PolarAngleAxis
                dataKey="name"
                tick={(props) => (
                    <CustomAxisTick
                        {...props}
                        textColor={textColor}
                        textSize={textSize}
                        cx={width / 2}
                        cy={height / 2}
                        chartWidth={width}
                        chartHeight={height}
                    />
                )}
            />
            <Radar
                dataKey="value"
                stroke={displayColor}
                fill={displayColor}
                fillOpacity={0.3}
                strokeOpacity={1}
                dot={<CustomDot />}
            />
        </RadarChart>
    );
};
