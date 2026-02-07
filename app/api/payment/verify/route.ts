import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const transactionId = searchParams.get('transaction_id');
        const txRef = searchParams.get('tx_ref');
        const token = searchParams.get('token');
        const status = searchParams.get('status');

        if (!transactionId || !token) {
            return NextResponse.redirect(
                new URL(`/contract/${token}/error?message=Invalid payment verification`, request.url)
            );
        }

        // If payment was cancelled
        if (status === 'cancelled') {
            return NextResponse.redirect(
                new URL(`/contract/${token}?payment=cancelled`, request.url)
            );
        }

        // Verify payment with Flutterwave
        const verifyResponse = await fetch(
            `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const verifyData = await verifyResponse.json();

        if (verifyData.status !== 'success') {
            return NextResponse.redirect(
                new URL(`/contract/${token}?payment=failed`, request.url)
            );
        }

        const paymentData = verifyData.data;

        // Verify payment details
        if (
            paymentData.status !== 'successful' ||
            paymentData.currency !== 'NGN'
        ) {
            return NextResponse.redirect(
                new URL(`/contract/${token}?payment=failed`, request.url)
            );
        }

        // Update contract with payment details
        const client = await clientPromise;
        const db = client.db('1010_Client_Generator');

        const contract = await db.collection('contracts').findOne({ token });

        if (!contract) {
            return NextResponse.redirect(
                new URL(`/contract/${token}/error?message=Contract not found`, request.url)
            );
        }

        // Update contract status
        await db.collection('contracts').updateOne(
            { token },
            {
                $set: {
                    paymentMethod: 'flutterwave',
                    paymentStatus: 'confirmed',
                    status: 'paid',
                    submittedAt: new Date(),
                    paidAt: new Date(),
                    amountPaid: paymentData.amount,
                    transactionId: transactionId,
                    transactionRef: txRef,
                    paymentDetails: {
                        flw_ref: paymentData.flw_ref,
                        processor_response: paymentData.processor_response,
                        card_type: paymentData.card?.type || null,
                        payment_type: paymentData.payment_type,
                    }
                }
            }
        );

        // Send welcome email
        if (contract.email) {
            await sendWelcomeEmail({
                to: contract.email,
                businessName: contract.businessName || 'Valued Client',
                contractToken: token,
            });
        }

        // Redirect to success page
        const emailParam = contract.email ? `?email=${encodeURIComponent(contract.email)}` : '';
        return NextResponse.redirect(
            new URL(`/contract/${token}/success${emailParam}`, request.url)
        );

    } catch (error) {
        console.error('Error verifying payment:', error);
        const token = request.nextUrl.searchParams.get('token') || 'error';
        return NextResponse.redirect(
            new URL(`/contract/${token}?payment=error`, request.url)
        );
    }
}
