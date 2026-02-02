"use client";

import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { GlassCard } from "@/app/components/GlassCard";
import { Check, Download } from "lucide-react";

export default function ContractSuccess() {
    const params = useParams();
    const token = params.token as string;

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
                            Contract Submitted Successfully! 🎉
                        </h1>

                        <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
                            Thank you for choosing 1010 Web Studio
                        </p>

                        <div className="rounded-lg border p-6 text-left" style={{ borderColor: 'var(--glass-border)', background: 'rgba(79, 70, 229, 0.1)' }}>
                            <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--highlight)' }}>
                                What happens next?
                            </h2>
                            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <li>✓ You will receive a welcome email with your contract details</li>
                                <li>✓ Our team will verify your payment (if manual transfer)</li>
                                <li>✓ We will contact you within 12 hours to confirm project details</li>
                                <li>✓ Project work begins after payment confirmation</li>
                                <li>✓ We'll keep you updated every step of the way via WhatsApp</li>
                            </ul>
                        </div>

                        <div className="mt-6 rounded-lg border p-4" style={{ borderColor: 'var(--glass-border)', background: 'rgba(34, 197, 94, 0.05)' }}>
                            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                                Download your contract
                            </p>
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 backdrop-blur-xl border flex items-center justify-center gap-2"
                                style={{
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <Download size={18} />
                                Download Contract PDF
                            </button>
                        </div>

                        <div className="mt-8 rounded-lg border p-4" style={{ borderColor: 'var(--glass-border)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Need immediate assistance?
                            </p>
                            <a
                                href="https://wa.me/2349040991849"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 backdrop-blur-xl border"
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
