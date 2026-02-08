"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { GlassCard } from "@/app/components/GlassCard";
import { Check, Download, Mail, AlertCircle } from "lucide-react";

export default function ContractSuccess() {
    const params = useParams();
    const searchParams = useSearchParams();
    const token = params.token as string;
    const clientEmail = searchParams.get('email') || 'your email';

    const handleDownloadPDF = () => {
        window.open(`/api/contract/${token}/pdf`, '_blank');
    };

    return (
        <>
            <div className="min-h-screen relative z-10" style={{ background: 'transparent' }}>
                <Header />
                <div className="flex items-center justify-center px-6 py-20 lg:py-28">
                    <GlassCard className="max-w-2xl p-12 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                            <Check size={48} style={{ color: '#22c55e' }} />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Payment Submitted Successfully! 🎉
                        </h1>

                        <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
                            Thank you for choosing 1010 Web Studio
                        </p>

                        {/* Email Check Section */}
                        <div className="mb-8 rounded-xl border p-4 sm:p-6 text-left overflow-hidden" style={{ borderColor: 'var(--highlight)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0.05))' }}>
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0 rounded-full p-2" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                    <Mail size={20} className="sm:w-6 sm:h-6" style={{ color: 'var(--highlight)' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="mb-2 text-base sm:text-lg font-semibold" style={{ color: 'var(--highlight)' }}>
                                        Check Your Email
                                    </h2>
                                    <p className="mb-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                        We've sent a welcome message with your contract to:
                                    </p>
                                    <div className="mb-4 rounded-lg px-3 py-2 sm:px-4 sm:py-3 font-medium text-center break-all overflow-wrap-anywhere text-xs sm:text-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--highlight)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                        {clientEmail}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                                            <p className="text-xs flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>
                                                <strong>Don't see it?</strong> Check your <strong>Spam</strong> or <strong>Promotions</strong> folder
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <svg className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>
                                                It may take up to <strong>5 minutes</strong> to arrive
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Section */}
                        <div className="mb-8 rounded-xl border p-6" style={{ borderColor: 'var(--glass-border)', background: 'rgba(34, 197, 94, 0.05)' }}>
                            <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                                Or download your contract right now
                            </p>
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full rounded-full px-6 py-3 text-base font-medium transition-all hover:scale-105 backdrop-blur-xl border flex items-center justify-center gap-2 hover:shadow-xl"
                                style={{
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <Download size={20} />
                                Download Contract PDF
                            </button>
                        </div>

                        {/* What Happens Next */}
                        <div className="rounded-xl border p-6 text-left" style={{ borderColor: 'var(--glass-border)' }}>
                            <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                What Happens Next?
                            </h2>
                            <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                        <span className="text-xs font-bold" style={{ color: 'var(--highlight)' }}>1</span>
                                    </div>
                                    <span>We'll verify your payment (usually within <strong>12 hours</strong>)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                        <span className="text-xs font-bold" style={{ color: 'var(--highlight)' }}>2</span>
                                    </div>
                                    <span>Our team will contact you on <strong>WhatsApp</strong> to confirm project details</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                        <span className="text-xs font-bold" style={{ color: 'var(--highlight)' }}>3</span>
                                    </div>
                                    <span>Project work begins immediately after confirmation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                        <span className="text-xs font-bold" style={{ color: 'var(--highlight)' }}>4</span>
                                    </div>
                                    <span>You'll receive regular updates throughout the development process</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                                Need immediate assistance?
                            </p>
                            <a
                                href="https://wa.me/2349040991849"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded-full px-6 py-3 text-sm font-medium transition-all hover:scale-105 backdrop-blur-xl border hover:shadow-xl"
                                style={{
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                Message Us on WhatsApp
                            </a>
                        </div>
                    </GlassCard>
                </div>
            </div>
            <Footer />
        </>
    )
}
