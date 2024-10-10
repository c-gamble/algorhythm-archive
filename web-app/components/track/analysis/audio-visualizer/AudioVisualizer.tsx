import {
    useRef,
    useState,
    forwardRef,
    type ForwardedRef,
    useImperativeHandle,
    useEffect,
    useCallback,
} from "react";
import { type dataPoint } from "@/components/track/analysis/audio-visualizer/types";
import {
    calculateBarData,
    draw,
} from "@/components/track/analysis/audio-visualizer/utils";

interface Props {
    blob: Blob;
    width: number;
    height: number;
    barWidth?: number;
    gap?: number;
    backgroundColor?: string;
    barColor?: string;
    barPlayedColor?: string;
    currentTime?: number;
    style?: React.CSSProperties;
    ref?: React.ForwardedRef<HTMLCanvasElement>;
    highlightStart?: number;
    highlightEnd?: number;
    highlightColor?: string;
}

export const AudioVisualizer: any = forwardRef(
    (
        {
            blob,
            width,
            height,
            barWidth = 2,
            gap = 1,
            currentTime,
            style,
            backgroundColor = "transparent",
            barColor = "rgb(184, 184, 184)",
            barPlayedColor = "rgb(160, 198, 255)",
            highlightStart,
            highlightEnd,
            highlightColor,
        }: Props,
        ref?: ForwardedRef<HTMLCanvasElement>,
    ) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [data, setData] = useState<dataPoint[]>([]);
        const [duration, setDuration] = useState<number>(0);
        const [canvasWidth, setCanvasWidth] = useState<number>(width);

        useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
            ref,
            () => canvasRef.current,
            [],
        );

        const processBlob = useCallback(
            async (width: number): Promise<void> => {
                if (!canvasRef.current) return;

                if (!blob) {
                    const barsData = Array.from({ length: 100 }, () => ({
                        max: 0,
                        min: 0,
                    }));
                    draw(
                        barsData,
                        canvasRef.current,
                        barWidth,
                        gap,
                        backgroundColor,
                        barColor,
                        barPlayedColor,
                    );
                    return;
                }

                const audioBuffer = await blob.arrayBuffer();
                const audioContext = new AudioContext();
                await audioContext.decodeAudioData(audioBuffer, (buffer) => {
                    if (!canvasRef.current) return;
                    setDuration(buffer.duration);
                    const barsData = calculateBarData(
                        buffer,
                        height,
                        width,
                        barWidth,
                        gap,
                    );
                    setData(barsData);
                    draw(
                        barsData,
                        canvasRef.current,
                        barWidth,
                        gap,
                        backgroundColor,
                        barColor,
                        barPlayedColor,
                    );
                });
            },
            [
                blob,
                height,
                barWidth,
                gap,
                backgroundColor,
                barColor,
                barPlayedColor,
            ],
        );

        useEffect(() => {
            processBlob(canvasWidth);
        }, [canvasWidth, processBlob]);

        useEffect(() => {
            if (!canvasRef.current) return;
            draw(
                data,
                canvasRef.current,
                barWidth,
                gap,
                backgroundColor,
                barColor,
                barPlayedColor,
                currentTime,
                duration,
                highlightStart,
                highlightEnd,
                highlightColor,
            );
        }, [
            currentTime,
            duration,
            highlightStart,
            highlightEnd,
            highlightColor,
            data,
        ]);

        useEffect(() => {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.contentBoxSize) {
                        const newWidth = entry.contentBoxSize[0].inlineSize;
                        setCanvasWidth(newWidth);
                        if (canvasRef.current) {
                            canvasRef.current.width = newWidth;
                        }
                    }
                }
            });

            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }

            return () => {
                if (containerRef.current) {
                    resizeObserver.unobserve(containerRef.current);
                }
            };
        }, []);

        return (
            <div ref={containerRef} style={{ width: "100%", height }}>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={height}
                    style={{
                        ...style,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        );
    },
);

AudioVisualizer.displayName = "AudioVisualizer";
