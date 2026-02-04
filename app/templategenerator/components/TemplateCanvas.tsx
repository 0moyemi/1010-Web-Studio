"use client";

import { TemplateType, QuoteData, CarouselData } from "../page";
import QuoteTemplate from "./QuoteTemplate";
import CarouselTemplate from "./CarouselTemplate";

interface TemplateCanvasProps {
    templateType: TemplateType;
    quoteData: QuoteData;
    carouselData: CarouselData;
}

export default function TemplateCanvas({
    templateType,
    quoteData,
    carouselData,
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

    return (
        <div className="relative w-full max-w-md mx-auto"
        >
            {/* Canvas Container - Maintains 4:5 aspect ratio (1080x1350) */}
            <div
                id="template-canvas"
                className="relative bg-[var(--background)] overflow-hidden shadow-2xl w-full rounded-lg"
                style={{
                    aspectRatio: "4/5",
                    maxWidth: "432px",
                }}
            >
                {templateType === "quote" ? (
                    <QuoteTemplate data={quoteData} />
                ) : (
                    <CarouselTemplate data={carouselData} />
                )}
            </div>

            {/* Aspect Ratio Label */}
            <div className="absolute -top-7 sm:-top-8 right-0 text-[10px] sm:text-xs text-[var(--text-muted)] font-mono">
                4:5 • 1080×1350px
            </div>
        </div>
    );
}
