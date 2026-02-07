"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { GlassCard } from "@/app/components/GlassCard";
import { Check, Loader2, Upload, AlertCircle } from "lucide-react";
import { loadFlutterwaveScript, initializeFlutterwavePayment } from "@/lib/flutterwave";

export default function ContractPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [contract, setContract] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Step 1: Agreement
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Step 2: Client Info
    const [businessName, setBusinessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [email, setEmail] = useState("");

    // Step 3: Business Setup
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [brandColor, setBrandColor] = useState("#4F46E5");
    const [description, setDescription] = useState("");
    const [provideLater, setProvideLater] = useState(false);

    // Step 4: Payment
    const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false);

    useEffect(() => {
        fetchContract();
        // Load Flutterwave script
        loadFlutterwaveScript()
            .then(() => setFlutterwaveLoaded(true))
            .catch((error) => console.error('Failed to load Flutterwave:', error));
    }, [token]);

    const fetchContract = async () => {
        try {
            const response = await fetch(`/api/contract/${token}`);
            const data = await response.json();

            if (!data.success) {
                setError(data.expired ? 'This contract link has expired' : data.error);
                return;
            }

            setContract(data.contract);
        } catch (err) {
            setError('Failed to load contract');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        return data.secure_url;
    };

    const handleNext = async () => {
        setSubmitting(true);
        try {
            let stepData: any = { token, step: '' };

            if (currentStep === 1) {
                if (!agreedToTerms) {
                    alert('Please accept the terms to continue');
                    setSubmitting(false);
                    return;
                }
                stepData.step = 'agreement';
                stepData.agreedToTerms = true;
            }

            if (currentStep === 2) {
                if (!businessName || !ownerName || !whatsappNumber) {
                    alert('Please fill in all required fields');
                    setSubmitting(false);
                    return;
                }
                stepData.step = 'client-info';
                stepData.businessName = businessName;
                stepData.ownerName = ownerName;
                stepData.whatsappNumber = whatsappNumber;
                stepData.email = email;
            }

            if (currentStep === 3) {
                stepData.step = 'business-setup';

                if (logoFile && !provideLater) {
                    const logoUrl = await uploadToCloudinary(logoFile);
                    stepData.logoUrl = logoUrl;
                }

                stepData.brandColor = brandColor;
                stepData.description = description;
                stepData.provideLater = provideLater;
            }

            if (currentStep === 4) {
                // Skip payment for testing package (free)
                if (contract.packagePrice === 0) {
                    stepData.step = 'payment';
                    stepData.paymentMethod = 'testing';
                    stepData.paymentStatus = 'confirmed';
                    stepData.status = 'paid';

                    const response = await fetch('/api/contract/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(stepData),
                    });

                    const data = await response.json();

                    if (data.success) {
                        const emailParam = email ? `?email=${encodeURIComponent(email)}` : '';
                        router.push(`/contract/${token}/success${emailParam}`);
                    } else {
                        alert(data.error || 'Something went wrong');
                    }
                    setSubmitting(false);
                    return;
                }

                // Handle Flutterwave payment
                setSubmitting(false);
                handleFlutterwavePayment();
                return;
            }

            const response = await fetch('/api/contract/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stepData),
            });

            const data = await response.json();

            if (data.success) {
                if (currentStep < 4) {
                    setCurrentStep(currentStep + 1);
                } else {
                    // Contract complete - redirect with email parameter
                    const emailParam = email ? `?email=${encodeURIComponent(email)}` : '';
                    router.push(`/contract/${token}/success${emailParam}`);
                }
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (err) {
            alert('Error submitting data');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFlutterwavePayment = () => {
        if (!flutterwaveLoaded) {
            alert('Payment system is loading. Please try again in a moment.');
            return;
        }

        if (!contract) {
            alert('Contract data not loaded');
            return;
        }

        const amount = contract.packagePrice / 2; // 50% deposit

        initializeFlutterwavePayment({
            amount: amount,
            customerEmail: email || 'customer@example.com',
            customerName: ownerName || businessName || 'Customer',
            customerPhone: whatsappNumber || '',
            contractToken: token,
            packageName: contract.package || 'Package',
            businessName: businessName || '',
            onSuccess: async (response) => {
                console.log('Payment successful:', response);
                setSubmitting(true);

                // Redirect to verification endpoint
                window.location.href = `/api/payment/verify?transaction_id=${response.transaction_id}&tx_ref=${response.tx_ref}&token=${token}&status=successful`;
            },
            onCancel: () => {
                console.log('Payment cancelled');
                alert('Payment was cancelled. You can try again when ready.');
            },
            onError: (error) => {
                console.error('Payment error:', error);
                alert('Payment failed. Please try again or use manual bank transfer.');
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--highlight)' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <GlassCard className="max-w-md p-8 text-center">
                    <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--highlight)' }} />
                    <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {error}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Please contact us for assistance
                    </p>
                </GlassCard>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen relative z-10" style={{ background: 'transparent' }}>
                <Header />
                <div className="px-6 py-20 lg:py-28">
                    {/* Progress Indicator */}
                    <div className="mb-8 mx-auto max-w-xl flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex flex-1 items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${step < currentStep
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : step === currentStep
                                            ? 'border-[var(--highlight)] text-[var(--highlight)]'
                                            : 'border-gray-400 text-gray-400'
                                        }`}
                                >
                                    {step < currentStep ? <Check size={20} /> : step}
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`mx-2 h-1 flex-1 rounded ${step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mx-auto max-w-3xl">
                        <GlassCard className="p-8">
                            {/* STEP 1: Agreement */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        Agreement Summary
                                    </h2>
                                    <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Package: <strong>{contract.packageName}</strong> - ₦{contract.packagePrice.toLocaleString()}
                                    </p>

                                    <div className="max-h-96 space-y-6 overflow-y-auto rounded-lg border p-6" style={{ borderColor: 'var(--glass-border)' }}>
                                        {/* What You Will Get */}
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--highlight)' }}>
                                                What You Will Get
                                            </h3>
                                            <div className="space-y-4 text-base" style={{ color: 'var(--text-secondary)' }}>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>1. Business Website</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Product listing page</li>
                                                        <li>Product description pages</li>
                                                        <li>Cart and checkout</li>
                                                        <li>About page</li>
                                                        <li>Admin dashboard to manage products</li>
                                                        <li>Mobile-friendly and optimized</li>
                                                        <li>Basic SEO optimization</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>2. Custom Business Tracking System</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Track orders and sales</li>
                                                        <li>Monitor posting consistency</li>
                                                        <li>Manage customer follow-ups</li>
                                                        <li>Store messaging templates</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>3. Support & Revisions</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>2 weeks post-launch support</li>
                                                        <li>Bug fixes and minor adjustments</li>
                                                        <li>Up to 3 revisions included</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>4. Domain & Hosting</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>1 year custom domain (e.g. yourbusiness.com)</li>
                                                        <li>Hosting setup and deployment</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>5. Security</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Secure admin login</li>
                                                        <li>Input validation</li>
                                                        <li>Basic security measures</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* What You Will NOT Get */}
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--highlight)' }}>
                                                What You Will NOT Get
                                            </h3>
                                            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>1. Ongoing Costs</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Domain renewal after first year → ₦35,000/year</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>2. Unlimited Changes</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Extra revisions → ₦5,000 each</li>
                                                        <li>Support after 2 weeks → ₦10,000 - ₦50,000</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>3. Payment Setup</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Payment gateway setup not included</li>
                                                        <li>Setup fee: ₦10,000</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>4. Sales Guarantees</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>We do not guarantee sales or revenue</li>
                                                        <li>Results depend on your products, pricing, and marketing</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong style={{ color: 'var(--text-primary)' }}>5. Content & Branding Creation</strong>
                                                    <ul className="ml-4 mt-1 list-disc space-y-1">
                                                        <li>Product photos not included</li>
                                                        <li>Product descriptions not included</li>
                                                        <li>Logos or brand identity not included</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Terms */}
                                        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--highlight)', background: 'rgba(79, 70, 229, 0.1)' }}>
                                            <h3 className="mb-2 text-base font-semibold" style={{ color: 'var(--highlight)' }}>
                                                ⚠️ Important Payment Terms
                                            </h3>
                                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                • Project begins after 50% deposit is paid
                                                <br />• Remaining 50% due after completion and deployment
                                                <br />• Any requests outside this scope will be discussed and priced separately
                                            </p>
                                        </div>
                                    </div>

                                    <label className="mt-6 flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="mt-1 h-5 w-5 cursor-pointer"
                                        />
                                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                            I have read and agree to the terms above. I understand what is included and what is not included in this package.
                                        </span>
                                    </label>

                                    <button
                                        onClick={handleNext}
                                        disabled={!agreedToTerms || submitting}
                                        className="mt-6 w-full rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 backdrop-blur-xl border disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'var(--glass-bg)',
                                            borderColor: 'var(--glass-border)',
                                            color: 'var(--text-primary)',
                                            boxShadow: '0 4px 24px var(--glass-shadow)',
                                        }}
                                    >
                                        {submitting ? 'Processing...' : 'Continue'}
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: Client Info */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        Your Information
                                    </h2>
                                    <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        We need these details to get started with your project
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Business Name <span style={{ color: 'var(--highlight)' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                placeholder="e.g., Grace Fashion Store"
                                                className="w-full rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                style={{
                                                    background: 'var(--glass-bg)',
                                                    borderColor: 'var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                This will appear on your website
                                            </p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Your Name (Owner) <span style={{ color: 'var(--highlight)' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={ownerName}
                                                onChange={(e) => setOwnerName(e.target.value)}
                                                placeholder="e.g., Grace Adeyemi"
                                                className="w-full rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                style={{
                                                    background: 'var(--glass-bg)',
                                                    borderColor: 'var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                WhatsApp Number <span style={{ color: 'var(--highlight)' }}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={whatsappNumber}
                                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                                placeholder="e.g., 08012345678"
                                                className="w-full rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                style={{
                                                    background: 'var(--glass-bg)',
                                                    borderColor: 'var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                We'll use this to send project updates
                                            </p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Email Address (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="e.g., grace@example.com"
                                                className="w-full rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                style={{
                                                    background: 'var(--glass-bg)',
                                                    borderColor: 'var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                We'll send your receipt and contract PDF here
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="flex-1 rounded-full px-6 py-2.5 text-sm font-medium border backdrop-blur-xl"
                                            style={{
                                                borderColor: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={submitting}
                                            className="flex-1 rounded-full px-6 py-2.5 text-sm font-medium backdrop-blur-xl border disabled:opacity-50"
                                            style={{
                                                background: 'var(--glass-bg)',
                                                borderColor: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                boxShadow: '0 4px 24px var(--glass-shadow)',
                                            }}
                                        >
                                            {submitting ? 'Saving...' : 'Continue'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Business Setup */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        Business Setup (Optional)
                                    </h2>
                                    <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Help us personalize your website. You can skip this and send details later on WhatsApp.
                                    </p>

                                    <div className="space-y-6">
                                        {/* Logo Upload */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Business Logo
                                            </label>
                                            <div
                                                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer hover:border-[var(--highlight)] transition-colors"
                                                style={{ borderColor: 'var(--glass-border)' }}
                                                onClick={() => document.getElementById('logo-upload')?.click()}
                                            >
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo preview" className="h-24 w-24 object-contain" />
                                                ) : (
                                                    <>
                                                        <Upload size={32} style={{ color: 'var(--text-secondary)' }} />
                                                        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                            Click to upload logo
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Brand Color */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Brand Color
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={brandColor}
                                                    onChange={(e) => setBrandColor(e.target.value)}
                                                    className="h-12 w-20 cursor-pointer rounded border"
                                                    style={{ borderColor: 'var(--glass-border)' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={brandColor}
                                                    onChange={(e) => setBrandColor(e.target.value)}
                                                    className="flex-1 rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                    style={{
                                                        background: 'var(--glass-bg)',
                                                        borderColor: 'var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                Main color for your website
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                Short Description
                                            </label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="e.g., Quality fashion items at affordable prices"
                                                rows={3}
                                                className="w-full rounded-lg border px-4 py-3 backdrop-blur-xl"
                                                style={{
                                                    background: 'var(--glass-bg)',
                                                    borderColor: 'var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            />
                                            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                A brief tagline for your business
                                            </p>
                                        </div>

                                        {/* Provide Later */}
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={provideLater}
                                                onChange={(e) => setProvideLater(e.target.checked)}
                                                className="h-5 w-5 cursor-pointer"
                                            />
                                            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                                I'll send these details later on WhatsApp
                                            </span>
                                        </label>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="flex-1 rounded-full px-6 py-2.5 text-sm font-medium border backdrop-blur-xl"
                                            style={{
                                                borderColor: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={submitting}
                                            className="flex-1 rounded-full px-6 py-2.5 text-sm font-medium backdrop-blur-xl border disabled:opacity-50"
                                            style={{
                                                background: 'var(--glass-bg)',
                                                borderColor: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                boxShadow: '0 4px 24px var(--glass-shadow)',
                                            }}
                                        >
                                            {submitting ? 'Uploading...' : 'Continue to Payment'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Payment */}
                            {currentStep === 4 && (
                                <div>
                                    {contract.packagePrice === 0 ? (
                                        // Free Testing Package
                                        <div>
                                            <div className="text-center mb-6">
                                                <h2 className="mb-2 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    Testing Package
                                                </h2>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    No payment required
                                                </p>
                                            </div>

                                            {/* Free Badge */}
                                            <div className="mb-6 rounded-2xl border p-6 text-center" style={{ borderColor: '#22c55e', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))' }}>
                                                <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                                                    <Check size={32} style={{ color: '#22c55e' }} />
                                                </div>
                                                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                                    This is a free testing package
                                                </p>
                                                <p className="text-4xl font-bold mb-1" style={{ color: '#22c55e' }}>
                                                    ₦0
                                                </p>
                                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                    No payment required • Instant activation
                                                </p>
                                            </div>

                                            <div className="mt-8 flex gap-3">
                                                <button
                                                    onClick={() => setCurrentStep(3)}
                                                    className="flex-1 rounded-full px-8 py-3.5 text-base font-medium border backdrop-blur-xl transition-all hover:scale-[1.02]"
                                                    style={{
                                                        borderColor: 'var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    disabled={submitting}
                                                    className="flex-1 rounded-full px-8 py-3.5 text-base font-medium backdrop-blur-xl border disabled:opacity-50 transition-all hover:scale-[1.02] hover:shadow-xl"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #22c55e, rgba(34, 197, 94, 0.8))',
                                                        borderColor: '#22c55e',
                                                        color: '#fff',
                                                        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                                                    }}
                                                >
                                                    {submitting ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Loader2 size={20} className="animate-spin" />
                                                            Completing...
                                                        </span>
                                                    ) : (
                                                        'Complete (Free)'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Paid Package - Show Payment
                                        <div>
                                            <div className="text-center mb-6">
                                                <h2 className="mb-2 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    Secure Payment
                                                </h2>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    Your payment is secured by Flutterwave
                                                </p>
                                            </div>

                                            {/* Amount Card */}
                                            <div className="mb-6 rounded-2xl border p-6 text-center" style={{ borderColor: 'var(--highlight)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0.05))' }}>
                                                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                                    50% Deposit Required
                                                </p>
                                                <p className="text-4xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>
                                                    ₦{(contract.packagePrice / 2).toLocaleString()}
                                                </p>
                                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                    Total Package: ₦{contract.packagePrice.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Payment Info Card */}
                                                <div className="flex items-start gap-4 p-6 rounded-xl border" style={{ borderColor: 'var(--highlight)', background: 'rgba(79, 70, 229, 0.08)' }}>
                                                    <div className="rounded-full p-3" style={{ background: 'rgba(79, 70, 229, 0.2)' }}>
                                                        <svg className="h-6 w-6" style={{ color: 'var(--highlight)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                                            Secure Payment with Flutterwave
                                                        </h3>
                                                        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                                                            Pay securely with your card, bank transfer, USSD, or bank account. All transactions are protected with 256-bit SSL encryption.
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(79, 70, 229, 0.15)', color: 'var(--highlight)' }}>💳 Card</span>
                                                            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(79, 70, 229, 0.15)', color: 'var(--highlight)' }}>🏦 Bank Transfer</span>
                                                            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(79, 70, 229, 0.15)', color: 'var(--highlight)' }}>📱 USSD</span>
                                                            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(79, 70, 229, 0.15)', color: 'var(--highlight)' }}>💰 Account</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Security Badge */}
                                                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--glass-border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                                                    <div className="flex items-start gap-3">
                                                        <svg className="h-5 w-5 mt-0.5" style={{ color: '#22c55e' }} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                                                Your payment is protected
                                                            </p>
                                                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                                                Flutterwave is PCI-DSS compliant and uses bank-level security. Your card details are encrypted and never stored on our servers.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-3">
                                                <button
                                                    onClick={() => setCurrentStep(3)}
                                                    className="flex-1 rounded-full px-8 py-3.5 text-base font-medium border backdrop-blur-xl transition-all hover:scale-[1.02]"
                                                    style={{
                                                        borderColor: 'var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    disabled={submitting || !flutterwaveLoaded}
                                                    className="flex-1 rounded-full px-8 py-3.5 text-base font-medium backdrop-blur-xl border disabled:opacity-50 transition-all hover:scale-[1.02] hover:shadow-xl"
                                                    style={{
                                                        background: 'linear-gradient(135deg, var(--highlight), rgba(79, 70, 229, 0.8))',
                                                        borderColor: 'var(--glass-border)',
                                                        color: '#fff',
                                                        boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
                                                    }}
                                                >
                                                    {submitting ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Loader2 size={20} className="animate-spin" />
                                                            Opening Payment...
                                                        </span>
                                                    ) : !flutterwaveLoaded ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Loader2 size={20} className="animate-spin" />
                                                            Loading...
                                                        </span>
                                                    ) : (
                                                        'Proceed to Payment'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
