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
    const [exportProgress, setExportProgress] = useState("");

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
                const zipUrl = URL.createObjectURL(zipBlob);
                const link = document.createElement("a");
                link.href = zipUrl;
                link.download = `carousel-slides-${timestamp}.zip`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Clean up after a delay
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(zipUrl);
                }, 100);

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
                    try {
                        await exportVideoWithOverlays();
                    } catch (videoError) {
                        console.error("Video export error:", videoError);
                        setIsExporting(false);
                        alert(`Video export failed: ${videoError instanceof Error ? videoError.message : 'Unknown error'}`);
                        return;
                    }
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

                // Convert to blob for better mobile compatibility
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `${templateType}-post-${timestamp}.png`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                }, 100);
            }

            // Success feedback
            setTimeout(() => setIsExporting(false), 800);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export image. Please try again.");
            setIsExporting(false);
        }
    };

    // Canva-style approach: Cloudinary does heavy lifting, client adds caption
    const exportVideoWithOverlays = async () => {
        if (!videoData?.video) {
            setIsExporting(false);
            alert("Please upload a video first");
            return;
        }

        try {
            // Step 1: Upload to Cloudinary for processing (adds watermark, preserves audio)
            setExportProgress("Preparing video...");

            const response = await fetch(videoData.video);
            const blob = await response.blob();
            const videoFile = new File([blob], "video.mp4", { type: blob.type });

            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('videoAspectRatio', videoData.videoAspectRatio);

            // Use XMLHttpRequest for upload progress tracking
            const processedVideoUrl = await new Promise<string>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Track upload progress
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setExportProgress(`Uploading to Cloudinary... ${percentComplete}%`);
                    }
                };

                xhr.upload.onloadend = () => {
                    setExportProgress("Processing video on server (30-60 seconds)...");
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            resolve(result.url);
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        try {
                            const errorData = JSON.parse(xhr.responseText);
                            reject(new Error(errorData.details || 'Failed to process video'));
                        } catch (e) {
                            reject(new Error(`Server error: ${xhr.status}`));
                        }
                    }
                };

                xhr.onerror = () => reject(new Error('Network error during upload'));

                xhr.open('POST', '/api/video/process');
                xhr.send(formData);
            });

            console.log('Processed video URL:', processedVideoUrl);

            // Step 2: Load the processed video from Cloudinary with progress
            setExportProgress("Downloading processed video... 0%");

            const processedVideo = document.createElement('video');
            processedVideo.crossOrigin = "anonymous";
            processedVideo.muted = true; // Mute playback (but audio tracks still captured)
            processedVideo.style.display = 'none';
            document.body.appendChild(processedVideo);

            // Download video with progress tracking
            const videoBlob = await new Promise<Blob>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', processedVideoUrl, true);
                xhr.responseType = 'blob';

                xhr.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setExportProgress(`Downloading processed video... ${percentComplete}%`);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`Failed to download video: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Network error during download'));
                xhr.send();
            });

            const videoUrl = URL.createObjectURL(videoBlob);
            processedVideo.src = videoUrl;

            await new Promise<void>((resolve, reject) => {
                processedVideo.onloadedmetadata = () => resolve();
                processedVideo.onerror = () => reject(new Error("Failed to load processed video"));
                setTimeout(() => reject(new Error("Video load timeout")), 20000);
            });

            const duration = processedVideo.duration;
            console.log('Video loaded, duration:', duration);

            // Check if video has audio (captureStream might not be in TypeScript types)
            const videoCaptureStream = (processedVideo as any).captureStream ?
                (processedVideo as any).captureStream() :
                (processedVideo as any).mozCaptureStream?.();

            if (videoCaptureStream) {
                const testAudioTracks = videoCaptureStream.getAudioTracks();
                console.log('Video has audio tracks:', testAudioTracks.length > 0);
                if (testAudioTracks.length === 0) {
                    console.error('WARNING: Processed video has no audio tracks! Check Cloudinary transformation.');
                }
                videoCaptureStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }

            // Calculate canvas dimensions based on selected aspect ratio
            let canvasWidth: number;
            const canvasHeight = 1920;

            switch (videoData.videoAspectRatio) {
                case "9:16": canvasWidth = 1080; break;
                case "4:5": canvasWidth = 1536; break;
                case "1:1": canvasWidth = 1920; break;
                default: canvasWidth = 1080;
            }

            const captionHeight = canvasHeight * 0.2;
            const videoSectionHeight = canvasHeight * 0.8;
            const captionFontSize = videoData.captionFontSize * (canvasWidth / 432);
            const captionPadding = canvasWidth * 0.055;
            const captionBottomPadding = canvasWidth * 0.037;

            console.log('Canvas dimensions:', canvasWidth, 'x', canvasHeight);
            console.log('Original video dimensions:', processedVideo.videoWidth, 'x', processedVideo.videoHeight);

            // Step 3: Create canvas with selected aspect ratio
            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d', { alpha: false })!;

            // Pre-render caption overlay with text highlighting
            const captionCanvas = document.createElement('canvas');
            captionCanvas.width = canvasWidth;
            captionCanvas.height = captionHeight;
            const cCtx = captionCanvas.getContext('2d')!;

            // Caption background gradient
            const gradient = cCtx.createLinearGradient(0, 0, 0, captionHeight);
            gradient.addColorStop(0, 'rgba(4, 13, 31, 0.95)');
            gradient.addColorStop(1, 'rgba(4, 13, 31, 0.85)');
            cCtx.fillStyle = gradient;
            cCtx.fillRect(0, 0, canvasWidth, captionHeight);

            // Parse caption text with highlighting (*text* = highlighted)
            cCtx.font = `bold ${captionFontSize}px Arial, sans-serif`;
            cCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            cCtx.shadowBlur = 8;
            cCtx.shadowOffsetY = 2;
            cCtx.textBaseline = 'bottom';

            const parts = videoData.caption.split(/(\*[^*]+\*)/g);
            const words: { text: string, isHighlight: boolean }[] = [];

            parts.forEach(part => {
                if (!part) return;
                const isHighlight = part.startsWith('*') && part.endsWith('*');
                const text = isHighlight ? part.slice(1, -1) : part;
                text.split(' ').forEach(word => {
                    if (word.trim()) words.push({ text: word, isHighlight });
                });
            });

            // Word wrap with color support
            let line: { text: string, isHighlight: boolean }[] = [];
            const lineHeight = captionFontSize * 1.3;
            const lines: { text: string, isHighlight: boolean }[][] = [];

            words.forEach(wordObj => {
                const testLine = [...line, wordObj];
                const testText = testLine.map(w => w.text).join(' ');
                const metrics = cCtx.measureText(testText);

                if (metrics.width > canvasWidth - (captionPadding * 2) && line.length > 0) {
                    lines.push(line);
                    line = [wordObj];
                } else {
                    line = testLine;
                }
            });
            if (line.length > 0) lines.push(line);

            // Draw lines from bottom up with highlighting (original approach)
            let y = captionHeight - captionBottomPadding;
            lines.reverse().forEach((lineWords, lineIndex) => {
                let x = captionPadding;
                const lineY = y - (lineIndex * lineHeight);

                lineWords.forEach((wordObj, wordIndex) => {
                    // Apply color: blue for highlighted, white for normal
                    cCtx.fillStyle = wordObj.isHighlight ? '#3b5998' : '#ffffff';
                    const wordText = wordObj.text + (wordIndex < lineWords.length - 1 ? ' ' : '');
                    cCtx.fillText(wordText, x, lineY);
                    x += cCtx.measureText(wordText).width;
                });
            });

            // Step 4: Record canvas with caption overlay + audio from processed video
            const canvasStream = canvas.captureStream(30);

            // Capture audio from the processed video (with browser compatibility)
            const videoStream = (processedVideo as any).captureStream ?
                (processedVideo as any).captureStream() :
                (processedVideo as any).mozCaptureStream();
            const audioTracks = videoStream.getAudioTracks();

            // Create combined stream: video from canvas + audio from processed video
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...audioTracks
            ]);

            console.log('Audio tracks captured:', audioTracks.length);
            if (audioTracks.length > 0) {
                console.log('Audio track settings:', audioTracks[0].getSettings());
            } else {
                console.warn('No audio tracks found in processed video!');
            }

            // Try vp9 with opus audio, fallback if not supported
            let mimeType = 'video/webm;codecs=vp9,opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.warn('vp9,opus not supported, trying vp8,opus');
                mimeType = 'video/webm;codecs=vp8,opus';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    console.warn('vp8,opus not supported, using default webm');
                    mimeType = 'video/webm';
                }
            }

            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: mimeType,
                videoBitsPerSecond: 8000000, // 8 Mbps for good quality
            });

            const chunks: Blob[] = [];
            mediaRecorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

            mediaRecorder.onstop = () => {
                setExportProgress("Finalizing video... (this may take a moment)");

                // Use setTimeout to prevent UI freeze during blob creation
                setTimeout(() => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const timestamp = new Date().toISOString().slice(0, 10);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `branded-video-${timestamp}.webm`;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();

                    setTimeout(() => {
                        document.body.removeChild(link);
                        document.body.removeChild(processedVideo);
                        URL.revokeObjectURL(url);
                        URL.revokeObjectURL(videoUrl); // Clean up processed video URL
                        setIsExporting(false);
                        setExportProgress("");
                    }, 100);
                }, 50);
            };

            // Start recording with timeslice to collect data in chunks (every 1 second)
            setExportProgress("Adding caption overlay... 0%");

            // Start video playback FIRST to ensure audio stream is active
            await processedVideo.play();

            // Small delay to ensure audio is flowing
            await new Promise(resolve => setTimeout(resolve, 100));

            // Now start recording (audio is already streaming from playing video)
            mediaRecorder.start(1000); // Collect data every 1 second instead of all at once

            // Calculate object-contain dimensions for video within video section
            const videoAspectRatio = processedVideo.videoWidth / processedVideo.videoHeight;
            const videoSectionAspectRatio = canvasWidth / videoSectionHeight;

            let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

            if (videoAspectRatio > videoSectionAspectRatio) {
                // Video is wider - fit to width
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / videoAspectRatio;
                drawX = 0;
                drawY = captionHeight; // Start right after caption, no gap
            } else {
                // Video is taller - fit to height
                drawHeight = videoSectionHeight;
                drawWidth = videoSectionHeight * videoAspectRatio;
                drawX = (canvasWidth - drawWidth) / 2;
                drawY = captionHeight; // Start right after caption, no gap
            }

            console.log('Video will be drawn at:', drawX, drawY, drawWidth, drawHeight);

            let lastUpdate = 0;
            let frameCount = 0;
            const maxFrames = Math.ceil(duration * 60) + 600; // 60 FPS + 10 second buffer (requestAnimationFrame runs at 60fps)

            const draw = () => {
                // Safety check: stop if we've drawn too many frames (time-based backup)
                if (frameCount > maxFrames) {
                    console.warn('Maximum frames reached, stopping recording');
                    mediaRecorder.stop();
                    return;
                }

                if (processedVideo.paused || processedVideo.ended) {
                    mediaRecorder.stop();
                    return;
                }

                frameCount++;
                const now = processedVideo.currentTime;
                if (now - lastUpdate >= 1) {
                    const pct = Math.min(99, Math.round((now / duration) * 100)); // Cap at 99%
                    setExportProgress(`Adding caption... ${pct}% (${Math.ceil(duration - now)}s left)`);
                    lastUpdate = now;
                }

                // Fill canvas with black background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // Draw video with object-contain in video section (below caption)
                ctx.drawImage(processedVideo, drawX, drawY, drawWidth, drawHeight);

                // Draw caption overlay on top
                ctx.drawImage(captionCanvas, 0, 0);

                // Draw watermark overlay on the video (top right of actual video)
                const watermarkText = 'www.1010web.studio';
                const watermarkFontSize = Math.max(11, Math.round(11 * (canvasWidth / 432)));
                const watermarkPadding = Math.round(12 * (canvasWidth / 432));

                ctx.font = `600 ${watermarkFontSize}px Arial, sans-serif`;
                const textMetrics = ctx.measureText(watermarkText);
                const watermarkX = drawX + drawWidth - textMetrics.width - (watermarkPadding * 2);
                const watermarkY = drawY + watermarkPadding;

                // Draw simple watermark text with shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.textBaseline = 'top';
                ctx.fillText(watermarkText, watermarkX, watermarkY);

                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                requestAnimationFrame(draw);
            };

            draw();

        } catch (error) {
            console.error("Export failed:", error);
            setIsExporting(false);
            setExportProgress("");
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
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
                        {templateType === "video" ? "Export Video" : "Export as PNG"}
                    </>
                )}
            </span>
        </button>
    );
}
