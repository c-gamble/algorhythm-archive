import React from "react";
import { PieValueType } from "@mui/x-charts/models";

// Define the props interface based on the error message
interface CustomLabelProps extends Omit<PieValueType, "label"> {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    label?: string;
}

const RADIAN = Math.PI / 180;

export const renderCustomizedPieChartLabel = (
    props: CustomLabelProps,
): string => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return `${(percent * 100).toFixed(0)}%`;
};
