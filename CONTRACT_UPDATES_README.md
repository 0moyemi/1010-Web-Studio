# Contract System Updates - Setup Guide

## Changes Made

### 1. ✅ Package Updates (Admin Generate)
- **Before:** 3 packages (Pre-launch ₦290k, Referred ₦450k, Original ₦390k)
- **After:** 2 packages only:
  - **Limited Package:** ₦290,000
  - **Minimum Package:** ₦390,000

**File:** `app/admin/generate/page.tsx`

---

### 2. ✅ New Payment UX with Flutterwave
Enhanced the payment step with a clean, modern design that includes:
- Clear visual hierarchy with amount display
- Two payment options:
  - **Flutterwave** (marked as recommended with security badges)
  - **Bank Transfer** (manual with receipt upload)
- Security assurances and trust indicators
- Professional styling with better hover states and transitions

**File:** `app/contract/[token]/page.tsx` (Step 4)

#### To Integrate Flutterwave:
When ready to activate Flutterwave payments:
1. Get your API keys from [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Add to `.env.local`:
   ```
   FLUTTERWAVE_PUBLIC_KEY=your_public_key
   FLUTTERWAVE_SECRET_KEY=your_secret_key
   ```
3. Install Flutterwave inline library or use their API
4. Update the payment button handler to initialize Flutterwave checkout

---

### 3. ✅ Updated Success Page
Redesigned success page with:
- **Email check instructions** - prominently displayed with user's email
- Clear reminders to check **Spam** and **Promotions** folders
- Visual hierarchy: Email check → Download PDF → What's Next
- Easy-to-skim information with numbered steps
- Professional icons and better spacing

**File:** `app/contract/[token]/success/page.tsx`

The email is passed via URL parameter from the contract submission.

---

### 4. ✅ Welcome Email with Contract PDF

#### Files Created:
- **`lib/email.ts`** - Email utility with 3 integration options
- **`.env.local.example`** - Environment variable template

#### Email Features:
- Professional HTML template with your welcome message
- Contract PDF automatically attached
- Personalized with business name
- Falls back gracefully if email fails (doesn't break submission)

#### Email Integration Options:

**Choose ONE of these services:**

##### Option 1: Resend (Recommended - Easiest)
```bash
npm install resend
```
Add to `.env.local`:
```
RESEND_API_KEY=your_key
```
- Get API key: https://resend.com
- Free tier: 3,000 emails/month
- Modern, simple API
- **Uncomment the Resend section in `lib/email.ts`**

##### Option 2: Nodemailer (SMTP - Any Email Provider)
```bash
npm install nodemailer
```
Add to `.env.local`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
- Works with Gmail, Outlook, any SMTP server
- For Gmail: Enable 2FA and create App Password
- **Uncomment the Nodemailer section in `lib/email.ts`**

##### Option 3: SendGrid
```bash
npm install @sendgrid/mail
```
Add to `.env.local`:
```
SENDGRID_API_KEY=your_key
```
- Get API key: https://sendgrid.com
- Free tier: 100 emails/day
- **Uncomment the SendGrid section in `lib/email.ts`**

---

## Quick Setup Steps

1. **Copy environment variables:**
   ```bash
   cp .env.local.example .env
   ```
   (or rename to `.env.local` if you prefer)

2. **Choose and integrate email service:**
   - Pick one option from above
   - Install the package
   - Add API keys to `.env` (or `.env.local`)
   - Uncomment the relevant section in `lib/email.ts`
   - Update the `from` email address

3. **Test the email:**
   - Submit a test contract with a valid email
   - Check console logs to see email was triggered
   - Verify email delivery

4. **Deploy:**
   - Update `NEXT_PUBLIC_BASE_URL` in your `.env` file with your production domain
   - Deploy to production
   - Test end-to-end flow

---

## Testing Checklist

- [ ] Admin can generate contracts with Limited/Minimum packages
- [ ] Payment page shows Flutterwave and Bank Transfer options
- [ ] Payment page displays security badges and clean layout
- [ ] Manual payment allows receipt upload
- [ ] Success page shows client's email address
- [ ] Success page has clear "check spam" messaging
- [ ] PDF download button works on success page
- [ ] Email is sent after payment submission (check console logs)
- [ ] Email contains welcome message with correct business name
- [ ] Contract PDF is accessible via the email link/attachment

---

## What to Configure Next

1. **Email Service:** Choose and integrate one of the 3 options in `lib/email.ts`
2. **Flutterwave:** Add payment gateway integration when ready
3. **Bank Details:** Update bank account info in the payment page (currently placeholder)
4. **Email Domain:** Set up a custom domain for professional emails (e.g., hello@1010webstudio.com)

---

## Notes

- Email currently logs to console until you integrate a service
- All email failures are handled gracefully - won't break contract submission
- The PDF URL in the email is generated dynamically from your base URL
- Success page email parameter is optional - shows "your email" if not provided
