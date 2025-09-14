# Email System Integration - Samanportable

This document describes the email system integration using **Brevo SMTP** and **Nodemailer** for the Samanportable Next.js project.

## 🚀 Features

- **Automatic Email Notifications** for all form submissions
- **Professional HTML Email Templates** with company branding
- **Multiple Recipient Support** - easily add/remove email addresses
- **Form Type Detection** - different email templates for different forms
- **Error Handling** - graceful fallbacks if email sending fails
- **Reply-to Support** - customers can reply directly to emails

## 📧 Email Recipients

All emails are sent to the recipients defined in `src/config/emails.js`:

```javascript
export const RECIPIENTS = [
  "amandubey1750@gmail.com",
  "sales@samanportable.com"
];
```

**To add/remove recipients:**
1. Edit `src/config/emails.js`
2. Add or remove email addresses from the `RECIPIENTS` array
3. No other code changes required!

## 🔧 Configuration

### SMTP Settings (Brevo)
- **Host:** smtp-relay.brevo.com
- **Port:** 587
- **Security:** TLS (not SSL)
- **Authentication:** Username/Password
- **From Email:** enquiry@samanportable.com
- **From Name:** Samanportable

### Company Information
All emails include company branding and contact information from `src/config/emails.js`.

## 📝 Supported Form Types

### 1. Contact Form (`/api/contact-form`)
- **Triggered by:** ContactCTA component
- **Fields:** First Name, Last Name, Email, Phone, Service, Message
- **Email Template:** Contact form submission
- **Priority:** High (24-hour response required)

### 2. Quote Request (`/api/quote-request`)
- **Triggered by:** QuoteForm component
- **Fields:** Name, Phone, Email, Company, Service, Project Details
- **Email Template:** Quote request
- **Priority:** High (48-hour quote required)

### 3. General Enquiry (`/api/enquiry`)
- **Triggered by:** EnquiryDialog component
- **Fields:** Name, Email, Phone, Message
- **Email Template:** General enquiry
- **Priority:** Medium (24-hour response required)

### 4. Order Placement (`/api/place-order`)
- **Triggered by:** Checkout process
- **Fields:** Complete order details including billing, shipping, and items
- **Email Template:** Order confirmation
- **Priority:** High (immediate processing required)

## 🎨 Email Templates

All emails feature:
- **Professional HTML Design** with company colors (#0A3D2A, #1a5f3a)
- **Responsive Layout** that works on all devices
- **Plain Text Fallback** for email clients that don't support HTML
- **Company Branding** and contact information
- **Action Items** clearly marked for staff
- **Formatted Data** in easy-to-read tables

## 🧪 Testing

### Test Email API
Send a test email to verify the system is working:

```bash
curl -X POST http://localhost:3000/api/test-email
```

Or use the browser:
1. Navigate to `http://localhost:3000/api/test-email`
2. Use a tool like Postman or Thunder Client to send a POST request

### Expected Behavior
- ✅ Email sent to all recipients in `RECIPIENTS` array
- ✅ Professional HTML formatting
- ✅ Company branding included
- ✅ Reply-to set to customer's email (when applicable)

## 🚨 Troubleshooting

### Common Issues

#### 1. SMTP Connection Failed
```
Error: SMTP connection error: connect ECONNREFUSED
```
**Solution:** Check if Brevo SMTP credentials are correct and the service is active.

#### 2. Authentication Failed
```
Error: Invalid login
```
**Solution:** Verify username and password in `src/lib/mailer.js`.

#### 3. Email Not Received
**Check:**
- Spam/junk folders
- Brevo sending limits
- Network connectivity
- Console logs for errors

### Debug Mode
Enable detailed logging by checking the console for:
- SMTP connection status
- Email sending confirmations
- Error messages with stack traces

## 📁 File Structure

```
src/
├── config/
│   └── emails.js              # Email configuration and recipients
├── lib/
│   └── mailer.js              # Nodemailer setup and utility functions
└── pages/api/
    ├── contact-form.ts         # Contact form handler
    ├── quote-request.ts        # Quote request handler
    ├── enquiry.ts              # General enquiry handler
    ├── place-order.ts          # Order placement handler
    └── test-email.ts           # Test email endpoint
```

## 🔒 Security Considerations

- **SMTP Credentials** are stored in the code (consider environment variables for production)
- **Rate Limiting** - implement if needed to prevent spam
- **Input Validation** - all form inputs are validated before processing
- **Error Handling** - sensitive information is not exposed in error messages

## 🚀 Production Deployment

### Environment Variables (Recommended)
For production, move SMTP credentials to environment variables:

```javascript
// .env.local
BREVO_SMTP_USER=9370d8001@smtp-brevo.com
BREVO_SMTP_PASS=xsmtpsib-6e091ced1f1dd85a80df1e7be8d15498acc55a5a6e530204f1cfa85f7e25a6cf-yS6mb7GJWB0gx8AH
BREVO_SMTP_HOST=smtp-relay.brevo.com
```

Then update `src/lib/mailer.js`:
```javascript
auth: {
  user: process.env.BREVO_SMTP_USER,
  pass: process.env.BREVO_SMTP_PASS
}
```

### Monitoring
- Monitor email delivery rates
- Check Brevo dashboard for sending statistics
- Set up alerts for failed email attempts

## 📞 Support

If you encounter issues with the email system:

1. **Check Console Logs** for detailed error messages
2. **Verify SMTP Credentials** in Brevo dashboard
3. **Test with Test Email API** to isolate issues
4. **Check Network Connectivity** to Brevo servers

## 🔄 Future Enhancements

Potential improvements:
- **Email Templates Database** for dynamic content
- **Scheduled Emails** for follow-ups
- **Email Analytics** and tracking
- **Multi-language Support** for international customers
- **Email Queue System** for high-volume scenarios

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Maintainer:** Development Team
