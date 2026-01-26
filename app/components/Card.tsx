"use client";

import { useEffect, useRef, useState } from "react";

interface CardProps {
    title: string;
    description: string;
    number?: string;
    className?: string;
    enableScrollScale?: boolean;
}

export function Card({ title, description, number, className = "", enableScrollScale = false }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!enableScrollScale || !cardRef.current) return;

        const handleScroll = () => {
            if (!cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const containerCenter = window.innerWidth / 2;
            const cardCenter = rect.left + rect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            const maxDistance = window.innerWidth / 2;

            // Scale from 0.85 to 1.1 based on distance from center
            const newScale = Math.max(0.85, Math.min(1.1, 1.1 - (distance / maxDistance) * 0.25));
            setScale(newScale);
        };

        const scrollContainer = cardRef.current.parentElement;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial call
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [enableScrollScale]);

    return (
        <div
            ref={cardRef}
            className={`flex-shrink-0 rounded-2xl border backdrop-blur-xl p-6 transition-all hover:scale-105 glass-noise ${className}`}
            style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                boxShadow: '0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transform: enableScrollScale ? `scale(${scale})` : undefined,
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 40px var(--glass-glow)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
        >
            {number && (
                <div
                    className="mb-3 text-sm font-medium"
                    style={{ color: 'var(--highlight)' }}
                >
                    {number}
                </div>
            )}
            <div
                className="flex h-12 w-12 items-center justify-center rounded-lg mb-4"
                style={{
                    background: 'linear-gradient(135deg, var(--card-background-light) 0%, var(--highlight) 100%)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
            >
                {/* Icon placeholder */}
                <div
                    className="h-6 w-6 rounded"
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                    }}
                />
            </div>
            <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
            >
                {title}
            </h3>
            <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
            >
                {description}
            </p>
        </div>
    );
}
