"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import TemplateCanvas from "./components/TemplateCanvas";
import ControlPanel from "./components/ControlPanel";
import ExportButton from "./components/ExportButton";

export type TemplateType = "quote" | "carousel";

export interface QuoteData {
    quote: string;
    author: string;
    image: string | null;
    imagePosition: { x: number; y: number };
    imageScale: number;
    fontSize: number; // Manual font size control
}

export interface CarouselData {
    hook: string;
    tips: Array<{ title: string; description: string }>;
    cta: string;
    currentSlide: number;
    viewAllSlides: boolean;
    hookFontSize: number;
    tipTitleFontSize: number;
    tipDescriptionFontSize: number;
    ctaFontSize: number;
}

export default function TemplateGenerator() {
    const [templateType, setTemplateType] = useState<TemplateType>("quote");
    const [quoteData, setQuoteData] = useState<QuoteData>({
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        image: null,
        imagePosition: { x: 50, y: 50 },
        imageScale: 1,
        fontSize: 24, // Default font size
    });

    const [carouselData, setCarouselData] = useState<CarouselData>({
        hook: "3 Tips to Grow Your Business on WhatsApp",
        tips: [
            {
                title: "Build Trust",
                description: "Share your products clearly with a single link",
            },
            {
                title: "Stay Organized",
                description: "Keep all your customer conversations in one place",
            },
            {
                title: "Follow Up",
                description: "Respond quickly and never miss an opportunity",
            },
        ],
        cta: "Follow @1010webstudio for more tips",
        currentSlide: 0,
        viewAllSlides: false,
        hookFontSize: 30,
        tipTitleFontSize: 36,
        tipDescriptionFontSize: 28,
        ctaFontSize: 30,
    });

    // Load saved data from localStorage on mount
    useEffect(() => {
        try {
            const savedTemplateType = localStorage.getItem('templateType');
            const savedQuoteData = localStorage.getItem('quoteData');
            const savedCarouselData = localStorage.getItem('carouselData');

            if (savedTemplateType) setTemplateType(savedTemplateType as TemplateType);
            if (savedQuoteData) setQuoteData(JSON.parse(savedQuoteData));
            if (savedCarouselData) setCarouselData(JSON.parse(savedCarouselData));
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('templateType', templateType);
            localStorage.setItem('quoteData', JSON.stringify(quoteData));
            localStorage.setItem('carouselData', JSON.stringify(carouselData));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, [templateType, quoteData, carouselData]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 relative z-10 max-w-[1800px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-12">
                {/* Page Header */}
                <div className="mb-8 sm:mb-12 text-center scroll-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gradient">
                        Template Generator
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
                        Create stunning Instagram-ready graphics with your brand identity
                    </p>
                </div>

                {/* Template Type Selector */}
                <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => setTemplateType("quote")}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${templateType === "quote"
                            ? "bg-[var(--highlight)] text-white shadow-lg"
                            : "bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)]"
                            }`}
                    >
                        Quote Post
                    </button>
                    <button
                        onClick={() => setTemplateType("carousel")}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${templateType === "carousel"
                            ? "bg-[var(--highlight)] text-white shadow-lg"
                            : "bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)]"
                            }`}
                    >
                        Carousel Post
                    </button>
                </div>

                {/* Main Content - Mobile: Canvas first, Desktop: Controls first */}
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-stretch lg:items-start">
                    {/* Canvas + Export - Shows first on mobile */}
                    <div className="flex flex-col gap-4 sm:gap-6 items-center lg:order-2">
                        <TemplateCanvas
                            templateType={templateType}
                            quoteData={quoteData}
                            carouselData={carouselData}
                        />
                        <ExportButton
                            templateType={templateType}
                            carouselData={carouselData}
                            setCarouselData={setCarouselData}
                        />
                    </div>

                    {/* Control Panel - Shows second on mobile, first on desktop */}
                    <div className="lg:order-1">
                        <ControlPanel
                            templateType={templateType}
                            quoteData={quoteData}
                            carouselData={carouselData}
                            setQuoteData={setQuoteData}
                            setCarouselData={setCarouselData}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
