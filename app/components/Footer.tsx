"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Footer() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <footer
            className="border-t py-8 mt-24 backdrop-blur-xl"
            style={{
                borderColor: 'var(--glass-border)',
                background: 'var(--glass-bg)',
                boxShadow: 'inset 0 1px 0 var(--glass-glow)'
            }}
        >
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/Secondary Logo.svg"
                        alt="1010 Web Studio - Online sales systems for Nigerian small businesses"
                        width={100}
                        height={33}
                        priority
                    />
                </div>

                {/* Bottom Bar with Collapsible SEO Description */}
                <div className="text-center">
                    {/* Clickable Copyright with Arrow */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-1.5 text-xs transition-all hover:opacity-70 cursor-pointer mx-auto"
                        style={{ color: 'var(--text-muted)' }}
                        aria-label="Toggle company description"
                    >
                        <span>© 2026 1010 Web Studio · B2B digital solutions for small businesses · All rights reserved</span>
                        <ChevronDown
                            size={12}
                            style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                opacity: 0.5
                            }}
                        />
                    </button>

                    {/* Collapsible SEO Description */}
                    <div
                        style={{
                            maxHeight: isExpanded ? '200px' : '0',
                            opacity: isExpanded ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease, opacity 0.3s ease',
                        }}
                    >
                        <div className="max-w-2xl mx-auto mt-4 pt-4" style={{ borderTop: isExpanded ? '1px solid var(--glass-border)' : 'none' }}>
                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: 'var(--text-muted)', opacity: 0.7 }}
                            >
                                We build sales systems and product catalogs for small businesses in Nigeria.
                                Our websites help Nigerian entrepreneurs sell online without stress. Simple product displays,
                                WhatsApp integration, and clean sales systems that let customers browse and order easily.
                                Stop explaining products over WhatsApp. Start selling with one simple link.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

