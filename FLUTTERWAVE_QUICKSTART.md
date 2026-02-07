# 🚀 Flutterwave - Quick Start

## What You Need to Do (3 Steps):

### 1. Get Your API Keys
Go to: https://dashboard.flutterwave.com/settings/apis

Copy these two keys:
- **Public Key** (starts with `FLWPUBK-`)
- **Secret Key** (starts with `FLWSECK-`)

### 2. Add to `.env` (or `.env.local`)
```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-your_key_here
FLUTTERWAVE_SECRET_KEY=FLWSECK-your_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Test It!
```bash
npm run dev
```
Then create a test contract and try the payment!

---

## What's Been Built:

✅ **Flutterwave Inline Modal** - Payment popup stays on your page
✅ **Custom Styling** - Matches your 1010 Web Studio theme  
✅ **Multiple Payment Methods** - Card, Bank Transfer, USSD, Account
✅ **Automatic Verification** - Backend verifies all payments
✅ **Email Integration** - Sends welcome email after payment
✅ **Security** - Double verification, transaction validation

---

## Payment Flow:

1. User selects "Pay with Flutterwave"
2. Clicks "Proceed to Flutterwave" ✨
3. Popup modal appears (customized with your brand)
4. User pays via Card/Bank Transfer/USSD/Account
5. Payment verified automatically
6. Welcome email sent with contract PDF
7. Redirected to success page

---

## File Structure:

```
app/
  api/
    payment/
      initialize/route.ts    ← Initialize payment
      verify/route.ts        ← Verify & complete payment
  contract/[token]/
    page.tsx                 ← Payment UI (updated)
lib/
  flutterwave.ts            ← Payment utilities
```

---

## Test Cards (Sandbox):

**Success:**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- PIN: `3310`
- OTP: `12345`

**Switch to Live:**
Just add your live keys to `.env.local`!

---

## Need Help?

📖 Full Guide: See `FLUTTERWAVE_SETUP.md`
🔗 Flutterwave Docs: https://developer.flutterwave.com
💬 Support: developers@flutterwavego.com

---

That's it! Add your keys and you're live! 🎉
