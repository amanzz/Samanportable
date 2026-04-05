import { NextApiRequest, NextApiResponse } from 'next';
import { sendToAllRecipients, formatFormDataForEmail } from '@/lib/mailer';
import { EMAIL_TEMPLATES, COMPANY_INFO } from '@/config/emails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, service, region, message, pageUrl } = req.body;

    // Strict Backend Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Email and Phone Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const phoneRegex = /^\+?[\d\s-]{7,16}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone format' });
    }

    // Submit to Zoho CRM
    try {
      const zohoData = new URLSearchParams();
      zohoData.append('Name_First', firstName || '-');
      zohoData.append('Name_Last', lastName || '-');
      zohoData.append('PhoneNumber_countrycode', phone || '');
      zohoData.append('Email', email || '');
      zohoData.append('Dropdown1', service || '-Select-');
      zohoData.append('Dropdown', region || '-Select-');
      zohoData.append('SingleLine', message || '');

      const zohoResponse = await fetch('https://forms.zohopublic.com/samanportable1/form/GetQuoteForm/formperma/-RQ6B5h5-oglLK1XIN6BcUhddk3Z4msxkoTE5r7OBok/htmlRecords/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: zohoData.toString()
      });

      if (!zohoResponse.ok) {
        console.error(`[Zoho CRM] Submission failed. Status: ${zohoResponse.status} - Email: ${email}`);
      } else {
        console.log(`[Zoho CRM] Successfully recorded lead for Email: ${email}`);
      }
    } catch (e) {
      console.error('[Zoho CRM] Critical Network/Fetch error during submission:', e);
    }

    // Format form data
    const formData = {
      'Full Name': `${firstName} ${lastName}`,
      'Email': email,
      'Phone': phone,
      'Service': service || 'Not specified',
      'Message': message,
      'Submission Page': pageUrl || req.headers.referer || 'Unknown',
      'Submission Time': new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata'
      })
    };

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0A3D2A 0%, #1a5f3a 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">From Samanportable Website</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #0A3D2A;">
              <h2 style="color: #0A3D2A; margin-top: 0;">Form Details</h2>
              ${formatFormDataForEmail(formData)}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong>Action Required:</strong> Please respond to this enquiry within 24 hours.
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from the contact form on ${COMPANY_INFO.website}</p>
              <p>Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
New Contact Form Submission - Samanportable

Form Details:
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Action Required: Please respond to this enquiry within 24 hours.

This email was sent from the contact form on ${COMPANY_INFO.website}
Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}
    `;

    // Send email
    await sendToAllRecipients({
      subject: EMAIL_TEMPLATES.CONTACT_FORM.subject,
      html: htmlContent,
      text: textContent,
      replyTo: email
    });

    res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact form' 
    });
  }
}
