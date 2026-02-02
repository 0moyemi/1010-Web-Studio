import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

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
                { success: false, error: 'Contract expired', expired: true },
                { status: 410 }
            );
        }

        return NextResponse.json({
            success: true,
            contract: {
                token: contract.token,
                packageName: contract.packageName,
                packagePrice: contract.packagePrice,
                package: contract.package,
                status: contract.status,
                expiresAt: contract.expiresAt,
                // Don't send sensitive info
            },
        });

    } catch (error) {
        console.error('Error fetching contract:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
