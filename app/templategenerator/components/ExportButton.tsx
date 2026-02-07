"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { TemplateType, CarouselData } from "../page";
import JSZip from "jszip";

interface ExportButtonProps {
    templateType: TemplateType;
    carouselData?: CarouselData;
    setCarouselData?: (data: CarouselData) => void;
}

export default function ExportButton({ templateType, carouselData, setCarouselData }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExporting(true);

        try {
            // Dynamic import to reduce bundle size
            const { toPng } = await import("html-to-image");

            const canvasElement = document.getElementById("template-canvas");
            if (!canvasElement) {
                throw new Error("Canvas element not found");
            }

            const timestamp = new Date().toISOString().slice(0, 10);

            // For carousel with batch export
            if (templateType === "carousel" && carouselData && setCarouselData) {
                const originalSlide = carouselData.currentSlide;
                const wasViewingAll = carouselData.viewAllSlides;

                // Turn off view all slides mode
                if (wasViewingAll) {
                    setCarouselData({ ...carouselData, viewAllSlides: false });
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // Create ZIP file
                const zip = new JSZip();

                // Export each slide and add to ZIP
                for (let i = 0; i < 5; i++) {
                    // Set current slide
                    setCarouselData({ ...carouselData, currentSlide: i, viewAllSlides: false });

                    // Wait for render - increased time
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // Wait for images to load
                    const images = canvasElement.querySelectorAll('img');
                    await Promise.all(
                        Array.from(images).map(img => {
                            if (img.complete) return Promise.resolve();
                            return new Promise<void>((resolve) => {
                                img.onload = () => resolve();
                                img.onerror = () => resolve();
                                setTimeout(() => resolve(), 3000);
                            });
                        })
                    );

                    // Additional wait for full render
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Export at full resolution (1080x1350)
                    const dataUrl = await toPng(canvasElement, {
                        quality: 1.0,
                        pixelRatio: 2.5,
                        cacheBust: true,
                        backgroundColor: "#040d1f",
                        skipFonts: false,
                    });

                    // Convert data URL to blob properly
                    const response = await fetch(dataUrl);
                    const blob = await response.blob();

                    // Verify blob has content
                    if (blob.size === 0) {
                        throw new Error(`Slide ${i + 1} failed to capture`);
                    }

                    // Add blob to ZIP
                    zip.file(`slide-${i + 1}.png`, blob);
                }

                // Generate ZIP file
                const zipBlob = await zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }
                });

                // Create download link for ZIP
                const link = document.createElement("a");
                link.download = `carousel-slides-${timestamp}.zip`;
                link.href = URL.createObjectURL(zipBlob);
                link.click();

                // Clean up after a delay
                setTimeout(() => URL.revokeObjectURL(link.href), 1000);

                // Restore original state
                setCarouselData({
                    ...carouselData,
                    currentSlide: originalSlide,
                    viewAllSlides: wasViewingAll
                });
            } else {
                // Single export for quote template
                // Wait for all images to be fully loaded
                const images = canvasElement.querySelectorAll('img');
                await Promise.all(
                    Array.from(images).map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise<void>((resolve, reject) => {
                            img.onload = () => resolve();
                            img.onerror = reject;
                            // Timeout after 5 seconds
                            setTimeout(() => resolve(), 5000);
                        });
                    })
                );

                // Extra wait for rendering
                await new Promise(resolve => setTimeout(resolve, 500));

                const dataUrl = await toPng(canvasElement, {
                    quality: 1.0,
                    pixelRatio: 2.5,
                    cacheBust: true,
                    backgroundColor: "#040d1f",
                    skipFonts: false,
                    filter: (node) => {
                        // Ensure we capture everything
                        return true;
                    }
                });

                const link = document.createElement("a");
                link.download = `${templateType}-post-${timestamp}.png`;
                link.href = dataUrl;
                link.click();
            }

            // Success feedback
            setTimeout(() => setIsExporting(false), 800);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export image. Please try again.");
            setIsExporting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="
        group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white text-sm sm:text-base
        bg-gradient-to-r from-[var(--highlight)] to-[rgba(59,89,152,0.7)]
        hover:shadow-xl hover:shadow-[rgba(59,89,152,0.3)]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 overflow-hidden
        active:scale-95
      "
        >
            {/* Animated background on hover */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-[rgba(59,89,152,0.8)] to-[var(--highlight)] 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Button content */}
            <span className="relative flex items-center gap-2">
                {isExporting ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Exporting...
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        Export as PNG
                    </>
                )}
            </span>
        </button>
    );
}
