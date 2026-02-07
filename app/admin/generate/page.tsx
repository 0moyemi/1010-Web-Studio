"use client";

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { GlassCard } from "@/app/components/GlassCard";
import { Copy, Check, Loader2 } from "lucide-react";

const PACKAGES = [
    { value: 'testing', label: 'Testing Package (FREE)', price: '₦0' },
    { value: 'limited', label: 'Limited Package', price: '₦290,000' },
    { value: 'minimum', label: 'Minimum Package', price: '₦390,000' },
];

export default function GenerateContract() {
    const [clientName, setClientName] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("testing");
    const [expiryDays, setExpiryDays] = useState(7);
    const [generatedLink, setGeneratedLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!clientName.trim()) {
            alert("Please enter a client name");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/contract/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: clientName.trim(),
                    package: selectedPackage,
                    expiryDays
                })
            });

            const data = await response.json();

            if (data.success) {
                const link = `${window.location.origin}/contract/${data.token}`;
                setGeneratedLink(link);
            } else {
                alert(data.error || 'Failed to generate contract');
            }
        } catch (error) {
            alert('Error generating contract');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedPkg = PACKAGES.find(p => p.value === selectedPackage);

    return (
        <>
            <div className="min-h-screen relative z-10" style={{ background: 'transparent' }}>
                <Header />
                <main className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
                    <h1
                        className="mb-3 text-3xl font-bold sm:text-4xl text-shadow-sm"
                        style={{
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Generate Contract Link
                    </h1>
                    <p
                        className="mb-8 text-lg text-shadow-sm"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Create a unique contract link for your client
                    </p>

                    <GlassCard className="p-8">
                        <div className="space-y-6">
                            {/* Client Name */}
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Client Name <span style={{ color: 'var(--highlight)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className="w-full rounded-lg border px-4 py-3 text-base backdrop-blur-xl transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    For your tracking only, not shown to client
                                </p>
                            </div>

                            {/* Package Selection */}
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Package <span style={{ color: 'var(--highlight)' }}>*</span>
                                </label>
                                <select
                                    value={selectedPackage}
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                    className="w-full rounded-lg border px-4 py-3 text-base backdrop-blur-xl transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {PACKAGES.map((pkg) => (
                                        <option key={pkg.value} value={pkg.value}>
                                            {pkg.label} - {pkg.price}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                                    50% Deposit: {selectedPkg && `₦${(parseInt(selectedPkg.price.replace(/[₦,]/g, '')) / 2).toLocaleString()}`}
                                </p>
                            </div>

                            {/* Expiry Days */}
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Link Expires In (Days) <span style={{ color: 'var(--highlight)' }}>*</span>
                                </label>
                                <select
                                    value={expiryDays}
                                    onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                                    className="w-full rounded-lg border px-4 py-3 text-base backdrop-blur-xl transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                        <option key={day} value={day}>
                                            {day} {day === 1 ? 'day' : 'days'}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    Link will expire after this period.
                                </p>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-xl border btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                    boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={20} className="animate-spin" />
                                        Generating...
                                    </span>
                                ) : (
                                    'Generate Contract Link'
                                )}
                            </button>
                        </div>
                    </GlassCard>

                    {/* Generated Link */}
                    {generatedLink && (
                        <GlassCard className="mt-6 p-6">
                            <h3
                                className="mb-3 text-lg font-semibold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Contract Link Generated! ✓
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={generatedLink}
                                    readOnly
                                    className="flex-1 rounded-lg border px-4 py-2 text-sm backdrop-blur-xl"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="rounded-lg border px-4 py-2 backdrop-blur-xl transition-all hover:scale-105"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                Send this link to {clientName} via WhatsApp or Email
                            </p>
                        </GlassCard>
                    )}
                </main>
            </div>
            <Footer />
        </>
    )
}