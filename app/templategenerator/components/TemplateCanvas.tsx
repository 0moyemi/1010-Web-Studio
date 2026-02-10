"use client";

import { TemplateType, QuoteData, CarouselData, VideoData } from "../page";
import QuoteTemplate from "./QuoteTemplate";
import CarouselTemplate from "./CarouselTemplate";
import VideoTemplate from "./VideoTemplate";

interface TemplateCanvasProps {
    templateType: TemplateType;
    quoteData: QuoteData;
    carouselData: CarouselData;
    videoData: VideoData;
}

export default function TemplateCanvas({
    templateType,
    quoteData,
    carouselData,
    videoData,
}: TemplateCanvasProps) {
    // If viewing all carousel slides, show them in a scrollable row
    if (templateType === "carousel" && carouselData.viewAllSlides) {
        return (
            <div className="relative w-full">
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {[0, 1, 2, 3, 4].map((slideIndex) => (
                        <div
                            key={slideIndex}
                            id={slideIndex === 0 ? "template-canvas" : `template-canvas-${slideIndex}`}
                            className="flex-shrink-0 relative bg-[var(--background)] overflow-hidden shadow-2xl rounded-lg"
                            style={{
                                width: "216px", // Half size for overview
                                height: "270px",
                                aspectRatio: "4/5",
                            }}
                        >
                            <CarouselTemplate
                                data={{
                                    ...carouselData,
                                    currentSlide: slideIndex
                                }}
                            />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-[var(--text-muted)] text-center mt-2">
                    Scroll to view all slides • Click "Single Slide View" to export individual slides
                </p>
            </div>
        );
    }

    // Calculate dynamic aspect ratio for video template
    const getVideoAspectRatio = () => {
        if (templateType !== "video") return "4/5";

        switch (videoData.videoAspectRatio) {
            case "9:16":
                return "9/16";
            case "4:5":
                return "4/5";
            case "1:1":
                return "1/1";
            default:
                return "9/16";
        }
    };

    // Calculate dimensions label for video
    const getVideoDimensionsLabel = () => {
        switch (videoData.videoAspectRatio) {
            case "9:16":
                return "9:16 • 1080×1920px";
            case "4:5":
                return "4:5 • 1536×1920px";
            case "1:1":
                return "1:1 • 1920×1920px";
            default:
                return "9:16 • 1080×1920px";
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Canvas Container - Dynamic aspect ratio based on template type */}
            <div
                id="template-canvas"
                className="relative bg-[var(--background)] overflow-hidden shadow-2xl w-full rounded-lg"
                style={{
                    aspectRatio: templateType === "video" ? getVideoAspectRatio() : "4/5",
                    maxWidth: templateType === "video" && videoData.videoAspectRatio === "1:1" ? "540px" : "432px",
                }}
            >
                {templateType === "quote" ? (
                    <QuoteTemplate data={quoteData} />
                ) : templateType === "carousel" ? (
                    <CarouselTemplate data={carouselData} />
                ) : (
                    <VideoTemplate data={videoData} />
                )}
            </div>

            {/* Aspect Ratio Label */}
            <div className="absolute -top-7 sm:-top-8 right-0 text-[10px] sm:text-xs text-[var(--text-muted)] font-mono">
                {templateType === "video" ? getVideoDimensionsLabel() : "4:5 • 1080×1350px"}
            </div>
        </div>
    );
}
