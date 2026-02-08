"use client";

import { CarouselData } from "../page";
import { ChevronRight } from "lucide-react";

interface CarouselTemplateProps {
    data: CarouselData;
}

export default function CarouselTemplate({ data }: CarouselTemplateProps) {
    const totalSlides = 5; // Hook + 3 Tips + CTA
    const currentSlide = data.currentSlide;

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Gradient Background - Same as homepage */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg, #040d1f 0%, #05132d 50%, #040d1f 100%)",
                }}
            />

            {/* Background Pattern - Same as homepage */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url("/patterns/whatsapp-bg.svg")',
                    backgroundSize: "420px 420px",
                    backgroundRepeat: "repeat",
                    opacity: 25,
                }}
            />

            {/* Radial Gradients - Same as homepage */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(59, 89, 152, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(59, 89, 152, 0.1) 0%, transparent 50%)
                    `,
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col p-12 pb-16">
                {/* Slide Content */}
                {currentSlide === 0 && <HookSlide hook={data.hook} fontSize={data.hookFontSize} />}
                {currentSlide === 1 && <TipSlide tip={data.tips[0]} number={1} titleFontSize={data.tipTitleFontSize} descriptionFontSize={data.tipDescriptionFontSize} />}
                {currentSlide === 2 && <TipSlide tip={data.tips[1]} number={2} titleFontSize={data.tipTitleFontSize} descriptionFontSize={data.tipDescriptionFontSize} />}
                {currentSlide === 3 && <TipSlide tip={data.tips[2]} number={3} titleFontSize={data.tipTitleFontSize} descriptionFontSize={data.tipDescriptionFontSize} />}
                {currentSlide === 4 && <CTASlide cta={data.cta} fontSize={data.ctaFontSize} />}

                {/* Logo - Top Left (hide on last slide) */}
                {currentSlide !== 4 && (
                    <div className="absolute top-6 left-6">
                        <img
                            src="/1010 Primary Logo.svg"
                            alt="1010 Web Studio"
                            className="w-8 h-8 object-contain opacity-70"
                        />
                    </div>
                )}

                {/* Slide Counter - Top Right */}
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {currentSlide + 1}/{totalSlides}
                    </span>
                </div>

                {/* Domain - Bottom Center */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono opacity-90">
                        www.1010web.studio
                    </span>
                </div>

                {/* Swipe Instruction - Bottom Right (only on slides 2-4, not on first or last) */}
                {currentSlide > 0 && currentSlide < 4 && (
                    <div className="absolute bottom-4 right-6 flex items-center gap-1.5 opacity-60">
                        <span className="text-[9px] text-[var(--text-secondary)] font-semibold">Swipe</span>
                        <ChevronRight size={12} className="text-[var(--text-secondary)]" />
                    </div>
                )}
            </div>
        </div>
    );
}

// Hook Slide (Slide 1)
function HookSlide({ hook, fontSize }: { hook: string; fontSize: number }) {
    return (
        <div className="flex-1 flex flex-col justify-between items-center text-center">
            {/* Spacer for top padding */}
            <div className="flex-1" />

            {/* Hook content - occupies roughly 1/3 */}
            <div className="flex-shrink-0">
                <h2
                    className="font-bold text-white leading-tight mb-6"
                    style={{
                        fontSize: `${fontSize}px`,
                        whiteSpace: 'pre-line',
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        letterSpacing: '-0.02em'
                    }}
                >
                    {hook}
                </h2>

                {/* Swipe Indicator */}
                <div className="flex items-center gap-2 text-[var(--text-secondary)] animate-pulse justify-center">
                    <span className="text-sm font-semibold">Swipe to continue</span>
                    <ChevronRight size={20} />
                </div>
            </div>

            {/* Spacer for bottom padding - much larger to push content to top 1/3 */}
            <div className="flex-[3]" />
        </div>
    );
}

// Tip Slide (Slides 2-4)
function TipSlide({
    tip,
    number,
    titleFontSize,
    descriptionFontSize,
}: {
    tip: { title: string; description: string };
    number: number;
    titleFontSize: number;
    descriptionFontSize: number;
}) {
    return (
        <div className="flex-1 flex flex-col justify-center gap-6">
            {/* Number Badge */}
            <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl self-start"
                style={{
                    background:
                        "linear-gradient(135deg, var(--highlight) 0%, rgba(59, 89, 152, 0.7) 100%)",
                }}
            >
                <span className="text-3xl font-bold text-white" style={{ textShadow: "none" }}>{number}</span>
            </div>

            {/* Description */}
            <div>
                <p
                    className="text-[var(--text-primary)] font-semibold leading-relaxed max-w-lg"
                    style={{
                        fontSize: `${descriptionFontSize}px`,
                        whiteSpace: 'pre-line',
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
                    }}
                >
                    {tip.description}
                </p>
            </div>
        </div>
    );
}

// CTA Slide (Slide 5)
function CTASlide({ cta, fontSize }: { cta: string; fontSize: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
            {/* Logo - Same as footer */}
            <img
                src="/Secondary Logo.svg"
                alt="1010 Web Studio"
                className="w-24 h-auto object-contain"
            />

            {/* CTA Text */}
            <p
                className="font-bold text-[var(--text-primary)]"
                style={{
                    fontSize: `${fontSize}px`,
                    whiteSpace: 'pre-line',
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
                }}
            >
                {cta}
            </p>
        </div>
    );
}
