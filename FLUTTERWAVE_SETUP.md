# Flutterwave Integration Guide

## ✅ What's Been Set Up

Your Flutterwave payment integration is now fully configured with:

### 1. **Flutterwave Inline (Popup Modal)**
- Payment modal stays on your page (better UX)
- Customized with your brand (1010 Web Studio)
- Matches your consistent theme
- Payment methods enabled: Card, Bank Transfer, USSD, Bank Account

### 2. **Files Created:**
- **`lib/flutterwave.ts`** - Payment utilities and configuration
- **`app/api/payment/initialize/route.ts`** - Initialize payment endpoint
- **`app/api/payment/verify/route.ts`** - Verify and complete payment

### 3. **Updated Files:**
- **`app/contract/[token]/page.tsx`** - Integrated payment flow

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Flutterwave Keys

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to: **Settings** → **API Keys**
3. Copy your **Live Public Key** (starts with `FLWPUBK-`)
4. Copy your **Live Secret Key** (starts with `FLWSECK-`)

### Step 2: Add Keys to Environment

Add these to your `.env` or `.env.local` file:

```env
# Flutterwave Live Keys
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X

# Your website URL (important for redirects)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Note:** Both `.env` and `.env.local` work. Use `.env` for simplicity, or `.env.local` if you want extra git safety.

**For Local Testing:**
Use test keys (starts with `FLWPUBK_TEST-` and `FLWSECK_TEST-`)

### Step 3: Test the Integration

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Generate a test contract from `/admin/generate`

3. Fill in the contract steps

4. On payment step:
   - Select "Pay with Flutterwave"
   - Click "Proceed to Flutterwave"
   - Complete test payment

5. Verify:
   - Payment popup appears
   - After payment, redirects to success page
   - Email is sent (if configured)
   - Transaction appears in Flutterwave dashboard

---

## 🎨 Customization Options

### Update Your Logo in Payment Modal

Edit `lib/flutterwave.ts` line 46:
```typescript
logo: `${baseUrl}/logo.png`, // Change to your logo path
```

### Change Accepted Currency

Edit `lib/flutterwave.ts` line 44 (currently set to NGN):
```typescript
currency: 'NGN', // Or 'USD', 'GBP', etc.
```

### Enable/Disable Payment Methods

Edit `lib/flutterwave.ts` line 43:
```typescript
payment_options: 'card,banktransfer,ussd,account', // Remove unwanted methods
```

Available options:
- `card` - Credit/Debit cards
- `banktransfer` - Bank Transfer
- `ussd` - USSD codes
- `account` - Pay from bank account
- `mobilemoney` - Mobile money (MTN, Vodafone, etc.)

---

## 📊 How It Works

### Payment Flow:

1. **User selects Flutterwave payment** → Payment method saved to state
2. **User clicks "Proceed to Flutterwave"** → Opens Flutterwave popup modal
3. **User completes payment** → Flutterwave processes payment
4. **Flutterwave redirects** → `/api/payment/verify` endpoint
5. **Backend verifies payment** → Checks with Flutterwave API
6. **Contract updated** → Payment status & transaction details saved
7. **Email sent** → Welcome email with contract PDF
8. **User redirected** → Success page with confirmation

### Security Features:

✅ Double verification (client & server)
✅ Transaction reference validation
✅ Amount & currency verification
✅ Secure webhook handling
✅ SSL encryption (256-bit)

---

## 🧪 Testing Payment

### Test Cards (Flutterwave Sandbox):

**Successful Payment:**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: Any future date
- PIN: `3310`
- OTP: `12345`

**Failed Payment (Insufficient Funds):**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- PIN: `3310` (will prompt insufficient funds)

**More test cards:** https://developer.flutterwave.com/docs/integration-guides/testing-helpers

---

## 💳 Bank Account Details

For manual bank transfer option, update the bank details in:
**`app/contract/[token]/page.tsx`** around line 750:

```typescript
<span className="text-sm font-semibold">Your Bank Name</span>
<span className="text-sm font-semibold">1234567890</span>
<span className="text-sm font-semibold">Your Business Name</span>
```

---

## 📧 Email Integration

The welcome email is automatically sent after successful payment. To enable email sending:

1. Choose an email service (see `lib/email.ts`)
2. Recommended: **Resend** (3,000 free emails/month)
3. Add API key to `.env.local`
4. Uncomment the relevant section in `lib/email.ts`

---

## 🔒 Production Checklist

Before going live:

- [ ] Replace test keys with live keys
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Test complete payment flow on production
- [ ] Verify webhooks are working
- [ ] Update bank account details (if using manual option)
- [ ] Add your logo to `/public/logo.png`
- [ ] Configure email service for welcome emails
- [ ] Test email delivery on production
- [ ] Enable Flutterwave webhook (optional but recommended)

---

## 🛟 Troubleshooting

### Payment modal doesn't open
- Check if `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` is set in `.env` or `.env.local`
- Check browser console for errors
- Verify Flutterwave script loaded (check Network tab)

### Payment succeeds but doesn't redirect
- Verify `NEXT_PUBLIC_BASE_URL` is correct
- Check if `/api/payment/verify` endpoint is working
- Look for errors in terminal/console

### Verification fails
- Check if `FLUTTERWAVE_SECRET_KEY` is correct (without `NEXT_PUBLIC_` prefix)
- Verify transaction ID in Flutterwave dashboard
- Check server logs for API errors

### Email not sending
- Emails are sent after verification completes
- Check console logs for "EMAIL TO SEND"
- Verify email service is configured in `lib/email.ts`

---

## 🎯 Advanced Features

### Add Webhooks (Optional)

For real-time payment notifications:

1. Create `/api/webhooks/flutterwave/route.ts`
2. Add webhook URL in Flutterwave dashboard
3. Verify webhook signature
4. Update contract status on webhook events

### Add Payment Plans

For installment payments:
- Use Flutterwave Payment Plans API
- Update initialization to include `payment_plan` parameter

### Add Subscription Support

For recurring payments:
- Use Flutterwave Subscription API
- Store subscription ID in contract

---

## 📞 Support

**Flutterwave Support:**
- Docs: https://developer.flutterwave.com
- Email: developers@flutterwavego.com
- Slack: https://join.slack.com/t/flutterwavedevelopers

**Your Keys Location:**
- Test: https://dashboard.flutterwave.com/settings/apis/test
- Live: https://dashboard.flutterwave.com/settings/apis/live

---

## 🎉 You're All Set!

Your payment integration is production-ready. Just add your API keys and you're good to go!
