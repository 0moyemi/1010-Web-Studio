"use client";

import { VideoData } from "../page";
import { useRef, useEffect } from "react";

interface VideoTemplateProps {
    data: VideoData;
}

export default function VideoTemplate({ data }: VideoTemplateProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Reset video when source changes
        if (videoRef.current && data.video) {
            videoRef.current.load();
        }
    }, [data.video]);

    // Parse caption to highlight words wrapped in asterisks
    const renderCaption = () => {
        const parts = data.caption.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                // Remove asterisks and apply highlight color
                const text = part.slice(1, -1);
                return (
                    <span key={index} style={{ color: 'var(--highlight)' }}>
                        {text}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#040d1f]">
            {/* Caption Section - Top 20% */}
            <div
                className="absolute top-0 left-0 right-0 z-20 flex items-end justify-start px-6 pb-4"
                style={{
                    height: "20%",
                    background: "linear-gradient(to bottom, rgba(4, 13, 31, 0.95) 0%, rgba(4, 13, 31, 0.85) 100%)",
                }}
            >
                <h2
                    className="font-bold text-white text-left leading-tight"
                    style={{
                        fontSize: `${data.captionFontSize}px`,
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
                        letterSpacing: "-0.02em",
                        whiteSpace: "pre-line",
                    }}
                >
                    {renderCaption()}
                </h2>
            </div>

            {/* Video Section - Bottom 80% */}
            <div
                className="absolute left-0 right-0 bottom-0 overflow-hidden"
                style={{
                    top: "20%",
                    height: "80%",
                }}
            >
                {data.video ? (
                    <div className="relative w-full h-full bg-black">
                        {/* Video fills entire section */}
                        <video
                            ref={videoRef}
                            src={data.video}
                            className="w-full h-full object-cover"
                            loop
                            muted
                            playsInline
                            autoPlay
                            style={{
                                objectPosition: `${data.videoPosition.x}% ${data.videoPosition.y}%`,
                                transform: `scale(${data.videoScale})`,
                            }}
                        />

                        {/* Website Watermark - Top Right of Video Section */}
                        <div className="absolute top-3 right-3 z-30">
                            <span
                                className="text-white/90 font-mono font-semibold tracking-wide px-3 py-1.5 rounded-full block"
                                style={{
                                    fontSize: "11px",
                                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                                    background: "rgba(4, 13, 31, 0.6)",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                www.1010web.studio
                            </span>
                        </div>
                    </div>
                ) : (
                    // Placeholder when no video
                    <div className="w-full h-full flex items-center justify-center bg-[var(--card-background)]">
                        <p className="text-[var(--text-muted)] text-lg">Upload a video</p>
                    </div>
                )}
            </div>
        </div>
    );
}
