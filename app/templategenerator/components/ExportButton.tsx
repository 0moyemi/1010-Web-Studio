"use client";

import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";
import { TemplateType, CarouselData, VideoData } from "../page";
import JSZip from "jszip";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface ExportButtonProps {
    templateType: TemplateType;
    carouselData?: CarouselData;
    setCarouselData?: (data: CarouselData) => void;
    videoData?: VideoData;
}

export default function ExportButton({ templateType, carouselData, setCarouselData, videoData }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState("");
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    // Load FFmpeg
    const loadFFmpeg = async () => {
        if (ffmpegLoaded && ffmpegRef.current) {
            return ffmpegRef.current;
        }

        setExportProgress("Loading video converter...");
        const ffmpeg = new FFmpeg();

        ffmpeg.on("log", ({ message }) => {
            console.log(message);
        });

        ffmpeg.on("progress", ({ progress }) => {
            const percentage = Math.round(progress * 100);
            setExportProgress(`Converting to MP4: ${percentage}%`);
        });

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });

        ffmpegRef.current = ffmpeg;
        setFfmpegLoaded(true);
        return ffmpeg;
    };

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
            // Check MediaRecorder support
            if (!window.MediaRecorder) {
                throw new Error("Video recording is not supported in your browser. Please try Chrome, Edge, or Firefox.");
            }

            // Check codec support - try multiple options
            let mimeType = '';
            const codecs = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm'
            ];

            for (const codec of codecs) {
                if (MediaRecorder.isTypeSupported(codec)) {
                    mimeType = codec;
                    break;
                }
            }

            if (!mimeType) {
                throw new Error("No supported video codec found. Please try a different browser.");
            }

            // Create a hidden video element to get the source video
            const sourceVideo = document.createElement('video');
            sourceVideo.src = videoData.video;
            sourceVideo.muted = true;
            sourceVideo.crossOrigin = "anonymous";
            sourceVideo.style.display = 'none';
            document.body.appendChild(sourceVideo);

            // Wait for video to load
            await new Promise<void>((resolve, reject) => {
                sourceVideo.onloadedmetadata = () => resolve();
                sourceVideo.onerror = (e) => reject(new Error("Failed to load video. Make sure the file is a valid video format."));
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error("Video loading timed out")), 10000);
            });

            const duration = sourceVideo.duration;

            // Calculate canvas dimensions based on video aspect ratio
            // Height is always 1920px (the "16" part), width adapts
            const videoHeight = 1920;
            let videoWidth: number;

            switch (videoData.videoAspectRatio) {
                case "9:16":
                    videoWidth = 1080;  // 9/16 * 1920
                    break;
                case "4:5":
                    videoWidth = 1536;  // 4/5 * 1920
                    break;
                case "1:1":
                    videoWidth = 1920;  // 1/1 * 1920
                    break;
                default:
                    videoWidth = 1080;
            }

            // Create canvas for recording
            const recordCanvas = document.createElement('canvas');
            recordCanvas.width = videoWidth;
            recordCanvas.height = videoHeight;
            const ctx = recordCanvas.getContext('2d', { willReadFrequently: true });

            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }

            // Setup MediaRecorder with detected codec
            const stream = recordCanvas.captureStream(60); // 60 FPS for high quality
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 20000000, // 20 Mbps for high quality
            });

            const chunks: Blob[] = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            // When recording is done, convert to MP4 and download
            mediaRecorder.onstop = async () => {
                try {
                    const webmBlob = new Blob(chunks, { type: mimeType });

                    setExportProgress("Recording complete. Converting to MP4...");

                    // Load FFmpeg
                    const ffmpeg = await loadFFmpeg();

                    // Write WebM to FFmpeg virtual file system
                    await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

                    // Convert WebM to MP4
                    setExportProgress("Converting to MP4...");
                    await ffmpeg.exec([
                        "-i", "input.webm",
                        "-c:v", "libx264",
                        "-preset", "fast",
                        "-crf", "22",
                        "-c:a", "aac",
                        "-b:a", "192k",
                        "-movflags", "+faststart",
                        "output.mp4"
                    ]);

                    // Read the MP4 file
                    const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
                    const mp4Blob = new Blob([new Uint8Array(data)], { type: "video/mp4" });

                    // Download MP4
                    const url = URL.createObjectURL(mp4Blob);
                    const link = document.createElement('a');
                    const timestamp = new Date().toISOString().slice(0, 10);
                    link.download = `branded-video-${timestamp}.mp4`;
                    link.href = url;
                    link.click();

                    // Cleanup
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                        document.body.removeChild(sourceVideo);
                    }, 1000);

                    // Clean up FFmpeg files
                    try {
                        await ffmpeg.deleteFile("input.webm");
                        await ffmpeg.deleteFile("output.mp4");
                    } catch (e) {
                        console.log("FFmpeg cleanup:", e);
                    }

                    setExportProgress("");
                } catch (error) {
                    console.error("Conversion error:", error);
                    setExportProgress("");
                    throw new Error("Failed to convert video to MP4. Please try again.");
                }
            };

            // Error handling
            mediaRecorder.onerror = (e) => {
                console.error("MediaRecorder error:", e);
                setExportProgress("");
                throw new Error("Video recording failed. Please try again.");
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
            setExportProgress("Recording video...");
            mediaRecorder.start();

            // Play the video and capture frames
            sourceVideo.play();

            const captureFrame = () => {
                if (sourceVideo.paused || sourceVideo.ended) {
                    mediaRecorder.stop();
                    return;
                }

                // Calculate section heights
                const captionHeight = videoHeight * 0.2;
                const videoSectionHeight = videoHeight * 0.8;
                const videoSectionY = captionHeight;

                // Clear canvas with dark background
                ctx.fillStyle = '#040d1f';
                ctx.fillRect(0, 0, videoWidth, videoHeight);

                // Draw caption section background (top 20%)
                const gradient = ctx.createLinearGradient(0, 0, 0, captionHeight);
                gradient.addColorStop(0, 'rgba(4, 13, 31, 0.95)');
                gradient.addColorStop(1, 'rgba(4, 13, 31, 0.85)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, videoWidth, captionHeight);

                // Draw video section background (black)
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, videoSectionY, videoWidth, videoSectionHeight);

                // Draw source video (fills entire video section)
                const scale = videoData.videoScale;
                const scaledWidth = videoWidth * scale;
                const scaledHeight = videoSectionHeight * scale;

                const offsetX = (videoWidth - scaledWidth) * (videoData.videoPosition.x / 100);
                const offsetY = (videoSectionHeight - scaledHeight) * (videoData.videoPosition.y / 100);

                ctx.save();
                ctx.beginPath();
                ctx.rect(0, videoSectionY, videoWidth, videoSectionHeight);
                ctx.clip();
                ctx.drawImage(
                    sourceVideo,
                    offsetX,
                    videoSectionY + offsetY,
                    scaledWidth,
                    scaledHeight
                );
                ctx.restore();

                // Draw caption text - Bottom aligned in caption section
                const captionFontSize = videoData.captionFontSize * (videoWidth / 432); // Scale font size
                const captionPadding = videoWidth * 0.055; // 5.5% padding
                const captionBottomPadding = videoWidth * 0.037; // Bottom padding to match preview

                // Calculate caption Y position (bottom of caption section minus padding)
                const captionY = captionHeight - captionBottomPadding - (captionFontSize * 1.3); // Approximate line height

                renderCaptionOnCanvas(
                    ctx,
                    videoData.caption,
                    captionPadding,
                    captionY,
                    captionFontSize,
                    videoWidth - (captionPadding * 2)
                );

                // Draw website watermark - Top Right of Video Section
                const watermarkFontSize = 32 * (videoWidth / 1080); // Scale watermark
                ctx.font = `bold ${watermarkFontSize}px monospace`;
                const watermarkText = 'www.1010web.studio';
                const watermarkMetrics = ctx.measureText(watermarkText);
                const watermarkWidth = watermarkMetrics.width;
                const watermarkPadding = 30 * (videoWidth / 1080);
                const watermarkX = videoWidth - watermarkPadding - watermarkWidth / 2;
                const watermarkY = videoSectionY + watermarkPadding;

                // Background for watermark
                ctx.fillStyle = 'rgba(4, 13, 31, 0.6)';
                ctx.beginPath();
                ctx.roundRect(
                    watermarkX - watermarkWidth / 2 - 20,
                    watermarkY - 15,
                    watermarkWidth + 40,
                    45,
                    25
                );
                ctx.fill();

                // Watermark text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 2;
                ctx.fillText(watermarkText, watermarkX, watermarkY + 5);

                requestAnimationFrame(captureFrame);
            };

            // Start capturing
            requestAnimationFrame(captureFrame);

        } catch (error) {
            console.error("Video export failed:", error);
            setExportProgress("");
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
                        {exportProgress || (templateType === "video" ? "Processing Video..." : "Exporting...")}
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
