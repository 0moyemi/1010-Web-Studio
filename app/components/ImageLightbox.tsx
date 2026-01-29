"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ImageLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
}

export function ImageLightbox({ isOpen, onClose, imageSrc, imageAlt }: ImageLightboxProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(8px)'
                }}
                aria-hidden="true"
            />
            <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 rounded-full p-3 transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
                aria-label="Close"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <div
                className="relative max-h-[90vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={1920}
                    height={1080}
                    className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                    priority
                />
            </div>
        </div>
    );
}
