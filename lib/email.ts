/**
 * Email utility for sending welcome emails with contract attachments
 * 
 * TO INTEGRATE WITH YOUR EMAIL SERVICE:
 * 1. Install your preferred email service (e.g., npm install resend, npm install nodemailer, etc.)
 * 2. Add your API keys to .env.local
 * 3. Uncomment and modify the appropriate integration code below
 */

interface WelcomeEmailParams {
    to: string;
    businessName: string;
    contractToken: string;
}

export async function sendWelcomeEmail({ to, businessName, contractToken }: WelcomeEmailParams) {
    try {
        const welcomeMessage = `Hello, welcome to 1010 Web Studio

We're glad to have you, ${businessName}.

Our work together is focused on one thing: helping your customers understand your offer faster and buy with less friction. We'll take care of the technical side so your business can show up clearly and professionally online.

Your contract is attached to this email. Please keep it safe for your records.

Thank you for trusting us. We're excited to get started!

-
Muhammad Omoyemi
1010 Web Studio`;

        const welcomeMessageHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1f2937;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #4f46e5; font-size: 24px; margin: 0;">1010 Web Studio</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.05)); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <p style="font-size: 18px; font-weight: 600; margin: 0 0 20px 0; color: #1f2937;">Hello, welcome to 1010 Web Studio</p>
                    
                    <p style="margin: 0 0 15px 0; line-height: 1.6; color: #4b5563;">We're glad to have you, <strong>${businessName}</strong>.</p>
                    
                    <p style="margin: 0 0 15px 0; line-height: 1.6; color: #4b5563;">Our work together is focused on one thing: helping your customers understand your offer faster and buy with less friction. We'll take care of the technical side so your business can show up clearly and professionally online.</p>
                    
                    <p style="margin: 0 0 15px 0; line-height: 1.6; color: #4b5563;">Your contract is attached to this email. Please keep it safe for your records.</p>
                    
                    <p style="margin: 0; line-height: 1.6; color: #4b5563;">Thank you for trusting us. We're excited to get started!</p>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                    <p style="margin: 0 0 5px 0;">Muhammad Omoyemi</p>
                    <p style="margin: 0; font-weight: 600; color: #4f46e5;">1010 Web Studio</p>
                </div>
            </div>
        `;

        // Get contract PDF URL - use localhost in development, production URL otherwise
        const isDevelopment = process.env.NODE_ENV === 'development';
        const baseUrl = isDevelopment
            ? 'http://localhost:3000'
            : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
        const contractPdfUrl = `${baseUrl}/api/contract/${contractToken}/pdf`;

        // ============================================
        // OPTION 1: RESEND (Recommended - Simple & Modern)
        // ============================================
        // Uncomment to use Resend:
        // 1. Run: npm install resend
        // 2. Add to .env.local: RESEND_API_KEY=your_api_key
        // 3. Get API key from: https://resend.com

        /*
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: '1010 Web Studio <onboarding@yourdomain.com>', // Change to your verified domain
            to: [to],
            subject: 'Welcome to 1010 Web Studio - Your Contract',
            html: welcomeMessageHTML,
            text: welcomeMessage,
            attachments: [
                {
                    filename: `${businessName.replace(/\s+/g, '-')}-Contract.pdf`,
                    path: contractPdfUrl,
                }
            ],
        });
        */

        // ============================================
        // ZOHO MAIL CONFIGURATION (ACTIVE)
        // ============================================
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // director@1010web.studio
                pass: process.env.EMAIL_PASS, // Your Zoho Mail password or app password
            },
        });

        await transporter.sendMail({
            from: '"1010 Web Studio" <director@1010web.studio>',
            to: to,
            subject: 'Welcome to 1010 Web Studio - Your Contract',
            text: welcomeMessage,
            html: welcomeMessageHTML,
            attachments: [
                {
                    filename: `${businessName.replace(/\s+/g, '-')}-Contract.pdf`,
                    path: contractPdfUrl,
                }
            ],
        });
        // ============================================
        // OPTION 3: SENDGRID
        // ============================================
        // Uncomment to use SendGrid:
        // 1. Run: npm install @sendgrid/mail
        // 2. Add to .env.local: SENDGRID_API_KEY

        /*
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send({
            to: to,
            from: 'your-verified-email@domain.com',
            subject: 'Welcome to 1010 Web Studio - Your Contract',
            text: welcomeMessage,
            html: welcomeMessageHTML,
            attachments: [
                {
                    content: await fetch(contractPdfUrl).then(r => r.buffer()).then(b => b.toString('base64')),
                    filename: `${businessName.replace(/\s+/g, '-')}-Contract.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment',
                }
            ],
        });
        */

        // ============================================
        // TEMPORARY: LOG INSTEAD OF SENDING
        // ============================================
        // Remove this once you've integrated an email service above
        console.log('=== WELCOME EMAIL (Ready to Send) ===');
        console.log('To:', to);
        console.log('Subject: Welcome to 1010 Web Studio - Your Contract');
        console.log('Message:', welcomeMessage);
        console.log('PDF URL:', contractPdfUrl);
        console.log('=====================================');

        return { success: true };

    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw - we don't want email failures to break the contract submission
        return { success: false, error };
    }
}
