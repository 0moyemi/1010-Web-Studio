"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { QuoteData } from "../page";

interface ImageUploaderProps {
    quoteData: QuoteData;
    setQuoteData: (data: QuoteData) => void;
}

export default function ImageUploader({
    quoteData,
    setQuoteData,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (file && file.type.startsWith("image/")) {
            try {
                // Create an image bitmap with proper orientation handling
                const imageBitmap = await createImageBitmap(file, {
                    imageOrientation: 'from-image'
                });

                // Draw to canvas to get properly oriented base64 
                const canvas = document.createElement('canvas');
                canvas.width = imageBitmap.width;
                canvas.height = imageBitmap.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(imageBitmap, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                    setQuoteData({
                        ...quoteData,
                        image: dataUrl,
                        imagePosition: { x: 50, y: 50 },
                        imageScale: 1,
                    });
                }

                imageBitmap.close();
            } catch (error) {
                console.error('Error processing image:', error);
                // Fallback to FileReader if createImageBitmap fails
                const reader = new FileReader();
                reader.onload = (e) => {
                    setQuoteData({
                        ...quoteData,
                        image: e.target?.result as string,
                        imagePosition: { x: 50, y: 50 },
                        imageScale: 1,
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await handleFileSelect(file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeImage = () => {
        setQuoteData({
            ...quoteData,
            image: null,
            imagePosition: { x: 50, y: 50 },
            imageScale: 1,
        });
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-[var(--text-primary)]">
                Background Image
            </label>

            {!quoteData.image ? (
                // Upload Area
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300
            ${isDragging
                            ? "border-[var(--highlight)] bg-[var(--glass-bg)]"
                            : "border-[var(--border-color)] hover:border-[var(--glass-border)]"
                        }
          `}
                >
                    <Upload className="mx-auto mb-3 text-[var(--text-muted)]" size={32} />
                    <p className="text-sm text-[var(--text-secondary)] mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">PNG, JPG up to 10MB</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />
                </div>
            ) : (
                // Image Preview + Controls
                <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative rounded-lg overflow-hidden border border-[var(--border-color)]">
                        <img
                            src={quoteData.image}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>

                    {/* Position Controls */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                                Horizontal Position
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={quoteData.imagePosition.x}
                                onChange={(e) =>
                                    setQuoteData({
                                        ...quoteData,
                                        imagePosition: {
                                            ...quoteData.imagePosition,
                                            x: parseInt(e.target.value),
                                        },
                                    })
                                }
                                className="w-full accent-[var(--highlight)]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                                Vertical Position
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={quoteData.imagePosition.y}
                                onChange={(e) =>
                                    setQuoteData({
                                        ...quoteData,
                                        imagePosition: {
                                            ...quoteData.imagePosition,
                                            y: parseInt(e.target.value),
                                        },
                                    })
                                }
                                className="w-full accent-[var(--highlight)]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                                Zoom ({quoteData.imageScale.toFixed(1)}x)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.1"
                                value={quoteData.imageScale}
                                onChange={(e) =>
                                    setQuoteData({
                                        ...quoteData,
                                        imageScale: parseFloat(e.target.value),
                                    })
                                }
                                className="w-full accent-[var(--highlight)]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
