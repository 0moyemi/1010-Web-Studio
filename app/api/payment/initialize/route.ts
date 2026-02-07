import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, email, name, phone } = body;

        if (!token || !email || !name) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get contract details
        const client = await clientPromise;
        const db = client.db('1010_Client_Generator');
        const contract = await db.collection('contracts').findOne({ token });

        if (!contract) {
            return NextResponse.json(
                { success: false, error: 'Contract not found' },
                { status: 404 }
            );
        }

        // Check if expired
        if (new Date() > new Date(contract.expiresAt)) {
            return NextResponse.json(
                { success: false, error: 'Contract expired' },
                { status: 410 }
            );
        }

        const amount = contract.packagePrice / 2; // 50% deposit

        // Initialize Flutterwave payment
        const payload = {
            tx_ref: `${token}-${Date.now()}`, // Unique transaction reference
            amount: amount,
            currency: 'NGN',
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify?token=${token}`,
            customer: {
                email: email,
                name: name,
                phonenumber: phone || '',
            },
            customizations: {
                title: '1010 Web Studio',
                description: `${contract.package} Package - 50% Deposit`,
                logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`, // Update with your logo URL
            },
            payment_options: 'card,banktransfer,ussd,account',
            meta: {
                contract_token: token,
                package: contract.package,
                business_name: contract.businessName || '',
            },
        };

        const response = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Store transaction reference in contract
            await db.collection('contracts').updateOne(
                { token },
                {
                    $set: {
                        transactionRef: payload.tx_ref,
                        paymentInitiatedAt: new Date(),
                    }
                }
            );

            return NextResponse.json({
                success: true,
                data: data.data,
                link: data.data.link,
            });
        } else {
            return NextResponse.json(
                { success: false, error: data.message || 'Payment initialization failed' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error initializing payment:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
