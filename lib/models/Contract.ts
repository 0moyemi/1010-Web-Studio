export interface Contract {
    _id?: string;
    token: string;
    clientName: string;
    status: 'pending' | 'info_submitted' | 'payment_pending' | 'paid' | 'expired';

    // Package details
    package: 'limited' | 'minimum' | 'testing';
    packageName: string;
    packagePrice: number;

    // Client information (Step 2)
    businessName?: string;
    ownerName?: string;
    whatsappNumber?: string;
    email?: string;

    // Business setup (Step 3)
    logoUrl?: string;
    brandColor?: string;
    description?: string;
    provideLater?: boolean;

    // Payment
    paymentMethod?: 'paystack' | 'manual' | 'testing';
    paymentReceiptUrl?: string;
    paymentStatus?: 'pending' | 'confirmed';
    amountPaid?: number;

    // Timestamps
    createdAt: Date;
    expiresAt: Date;
    submittedAt?: Date;
    paidAt?: Date;

    // Agreement acceptance
    agreedToTerms?: boolean;
    agreedAt?: Date;
}

export const PACKAGES = {
    'testing': {
        name: 'Testing Package (₦0)',
        price: 0,
        deposit: 0
    },
    'limited': {
        name: 'Limited Package',
        price: 290000,
        deposit: 145000
    },
    'minimum': {
        name: 'Minimum Package',
        price: 390000,
        deposit: 195000
    }
} as const;

export function generateToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 12; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}
