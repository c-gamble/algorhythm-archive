import React from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";
import { City } from "@/customTypes";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface MapChartProps {
    cities: City[];
    gradientColors?: [string, string];
    width: string | number;
}

export const ListenerMap: React.FC<MapChartProps> = ({
    cities,
    gradientColors = ["#FFA500", "#FF4500"],
    width,
}) => {
    const maxWeight = Math.max(...cities.map((city) => city.weight));
    const aspectRatio = 0.6;
    const [mapWidth, mapHeight] = React.useMemo(() => {
        const numericWidth = typeof width === "number" ? width : 600;
        return [numericWidth, numericWidth * aspectRatio];
    }, [width, aspectRatio]);

    return (
        <div
            style={{
                width: typeof width === "string" ? width : `${width}px`,
                height: "auto",
                borderRadius: "0.5rem",
                overflow: "hidden",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
        >
            <ComposableMap
                projection="geoAlbersUsa" // Changed to US-specific projection
                width={mapWidth}
                height={mapHeight}
                projectionConfig={{
                    scale: 800,
                    center: [-96, 38],
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <rect
                    x={0}
                    y={0}
                    width={mapWidth}
                    height={mapHeight}
                    fill="#8c8c8c"
                />

                <ZoomableGroup center={[0, 0]}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: any) =>
                            geographies.map((geo: any) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#EAEAEC"
                                    stroke="#D6D6DA"
                                />
                            ))
                        }
                    </Geographies>
                    {cities.map(
                        ({ name, coordinates, weight, explanation }) => {
                            const size = (weight / maxWeight) * 20 + 5;
                            return (
                                <Marker
                                    key={name}
                                    coordinates={coordinates}
                                    // show explanation on hover
                                    onMouseEnter={() => {
                                        console.log(explanation);
                                    }}
                                >
                                    <circle
                                        r={size}
                                        fill="url(#blueGradient)"
                                        stroke="#0064FF"
                                        strokeWidth="2"
                                    />
                                </Marker>
                            );
                        },
                    )}
                </ZoomableGroup>
                <defs>
                    <radialGradient
                        id="blueGradient"
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                    >
                        <stop offset="0%" stopColor="rgba(0, 100, 255, 0.8)" />
                        <stop offset="50%" stopColor="rgba(0, 100, 255, 0.4)" />
                        <stop
                            offset="100%"
                            stopColor="rgba(0, 100, 255, 0.1)"
                        />
                    </radialGradient>
                </defs>
            </ComposableMap>
        </div>
    );
};
