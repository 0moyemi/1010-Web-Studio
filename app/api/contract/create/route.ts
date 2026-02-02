import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateToken, PACKAGES } from '@/lib/models/Contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { clientName, package: packageType, expiryDays } = body;

        if (!clientName || !packageType || !expiryDays) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const packageInfo = PACKAGES[packageType as keyof typeof PACKAGES];
        if (!packageInfo) {
            return NextResponse.json(
                { success: false, error: 'Invalid package' },
                { status: 400 }
            );
        }

        const token = generateToken();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

        const client = await clientPromise;
        const db = client.db('1010_Client_Generator');

        const contract = {
            token,
            clientName,
            status: 'pending',
            package: packageType,
            packageName: packageInfo.name,
            packagePrice: packageInfo.price,
            createdAt: now,
            expiresAt,
        };

        await db.collection('contracts').insertOne(contract);

        return NextResponse.json({
            success: true,
            token,
            expiresAt: expiresAt.toISOString(),
        });

    } catch (error) {
        console.error('Error creating contract:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
