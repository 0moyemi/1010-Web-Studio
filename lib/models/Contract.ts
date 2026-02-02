export interface Contract {
    _id?: string;
    token: string;
    clientName: string;
    status: 'pending' | 'info_submitted' | 'payment_pending' | 'paid' | 'expired';

    // Package details
    package: 'pre-launch' | 'referred' | 'original';
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
    paymentMethod?: 'paystack' | 'manual';
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
    'pre-launch': {
        name: 'Pre-launch Package',
        price: 290000,
        deposit: 145000
    },
    'referred': {
        name: 'Referred Package',
        price: 450000,
        deposit: 225000
    },
    'original': {
        name: 'Original Package',
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
