"use client";

import { TemplateType, QuoteData, CarouselData } from "../page";
import ImageUploader from "./ImageUploader";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface ControlPanelProps {
    templateType: TemplateType;
    quoteData: QuoteData;
    carouselData: CarouselData;
    setQuoteData: (data: QuoteData) => void;
    setCarouselData: (data: CarouselData) => void;
}

export default function ControlPanel({
    templateType,
    quoteData,
    carouselData,
    setQuoteData,
    setCarouselData,
}: ControlPanelProps) {
    return (
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                Content Settings
            </h2>

            {templateType === "quote" ? (
                <QuoteControls quoteData={quoteData} setQuoteData={setQuoteData} />
            ) : (
                <CarouselControls
                    carouselData={carouselData}
                    setCarouselData={setCarouselData}
                />
            )}
        </div>
    );
}

// Quote Controls
function QuoteControls({
    quoteData,
    setQuoteData,
}: {
    quoteData: QuoteData;
    setQuoteData: (data: QuoteData) => void;
}) {
    return (
        <div className="space-y-6">
            {/* Image Upload */}
            <ImageUploader quoteData={quoteData} setQuoteData={setQuoteData} />

            {/* Quote Text */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Quote Text
                </label>
                <textarea
                    value={quoteData.quote}
                    onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })}
                    placeholder="Enter your quote... (Press Enter for line breaks)"
                    rows={4}
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] resize-none"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    {quoteData.quote.length} characters • Press Enter to break lines
                </p>
            </div>

            {/* Font Size Control */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Font Size ({quoteData.fontSize}px)
                </label>
                <input
                    type="range"
                    min="14"
                    max="36"
                    value={quoteData.fontSize}
                    onChange={(e) =>
                        setQuoteData({
                            ...quoteData,
                            fontSize: parseInt(e.target.value),
                        })
                    }
                    className="w-full accent-[var(--highlight)]"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                    <span>Small</span>
                    <span>Large</span>
                </div>
            </div>

            {/* Author */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Author
                </label>
                <input
                    type="text"
                    value={quoteData.author}
                    onChange={(e) => setQuoteData({ ...quoteData, author: e.target.value })}
                    placeholder="Author name"
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                />
            </div>
        </div>
    );
}

// Carousel Controls
function CarouselControls({
    carouselData,
    setCarouselData,
}: {
    carouselData: CarouselData;
    setCarouselData: (data: CarouselData) => void;
}) {
    const addTip = () => {
        if (carouselData.tips.length < 5) {
            setCarouselData({
                ...carouselData,
                tips: [...carouselData.tips, { title: "", description: "" }],
            });
        }
    };

    const removeTip = (index: number) => {
        if (carouselData.tips.length > 1) {
            const newTips = carouselData.tips.filter((_, i) => i !== index);
            setCarouselData({ ...carouselData, tips: newTips });
        }
    };

    const updateTip = (
        index: number,
        field: "title" | "description",
        value: string
    ) => {
        const newTips = [...carouselData.tips];
        newTips[index][field] = value;
        setCarouselData({ ...carouselData, tips: newTips });
    };

    return (
        <div className="space-y-6">
            {/* View All Slides Toggle */}
            <div>
                <button
                    onClick={() =>
                        setCarouselData({
                            ...carouselData,
                            viewAllSlides: !carouselData.viewAllSlides,
                        })
                    }
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${carouselData.viewAllSlides
                        ? "bg-[var(--highlight)] text-white"
                        : "bg-[var(--card-background)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                        }`}
                >
                    {carouselData.viewAllSlides ? "Single Slide View" : "View All Slides"}
                </button>
            </div>

            {/* Slide Navigation - Only show when not viewing all */}
            {!carouselData.viewAllSlides && (
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Preview Slide
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setCarouselData({
                                    ...carouselData,
                                    currentSlide: Math.max(0, carouselData.currentSlide - 1),
                                })
                            }
                            disabled={carouselData.currentSlide === 0}
                            className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)]
                     hover:bg-[var(--card-background-light)] disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
                        >
                            <ChevronLeft size={20} className="text-[var(--text-secondary)]" />
                        </button>

                        <div className="flex-1 text-center">
                            <span className="text-sm font-mono text-[var(--text-secondary)]">
                                Slide {carouselData.currentSlide + 1} of {5}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                setCarouselData({
                                    ...carouselData,
                                    currentSlide: Math.min(4, carouselData.currentSlide + 1),
                                })
                            }
                            disabled={carouselData.currentSlide === 4}
                            className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)]
                     hover:bg-[var(--card-background-light)] disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
                        >
                            <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                        </button>
                    </div>
                </div>
            )}

            {/* Hook Text */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Hook (Slide 1)
                </label>
                <textarea
                    value={carouselData.hook}
                    onChange={(e) =>
                        setCarouselData({ ...carouselData, hook: e.target.value })
                    }
                    placeholder="Press Enter for line breaks"
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] resize-none"
                />
                <div className="mt-2">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                        Font Size
                    </label>
                    <input
                        type="range"
                        min="14"
                        max="36"
                        value={carouselData.hookFontSize}
                        onChange={(e) =>
                            setCarouselData({
                                ...carouselData,
                                hookFontSize: parseInt(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                        <span>Small</span>
                        <span>Large</span>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-[var(--text-primary)]">
                        Tips (Slides 2-4)
                    </label>
                    {carouselData.tips.length < 5 && (
                        <button
                            onClick={addTip}
                            className="flex items-center gap-1 text-xs text-[var(--highlight)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <Plus size={14} />
                            Add Tip
                        </button>
                    )}
                </div>

                {/* Font Size Controls for Tips */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg">
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">
                            Title Size
                        </label>
                        <input
                            type="range"
                            min="14"
                            max="48"
                            value={carouselData.tipTitleFontSize}
                            onChange={(e) =>
                                setCarouselData({
                                    ...carouselData,
                                    tipTitleFontSize: parseInt(e.target.value),
                                })
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">
                            Description Size
                        </label>
                        <input
                            type="range"
                            min="14"
                            max="36"
                            value={carouselData.tipDescriptionFontSize}
                            onChange={(e) =>
                                setCarouselData({
                                    ...carouselData,
                                    tipDescriptionFontSize: parseInt(e.target.value),
                                })
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>
                </div>

                {carouselData.tips.map((tip, index) => (
                    <div
                        key={index}
                        className="p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-[var(--text-muted)]">
                                Tip {index + 1}
                            </span>
                            {carouselData.tips.length > 1 && (
                                <button
                                    onClick={() => removeTip(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <input
                            type="text"
                            value={tip.title}
                            onChange={(e) => updateTip(index, "title", e.target.value)}
                            placeholder="Press Enter for line breaks"
                            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] 
                       rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                       focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
                        />

                        <textarea
                            value={tip.description}
                            onChange={(e) => updateTip(index, "description", e.target.value)}
                            placeholder="Press Enter for line breaks"
                            rows={2}
                            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] 
                       rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                       focus:outline-none focus:ring-1 focus:ring-[var(--highlight)] resize-none"
                        />
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Call to Action (Slide 5)
                </label>
                <input
                    type="text"
                    value={carouselData.cta}
                    onChange={(e) =>
                        setCarouselData({ ...carouselData, cta: e.target.value })
                    }
                    placeholder="Press Enter for line breaks"
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                />
                <div className="mt-2">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                        Font Size
                    </label>
                    <input
                        type="range"
                        min="14"
                        max="36"
                        value={carouselData.ctaFontSize}
                        onChange={(e) =>
                            setCarouselData({
                                ...carouselData,
                                ctaFontSize: parseInt(e.target.value),
                            })
                        }
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                        <span>Small</span>
                        <span>Large</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
