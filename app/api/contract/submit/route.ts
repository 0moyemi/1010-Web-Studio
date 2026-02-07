import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            token,
            step,
            // Step 1: Agreement
            agreedToTerms,
            // Step 2: Client Info
            businessName,
            ownerName,
            whatsappNumber,
            email,
            // Step 3: Business Setup
            logoUrl,
            brandColor,
            description,
            provideLater,
            // Step 4: Payment
            paymentMethod,
            paymentReceiptUrl,
        } = body;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Token required' },
                { status: 400 }
            );
        }

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

        const updateData: any = {};

        if (step === 'agreement') {
            updateData.agreedToTerms = agreedToTerms;
            updateData.agreedAt = new Date();
        }

        if (step === 'client-info') {
            updateData.businessName = businessName;
            updateData.ownerName = ownerName;
            updateData.whatsappNumber = whatsappNumber;
            updateData.email = email;
            updateData.status = 'info_submitted';
        }

        if (step === 'business-setup') {
            updateData.logoUrl = logoUrl;
            updateData.brandColor = brandColor;
            updateData.description = description;
            updateData.provideLater = provideLater;
        }

        if (step === 'payment') {
            updateData.paymentMethod = paymentMethod;
            updateData.paymentReceiptUrl = paymentReceiptUrl;

            // Handle testing package (free)
            if (paymentMethod === 'testing') {
                updateData.paymentStatus = 'confirmed';
                updateData.status = 'paid';
                updateData.submittedAt = new Date();
                updateData.paidAt = new Date();
                updateData.amountPaid = 0;
            } else if (paymentMethod === 'manual') {
                updateData.paymentStatus = 'pending';
                updateData.status = 'payment_pending';
                updateData.submittedAt = new Date();
            } else {
                updateData.paymentStatus = paymentMethod === 'manual' ? 'pending' : 'confirmed';
                updateData.status = paymentMethod === 'manual' ? 'payment_pending' : 'paid';
                updateData.submittedAt = new Date();

                if (paymentMethod === 'paystack') {
                    updateData.paidAt = new Date();
                    updateData.amountPaid = contract.packagePrice / 2;
                }
            }

            // Send welcome email for all completed payments (including testing)
            if (contract.email && (paymentMethod === 'testing' || paymentMethod === 'paystack')) {
                await sendWelcomeEmail({
                    to: contract.email,
                    businessName: contract.businessName || 'Valued Client',
                    contractToken: token,
                });
            }
        }

        await db.collection('contracts').updateOne(
            { token },
            { $set: updateData }
        );

        return NextResponse.json({
            success: true,
            message: 'Contract updated successfully',
        });

    } catch (error) {
        console.error('Error submitting contract:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
