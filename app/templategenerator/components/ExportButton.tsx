"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { TemplateType, CarouselData, VideoData } from "../page";
import JSZip from "jszip";

interface ExportButtonProps {
    templateType: TemplateType;
    carouselData?: CarouselData;
    setCarouselData?: (data: CarouselData) => void;
    videoData?: VideoData;
}

export default function ExportButton({ templateType, carouselData, setCarouselData, videoData }: ExportButtonProps) {
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
                // Single export for quote and video templates
                if (templateType === "video") {
                    // For video, use video export instead of PNG
                    await exportVideoWithOverlays();
                    setTimeout(() => setIsExporting(false), 800);
                    return;
                }

                // Wait for all images and videos to be fully loaded
                const images = canvasElement.querySelectorAll('img');
                const videos = canvasElement.querySelectorAll('video');

                await Promise.all([
                    ...Array.from(images).map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise<void>((resolve) => {
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                            setTimeout(() => resolve(), 5000);
                        });
                    }),
                    ...Array.from(videos).map(video => {
                        if (video.readyState >= 2) return Promise.resolve();
                        return new Promise<void>((resolve) => {
                            video.onloadeddata = () => resolve();
                            video.onerror = () => resolve();
                            setTimeout(() => resolve(), 5000);
                        });
                    })
                ]);

                // Extra wait for rendering
                await new Promise(resolve => setTimeout(resolve, 1000));

                const dataUrl = await toPng(canvasElement, {
                    quality: 1.0,
                    pixelRatio: 2.5,
                    cacheBust: true,
                    backgroundColor: "#040d1f",
                    skipFonts: false,
                    includeQueryParams: true,
                    filter: (node) => {
                        // Ensure we capture everything including images and videos
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

    // Export video with overlays burned in
    const exportVideoWithOverlays = async () => {
        if (!videoData?.video) {
            alert("Please upload a video first");
            return;
        }

        const canvasElement = document.getElementById("template-canvas");
        if (!canvasElement) {
            throw new Error("Canvas element not found");
        }

        try {
            // Create a hidden video element to get the source video
            const sourceVideo = document.createElement('video');
            sourceVideo.src = videoData.video;
            sourceVideo.muted = true;
            sourceVideo.style.display = 'none';
            document.body.appendChild(sourceVideo);

            // Wait for video to load
            await new Promise<void>((resolve, reject) => {
                sourceVideo.onloadedmetadata = () => resolve();
                sourceVideo.onerror = () => reject(new Error("Failed to load video"));
            });

            const duration = sourceVideo.duration;
            const videoWidth = 1080;
            const videoHeight = 1920;

            // Create canvas for recording
            const recordCanvas = document.createElement('canvas');
            recordCanvas.width = videoWidth;
            recordCanvas.height = videoHeight;
            const ctx = recordCanvas.getContext('2d', { willReadFrequently: true });

            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }

            // Setup MediaRecorder
            const stream = recordCanvas.captureStream(30); // 30 FPS
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 10000000, // 10 Mbps for high quality
            });

            const chunks: Blob[] = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            // When recording is done, download the video
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });

                // Option to re-encode to MP4 using FFmpeg
                // For now, export as WebM (universally supported)
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 10);
                link.download = `branded-video-${timestamp}.webm`;
                link.href = url;
                link.click();

                // Cleanup
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    document.body.removeChild(sourceVideo);
                }, 1000);
            };

            // Helper function to parse and render caption with highlighting
            const renderCaptionOnCanvas = (ctx: CanvasRenderingContext2D, caption: string, x: number, y: number, fontSize: number, maxWidth: number) => {
                ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                const parts = caption.split(/(\*[^*]+\*)/g);
                let currentX = x;
                let currentY = y;
                const lineHeight = fontSize * 1.3;

                parts.forEach((part) => {
                    if (!part) return;

                    const isHighlighted = part.startsWith('*') && part.endsWith('*');
                    const text = isHighlighted ? part.slice(1, -1) : part;

                    // Set color
                    ctx.fillStyle = isHighlighted ? '#3b5998' : '#ffffff';
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetY = 2;

                    // Simple word wrapping
                    const words = text.split(' ');
                    words.forEach((word, index) => {
                        const wordWidth = ctx.measureText(word + ' ').width;

                        if (currentX + wordWidth > x + maxWidth && currentX > x) {
                            currentX = x;
                            currentY += lineHeight;
                        }

                        ctx.fillText(word + (index < words.length - 1 ? ' ' : ''), currentX, currentY);
                        currentX += wordWidth;
                    });
                });
            };

            // Start recording
            mediaRecorder.start();

            // Play the video and capture frames
            sourceVideo.play();

            const captureFrame = () => {
                if (sourceVideo.paused || sourceVideo.ended) {
                    mediaRecorder.stop();
                    return;
                }

                // Calculate dimensions for video section (80% of height)
                const videoSectionHeight = videoHeight * 0.8;
                const videoSectionY = videoHeight * 0.2;

                // Calculate video dimensions based on aspect ratio
                let drawWidth = videoWidth;
                let drawHeight = videoSectionHeight;

                if (videoData.videoAspectRatio === "9:16") {
                    drawWidth = videoSectionHeight * (9 / 16);
                } else if (videoData.videoAspectRatio === "4:5") {
                    drawWidth = videoSectionHeight * (4 / 5);
                } else if (videoData.videoAspectRatio === "1:1") {
                    drawWidth = videoSectionHeight;
                }

                const drawX = (videoWidth - drawWidth) / 2;

                // Clear canvas
                ctx.fillStyle = '#040d1f';
                ctx.fillRect(0, 0, videoWidth, videoHeight);

                // Draw caption section background (top 20%)
                ctx.fillStyle = 'rgba(4, 13, 31, 0.95)';
                ctx.fillRect(0, 0, videoWidth, videoHeight * 0.2);

                // Draw video section background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, videoSectionY, videoWidth, videoSectionHeight);

                // Draw source video with positioning and scale
                const scale = videoData.videoScale;
                const scaledWidth = drawWidth * scale;
                const scaledHeight = drawHeight * scale;

                const offsetX = (drawWidth - scaledWidth) * (videoData.videoPosition.x / 100);
                const offsetY = (drawHeight - scaledHeight) * (videoData.videoPosition.y / 100);

                ctx.save();
                ctx.beginPath();
                ctx.rect(drawX, videoSectionY, drawWidth, drawHeight);
                ctx.clip();
                ctx.drawImage(
                    sourceVideo,
                    drawX + offsetX,
                    videoSectionY + offsetY,
                    scaledWidth,
                    scaledHeight
                );
                ctx.restore();

                // Draw caption text
                renderCaptionOnCanvas(ctx, videoData.caption, 50, 50, videoData.captionFontSize, videoWidth - 100);

                // Draw website watermark
                ctx.font = 'bold 32px monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 2;

                // Background for watermark
                const watermarkText = 'www.1010web.studio';
                const watermarkWidth = ctx.measureText(watermarkText).width;
                const watermarkX = videoWidth / 2;
                const watermarkY = videoHeight - 60;

                ctx.fillStyle = 'rgba(4, 13, 31, 0.6)';
                ctx.beginPath();
                ctx.roundRect(watermarkX - watermarkWidth / 2 - 20, watermarkY - 15, watermarkWidth + 40, 45, 25);
                ctx.fill();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(watermarkText, watermarkX, watermarkY + 5);

                requestAnimationFrame(captureFrame);
            };

            // Start capturing
            requestAnimationFrame(captureFrame);

        } catch (error) {
            console.error("Video export failed:", error);
            alert("Failed to export video. Please try again.");
            throw error;
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
                        {templateType === "video" ? "Processing Video..." : "Exporting..."}
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        {templateType === "video" ? "Export Video (MP4)" : "Export as PNG"}
                    </>
                )}
            </span>
        </button>
    );
}
