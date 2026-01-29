"use client";

import Image from "next/image";

export function Footer() {
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
                        alt="1010 Web Studio"
                        width={100}
                        height={33}
                        priority
                    />
                </div>

                {/* Bottom Bar */}
                <div
                    className="text-center"
                    style={{ borderColor: 'var(--glass-border)' }}
                >
                    <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        © 2026 1010 Web Studio · B2B digital solutions for small businesses · All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}

