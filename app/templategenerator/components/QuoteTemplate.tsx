"use client";

import { QuoteData } from "../page";

interface QuoteTemplateProps {
    data: QuoteData;
}

export default function QuoteTemplate({ data }: QuoteTemplateProps) {
    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Image Section - 60% */}
            <div className="relative h-[60%] overflow-hidden">
                {data.image ? (
                    <>
                        {/* Uploaded Image */}
                        <img
                            src={data.image}
                            alt="Quote background"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{
                                objectPosition: `${data.imagePosition.x}% ${data.imagePosition.y}%`,
                                transform: `scale(${data.imageScale})`,
                            }}
                            crossOrigin="anonymous"
                        />

                        {/* Fade Gradient Overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to bottom, 
                  transparent 0%, 
                  transparent 40%,
                  rgba(4, 13, 31, 0.3) 70%,
                  rgba(4, 13, 31, 0.8) 90%,
                  rgba(4, 13, 31, 1) 100%)`,
                            }}
                        />

                        {/* Blur Effect at Bottom */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-32"
                            style={{
                                backdropFilter: "blur(8px)",
                                maskImage: "linear-gradient(to top, black, transparent)",
                            }}
                        />

                        {/* Subtle Branding - Top Right */}
                        <div className="absolute top-3 right-3 z-10">
                            <p className="text-[9px] text-white/100 font-mono tracking-wider backdrop-blur-sm py-1 rounded">
                                www.1010web.studio
                            </p>
                        </div>
                    </>
                ) : (
                    // Placeholder when no image
                    <div className="w-full h-full flex items-center justify-center bg-[var(--card-background)]">
                        <p className="text-[var(--text-muted)] text-lg">Upload an image</p>
                    </div>
                )}
            </div>

            {/* Divider + Logo Section */}
            <div className="absolute top-[60%] left-0 right-0 flex items-center justify-center z-20 -translate-y-1/2">
                {/* Left Line - Gradient thickness effect */}
                <div
                    className="flex-1 mr-4"
                    style={{
                        maxWidth: "38%",
                        height: "3px",
                        background: "linear-gradient(90deg, transparent 0%, rgba(232, 240, 255, 0.4) 50%, transparent 100%)",
                        maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                    }}
                />

                {/* Logo Mark */}
                <div
                    className="bg-[var(--background)] rounded-full p-3 shadow-lg flex items-center justify-center"
                    style={{
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <img
                        src="/1010 Primary Logo.svg"
                        alt="1010 Web Studio"
                        className="w-10 h-10 object-contain"
                    />
                </div>

                {/* Right Line - Gradient thickness effect */}
                <div
                    className="flex-1 ml-4"
                    style={{
                        maxWidth: "38%",
                        height: "3px",
                        background: "linear-gradient(90deg, transparent 0%, rgba(232, 240, 255, 0.4) 50%, transparent 100%)",
                        maskImage: "linear-gradient(to left, transparent 0%, black 15%, black 85%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 15%, black 85%, transparent 100%)",
                    }}
                />
            </div>

            {/* Text Section - 40% */}
            <div className="h-[40%] bg-[var(--background)] flex flex-col items-center justify-between px-6 py-8">
                {/* Spacer for top padding */}
                <div className="flex-1" />

                {/* Quote Text - Centered */}
                <div className="flex-shrink-0">
                    <p
                        className="font-bold text-center text-gradient-accent uppercase leading-tight mb-4"
                        style={{
                            fontSize: `${data.fontSize}px`,
                            letterSpacing: '-0.02em',
                            lineHeight: '1.3',
                            whiteSpace: 'pre-line', // Preserve line breaks
                        }}
                    >
                        &ldquo;{data.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <p className="text-xs text-white font-semibold tracking-wide italic text-center opacity-80">
                        - {data.author} -
                    </p>
                </div>

                {/* Spacer for bottom padding */}
                <div className="flex-1" />
            </div>
        </div>
    );
}
