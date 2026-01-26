"use client";

import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="absolute inset-0 backdrop-blur-md"
                style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px) saturate(0.8)'
                }}
                aria-hidden="true"
            />
            <div
                className="relative w-full max-w-2xl rounded-2xl border backdrop-blur-xl glass-noise"
                style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'var(--glass-border)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 transition-all hover:bg-white/10 hover:scale-110 active:scale-95"
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
                {children}
            </div>
        </div>
    );
}
