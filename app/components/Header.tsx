"use client";

export function Header() {
    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <header
            className="sticky top-0 z-50 border-b backdrop-blur-xl"
            style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                boxShadow: '0 4px 16px var(--glass-shadow)'
            }}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <div
                    className="text-xl font-bold"
                    style={{
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.1em',
                    }}
                >
                    1010 Web Studio
                </div>
                <button
                    onClick={scrollToContact}
                    className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:scale-105 border backdrop-blur-xl btn-press"
                    style={{
                        background: 'var(--glass-bg)',
                        borderColor: 'var(--glass-border)',
                        color: 'var(--text-primary)',
                        boxShadow: '0 2px 12px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                >
                    Contact Us
                </button>
            </div>
        </header>
    );
}
