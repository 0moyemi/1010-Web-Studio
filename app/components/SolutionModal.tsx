"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

export interface Solution {
    title: string;
    pain: string[];
    solution: string[];
    outcome: string[];
    images: { src: string; alt: string }[];
}

interface SolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    solution: Solution | null;
}

export function SolutionModal({ isOpen, onClose, solution }: SolutionModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setCurrentImageIndex(0);
        } else {
            document.body.style.overflow = "unset";
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !lightboxOpen) onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, lightboxOpen]);

    if (!isOpen || !solution) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % solution.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + solution.images.length) % solution.images.length);
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-screen px-4 flex items-center justify-center">
                    <div
                        className="fixed inset-0 backdrop-blur-md"
                        style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px) saturate(0.8)'
                        }}
                        aria-hidden="true"
                    />
                    <div
                        className="relative w-full max-w-5xl rounded-2xl border backdrop-blur-xl glass-noise my-8"
                        style={{
                            background: 'var(--glass-bg)',
                            borderColor: 'var(--glass-border)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 rounded-full p-2 transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
                            aria-label="Close modal"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="p-8 lg:p-10">
                            <h3
                                className="mb-6 text-2xl lg:text-3xl font-bold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {solution.title}
                            </h3>

                            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                                {/* Left Column: Text Content */}
                                <div className="space-y-6">
                                    {/* Pain */}
                                    <div>
                                        <h4
                                            className="text-lg font-semibold mb-3"
                                            style={{ color: 'var(--highlight)' }}
                                        >
                                            Pain
                                        </h4>
                                        <ul className="space-y-2 list-none">
                                            {solution.pain.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm leading-relaxed"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Solution */}
                                    <div>
                                        <h4
                                            className="text-lg font-semibold mb-3"
                                            style={{ color: 'var(--highlight)' }}
                                        >
                                            Solution
                                        </h4>
                                        <ul className="space-y-2 list-none">
                                            {solution.solution.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm leading-relaxed"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Outcome */}
                                    <div>
                                        <h4
                                            className="text-lg font-semibold mb-3"
                                            style={{ color: 'var(--highlight)' }}
                                        >
                                            Outcome
                                        </h4>
                                        <ul className="space-y-2 list-none">
                                            {solution.outcome.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm leading-relaxed"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column: Image Carousel */}
                                <div className="space-y-4">
                                    <div
                                        className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                                        onClick={() => setLightboxOpen(true)}
                                    >
                                        <Image
                                            src={solution.images[currentImageIndex].src}
                                            alt={solution.images[currentImageIndex].alt}
                                            fill
                                            className="object-cover"
                                            quality={95}
                                            priority
                                        />
                                        {/* Expand button */}
                                        <div
                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
                                        >
                                            <Maximize2
                                                size={32}
                                                color="white"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                                            />
                                        </div>

                                        {/* Navigation arrows (only if multiple images) */}
                                        {solution.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        prevImage();
                                                    }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={24} color="white" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        nextImage();
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={24} color="white" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Image dots indicator */}
                                    {solution.images.length > 1 && (
                                        <div className="flex justify-center gap-2">
                                            {solution.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: currentImageIndex === index ? '24px' : '8px',
                                                        background: currentImageIndex === index ? 'var(--highlight)' : 'var(--text-muted)',
                                                        opacity: currentImageIndex === index ? 1 : 0.5
                                                    }}
                                                    aria-label={`View image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <p
                                        className="text-xs text-center"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {solution.images.length > 1
                                            ? `${currentImageIndex + 1} / ${solution.images.length} — Click image to view full size`
                                            : 'Click image to view full size'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ImageLightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                imageSrc={solution.images[currentImageIndex].src}
                imageAlt={solution.images[currentImageIndex].alt}
                onNext={() => setCurrentImageIndex((prev) => (prev + 1) % solution.images.length)}
                onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + solution.images.length) % solution.images.length)}
                hasNext={solution.images.length > 1}
                hasPrev={solution.images.length > 1}
            />
        </>
    );
}
