# Zoho Mail Setup - Quick Guide

## ✅ What's Configured:

Your email system is now set up to send from **director@1010web.studio** using Zoho Mail!

## 🔧 Complete the Setup:

### 1. Add Your Zoho Password

Update your `.env` file with your Zoho Mail password:

```env
EMAIL_USER=director@1010web.studio
EMAIL_PASS=your_zoho_password_here
```

**Use an App Password (Recommended):**
1. Go to: https://accounts.zoho.com/home#security/application-passwords
2. Create a new app password for "1010 Web Studio"
3. Use that password instead of your main password
4. This is more secure and won't break if you change your main password

### 2. Test the Email

After adding your password:
1. Restart dev server: `npm run dev`
2. Create a testing package contract
3. Fill in all steps with a real email address
4. Complete the contract (it's FREE ₦0!)
5. Check if welcome email arrives

### 3. Troubleshooting

**Email not sending?**
- Check terminal/console for error messages
- Verify `EMAIL_PASS` is correct in `.env`
- Make sure Zoho Mail account is active
- Check spam folder for the email
- Try using app password instead of main password

**Still not working?**
Check Node.js logs for detailed error messages. Common issues:
- Wrong password
- Need to enable SMTP in Zoho settings
- Firewall blocking port 465

## 📧 How It Works:

When a contract is completed:
1. ✅ Payment confirmed (or testing package used)
2. ✅ Email sent from `director@1010web.studio`
3. ✅ Welcome message included
4. ✅ Contract PDF attached
5. ✅ User redirected to success page

## 🎯 Testing Package:

You now have a **Testing Package (₦0)** that:
- ✅ Costs nothing
- ✅ Skips Flutterwave payment
- ✅ Still sends the welcome email
- ✅ Perfect for testing the full flow!

Generate it from: `/admin/generate`

---

## Production Notes:

- Zoho Mail SMTP settings are already configured
- Server: `smtp.zoho.com`
- Port: `465` (SSL)
- From address: `director@1010web.studio`
- Works in both development and production

Just add your password and you're ready! 🚀
