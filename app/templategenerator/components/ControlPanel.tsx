"use client";

import { TemplateType, QuoteData, CarouselData, VideoData } from "../page";
import ImageUploader from "./ImageUploader";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface ControlPanelProps {
    templateType: TemplateType;
    quoteData: QuoteData;
    carouselData: CarouselData;
    videoData: VideoData;
    setQuoteData: (data: QuoteData) => void;
    setCarouselData: (data: CarouselData) => void;
    setVideoData: (data: VideoData) => void;
}

export default function ControlPanel({
    templateType,
    quoteData,
    carouselData,
    videoData,
    setQuoteData,
    setCarouselData,
    setVideoData,
}: ControlPanelProps) {
    return (
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                Content Settings
            </h2>

            {templateType === "quote" ? (
                <QuoteControls quoteData={quoteData} setQuoteData={setQuoteData} />
            ) : templateType === "carousel" ? (
                <CarouselControls
                    carouselData={carouselData}
                    setCarouselData={setCarouselData}
                />
            ) : (
                <VideoControls videoData={videoData} setVideoData={setVideoData} />
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
                            Label Size (hidden)
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
                            disabled
                        />
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">
                            Text Size
                        </label>
                        <input
                            type="range"
                            min="18"
                            max="48"
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
                            placeholder="Internal label (not shown on slide)"
                            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] 
                       rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                       focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
                        />

                        <textarea
                            value={tip.description}
                            onChange={(e) => updateTip(index, "description", e.target.value)}
                            placeholder="Main text displayed on slide (Press Enter for line breaks)"
                            rows={3}
                            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] 
                       rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                       focus:outline-none focus:ring-1 focus:ring-[var(--highlight)] resize-none"
                        />
                    </div>
                ))}
            </div>

            {/* CTA Note */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Short Note (Slide 5)
                </label>
                <textarea
                    value={carouselData.ctaNote}
                    onChange={(e) =>
                        setCarouselData({ ...carouselData, ctaNote: e.target.value })
                    }
                    placeholder="Enter a short note... (Press Enter for line breaks)"
                    rows={2}
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
                        value={carouselData.ctaNoteFontSize}
                        onChange={(e) =>
                            setCarouselData({
                                ...carouselData,
                                ctaNoteFontSize: parseInt(e.target.value),
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

            {/* CTA Call to Action */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Call to Action (Slide 5)
                </label>
                <textarea
                    value={carouselData.ctaCall}
                    onChange={(e) =>
                        setCarouselData({ ...carouselData, ctaCall: e.target.value })
                    }
                    placeholder="Enter your call to action... (Press Enter for line breaks)"
                    rows={2}
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
                        value={carouselData.ctaCallFontSize}
                        onChange={(e) =>
                            setCarouselData({
                                ...carouselData,
                                ctaCallFontSize: parseInt(e.target.value),
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

// Video Controls
function VideoControls({
    videoData,
    setVideoData,
}: {
    videoData: VideoData;
    setVideoData: (data: VideoData) => void;
}) {
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (Safari can struggle with large files as data URLs)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                alert("Video file is too large. Please use a video under 50MB for best compatibility.");
                return;
            }

            if (videoData.video) {
                URL.revokeObjectURL(videoData.video);
            }

            const objectUrl = URL.createObjectURL(file);
            setVideoData({ ...videoData, video: objectUrl, videoFile: file });

            // Allow re-uploading the same file if needed
            e.target.value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Video Upload */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Upload Video
                </label>
                <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    onChange={handleVideoUpload}
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]
                   file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                   file:text-sm file:font-semibold file:bg-[var(--highlight)]
                   file:text-white hover:file:bg-[var(--highlight)]/80 file:cursor-pointer"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    Supports MP4, MOV, WebM • Max 50MB recommended<br />
                    📱 Mobile: Downloads go to your Downloads folder
                </p>
                {videoData.video && (
                    <button
                        onClick={() => {
                            if (videoData.video) {
                                URL.revokeObjectURL(videoData.video);
                            }
                            setVideoData({ ...videoData, video: null, videoFile: null });
                        }}
                        className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                        Remove Video
                    </button>
                )}
            </div>

            {/* Video Aspect Ratio Selector */}
            {videoData.video && (
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                        Video Frame Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: "9:16", label: "Vertical" },
                            { value: "4:5", label: "Portrait" },
                            { value: "1:1", label: "Square" },
                        ].map((ratio) => (
                            <button
                                key={ratio.value}
                                onClick={() =>
                                    setVideoData({
                                        ...videoData,
                                        videoAspectRatio: ratio.value as "1:1" | "4:5" | "9:16",
                                    })
                                }
                                className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${videoData.videoAspectRatio === ratio.value
                                    ? "bg-[var(--highlight)] text-white"
                                    : "bg-[var(--card-background)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)]"
                                    }`}
                            >
                                {ratio.label}
                                <div className="text-[10px] opacity-70 mt-1">{ratio.value}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Video Position Controls */}
            {videoData.video && (
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[var(--text-primary)]">
                        Video Position & Scale
                    </label>

                    {/* Horizontal Position */}
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-2">
                            Horizontal Position
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={videoData.videoPosition.x}
                            onChange={(e) =>
                                setVideoData({
                                    ...videoData,
                                    videoPosition: {
                                        ...videoData.videoPosition,
                                        x: parseInt(e.target.value),
                                    },
                                })
                            }
                            className="w-full accent-[var(--highlight)]"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                            <span>Left</span>
                            <span>Center</span>
                            <span>Right</span>
                        </div>
                    </div>

                    {/* Vertical Position */}
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-2">
                            Vertical Position
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={videoData.videoPosition.y}
                            onChange={(e) =>
                                setVideoData({
                                    ...videoData,
                                    videoPosition: {
                                        ...videoData.videoPosition,
                                        y: parseInt(e.target.value),
                                    },
                                })
                            }
                            className="w-full accent-[var(--highlight)]"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                            <span>Top</span>
                            <span>Center</span>
                            <span>Bottom</span>
                        </div>
                    </div>

                    {/* Scale */}
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-2">
                            Zoom ({videoData.videoScale.toFixed(1)}x)
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={videoData.videoScale}
                            onChange={(e) =>
                                setVideoData({
                                    ...videoData,
                                    videoScale: parseFloat(e.target.value),
                                })
                            }
                            className="w-full accent-[var(--highlight)]"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                            <span>Zoom Out</span>
                            <span>Zoom In</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Caption Text */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Caption
                </label>
                <textarea
                    value={videoData.caption}
                    onChange={(e) => setVideoData({ ...videoData, caption: e.target.value })}
                    placeholder="Enter your caption..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--card-background)] border border-[var(--border-color)] 
                   rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] resize-none"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    Wrap words in *asterisks* to <span style={{ color: 'var(--highlight)' }}>highlight them</span>
                </p>
            </div>

            {/* Caption Font Size Control */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Caption Font Size ({videoData.captionFontSize}px)
                </label>
                <input
                    type="range"
                    min="16"
                    max="40"
                    value={videoData.captionFontSize}
                    onChange={(e) =>
                        setVideoData({
                            ...videoData,
                            captionFontSize: parseInt(e.target.value),
                        })
                    }
                    className="w-full accent-[var(--highlight)]"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                    <span>Small</span>
                    <span>Large</span>
                </div>
            </div>
        </div>
    );
}
