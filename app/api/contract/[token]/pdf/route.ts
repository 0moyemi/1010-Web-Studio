import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jsPDF from 'jspdf';

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

        // Create PDF
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = 20;

        // Helper function to add text with word wrap
        const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
            pdf.setFontSize(size);
            pdf.setFont('helvetica', style);
            pdf.setTextColor(...color);
            const lines = pdf.splitTextToSize(text, contentWidth);
            pdf.text(lines, margin, yPosition);
            yPosition += (lines.length * size * 0.4) + 5;
        };

        // Header
        pdf.setFillColor(4, 13, 31);
        pdf.rect(0, 0, pageWidth, 40, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('1010 WEB STUDIO', margin, 25);
        pdf.setFontSize(10);
        pdf.text('Contract Agreement', margin, 32);

        yPosition = 55;

        // Contract Details
        addText('CONTRACT AGREEMENT', 18, 'bold', [59, 89, 152]);
        addText(`Contract ID: ${contract.token}`, 10, 'normal', [100, 100, 100]);
        addText(`Date: ${new Date(contract.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 10, 'normal', [100, 100, 100]);
        yPosition += 5;

        // Client Information
        addText('CLIENT INFORMATION', 14, 'bold', [59, 89, 152]);
        if (contract.businessName) addText(`Business Name: ${contract.businessName}`, 11);
        if (contract.ownerName) addText(`Owner Name: ${contract.ownerName}`, 11);
        if (contract.whatsappNumber) addText(`WhatsApp: ${contract.whatsappNumber}`, 11);
        if (contract.email) addText(`Email: ${contract.email}`, 11);
        yPosition += 5;

        // Package Details
        addText('PACKAGE DETAILS', 14, 'bold', [59, 89, 152]);
        addText(`Package: ${contract.packageName}`, 11, 'bold');
        addText(`Total Price: ₦${contract.packagePrice.toLocaleString()}`, 11);
        addText(`50% Deposit: ₦${(contract.packagePrice / 2).toLocaleString()}`, 11);
        yPosition += 5;

        // Payment Information
        if (contract.paymentAmount) {
            addText('PAYMENT INFORMATION', 14, 'bold', [59, 89, 152]);
            addText(`Amount Paid: ₦${contract.paymentAmount.toLocaleString()}`, 11);
            addText(`Payment Date: ${new Date(contract.paymentDate).toLocaleDateString('en-GB')}`, 11);
            addText(`Payment Method: ${contract.paymentMethod === 'manual' ? 'Bank Transfer' : 'Paystack'}`, 11);
            if (contract.receiptUrl) addText(`Receipt: ${contract.receiptUrl}`, 10, 'normal', [100, 100, 100]);
            yPosition += 5;
        }

        // New page for terms
        pdf.addPage();
        yPosition = 20;

        addText('WHAT YOU WILL GET', 14, 'bold', [59, 89, 152]);

        const deliverables = [
            '1. Business Website',
            '   • Product listing page',
            '   • Product description pages',
            '   • Cart and checkout system',
            '   • About page',
            '   • Admin dashboard to manage products',
            '   • Mobile-friendly and optimized',
            '   • Basic SEO optimization',
            '',
            '2. Custom Business Tracking System',
            '   • Track orders and sales',
            '   • Monitor posting consistency',
            '   • Manage customer follow-ups',
            '   • Store messaging templates',
            '',
            '3. Support & Revisions',
            '   • 2 weeks post-launch support',
            '   • Bug fixes and minor adjustments',
            '   • Up to 3 revisions included',
            '',
            '4. Domain & Hosting',
            '   • 1 year custom domain (e.g. yourbusiness.com)',
            '   • Hosting setup and deployment',
            '',
            '5. Security',
            '   • Secure admin login',
            '   • HTTPS/SSL certificate',
            '   • Regular security updates',
        ];

        deliverables.forEach(item => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }
            addText(item, 10);
        });

        yPosition += 5;
        addText('WHAT YOU WILL NOT GET', 14, 'bold', [59, 89, 152]);

        const exclusions = [
            '• Custom payment gateway integration (Paystack, Flutterwave, etc.)',
            '• Advanced e-commerce features (inventory management, multi-vendor, etc.)',
            '• Social media management or content creation',
            '• Paid advertising or marketing campaigns',
            '• Ongoing hosting/domain renewal after 1 year (you\'ll handle renewal)',
            '• Mobile app development',
            '• Email marketing automation',
        ];

        exclusions.forEach(item => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }
            addText(item, 10);
        });

        yPosition += 10;

        // Signature Section
        if (yPosition > 230) {
            pdf.addPage();
            yPosition = 20;
        }

        addText('AGREEMENT', 14, 'bold', [59, 89, 152]);
        addText('By signing this contract, the client acknowledges that they have read, understood, and agree to the terms and deliverables outlined above.', 10);

        yPosition += 10;
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, yPosition, margin + 70, yPosition);
        yPosition += 5;
        addText('Client Signature', 9, 'normal', [100, 100, 100]);
        addText(`Agreed on: ${new Date(contract.agreedAt || contract.createdAt).toLocaleDateString('en-GB')}`, 9, 'normal', [100, 100, 100]);

        yPosition += 5;
        pdf.line(pageWidth - margin - 70, yPosition - 20, pageWidth - margin, yPosition - 20);
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('1010 Web Studio', pageWidth - margin - 60, yPosition - 15);
        pdf.text('Service Provider', pageWidth - margin - 60, yPosition - 10);

        // Footer on all pages
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
            pdf.text('1010 Web Studio | contact@1010webstudio.com', pageWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
        }

        // Generate PDF as buffer
        const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

        // Return PDF
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Contract-${contract.businessName || contract.clientName}-${contract.token}.pdf"`,
            },
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
