# ⚠️ IMPORTANT: You're Using LIVE Payment Keys!

## Current Configuration:

Your `.env` file has **LIVE Flutterwave keys** configured:
```
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-ff9a5f1a213a2e413a41dd3822194156-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-35c50e5dc1610d67084e24072aaea2f1-19c39cbece6vt-X
```

### This means:
- ❌ **Real money will be charged**
- ❌ Test cards won't work
- ✅ Only actual cards/bank accounts will work
- ✅ Payments go to your actual Flutterwave balance

---

## For Testing (Recommended):

Switch to **TEST keys** to avoid real charges:

1. Go to: https://dashboard.flutterwave.com/settings/apis/test
2. Copy your test keys (start with `FLWPUBK_TEST-` and `FLWSECK_TEST-`)
3. Replace in `.env`:
   ```env
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_test_key
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_test_secret
   ```
4. Restart server: `npm run dev`

### Test Cards:
```
Card: 5531 8866 5214 2950
CVV: 564
PIN: 3310
OTP: 12345
```

---

## For Production (Live):

Keep your current LIVE keys when you're ready to accept real payments.

---

## Switch Back to Live:

When testing is done, put your LIVE keys back in `.env` and deploy!
