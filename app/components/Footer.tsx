"use client";

import Image from "next/image";

export function Footer() {
    return (
        <footer
            className="border-t py-12 mt-20 backdrop-blur-xl"
            style={{
                borderColor: 'var(--glass-border)',
                background: 'var(--glass-bg)',
                boxShadow: 'inset 0 1px 0 var(--glass-glow)'
            }}
        >
            <div className="mx-auto max-w-7xl px-6 text-center">
                <div className="mb-4 flex justify-center">
                    <Image
                        src="/Secondary Logo.svg"
                        alt="1010 Web Studio"
                        width={120}
                        height={40}
                        priority
                    />
                </div>
                <p
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                >
                    © 2026 · Built with care by 1010 Web Studio
                </p>
            </div>
        </footer>
    );
}
