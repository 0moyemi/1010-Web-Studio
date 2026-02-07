/**
 * Flutterwave Integration Utilities
 * Handles payment initialization with Flutterwave Inline
 */

export interface FlutterwavePaymentParams {
    amount: number;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    contractToken: string;
    packageName: string;
    businessName?: string;
    onSuccess: (response: any) => void;
    onCancel: () => void;
    onError: (error: any) => void;
}

/**
 * Initialize Flutterwave payment with custom styling
 */
export function initializeFlutterwavePayment({
    amount,
    customerEmail,
    customerName,
    customerPhone,
    contractToken,
    packageName,
    businessName,
    onSuccess,
    onCancel,
    onError,
}: FlutterwavePaymentParams) {
    // Check if Flutterwave script is loaded
    if (typeof window === 'undefined' || !(window as any).FlutterwaveCheckout) {
        onError(new Error('Flutterwave script not loaded'));
        return;
    }

    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    if (!publicKey) {
        onError(new Error('Flutterwave public key not configured'));
        return;
    }

    const txRef = `${contractToken}-${Date.now()}`;

    const paymentConfig = {
        public_key: publicKey,
        tx_ref: txRef,
        amount: amount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd,account',
        customer: {
            email: customerEmail,
            name: customerName,
            phone_number: customerPhone || '',
        },
        customizations: {
            title: '1010 Web Studio',
            description: `${packageName} - 50% Deposit`,
            logo: `${baseUrl}/logo.png`, // Update with your logo path
        },
        meta: {
            contract_token: contractToken,
            package: packageName,
            business_name: businessName || '',
        },
        callback: function (data: any) {
            if (data.status === 'successful') {
                onSuccess(data);
            } else if (data.status === 'cancelled') {
                onCancel();
            } else {
                onError(data);
            }
        },
        onclose: function () {
            // Called when modal is closed
            console.log('Payment modal closed');
        },
    };

    try {
        (window as any).FlutterwaveCheckout(paymentConfig);
    } catch (error) {
        onError(error);
    }
}

/**
 * Load Flutterwave inline script dynamically
 */
export function loadFlutterwaveScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load Flutterwave script'));
        };

        document.head.appendChild(script);
    });
}

/**
 * Verify payment status
 */
export async function verifyPayment(transactionId: string, contractToken: string) {
    try {
        const response = await fetch(`/api/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transaction_id: transactionId,
                token: contractToken,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
}
