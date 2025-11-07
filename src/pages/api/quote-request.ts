import { NextApiRequest, NextApiResponse } from 'next';
import { sendToAllRecipients, formatFormDataForEmail } from '@/lib/mailer';
import { EMAIL_TEMPLATES, COMPANY_INFO } from '@/config/emails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, company, service, projectDetails, pageUrl } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !service) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Format form data
    const formData = {
      'Full Name': name,
      'Email': email,
      'Phone': phone,
      'Company': company || 'Not specified',
      'Service Required': service,
      'Project Details': projectDetails || 'Not specified',
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
          <title>New Quote Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0A3D2A 0%, #1a5f3a 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">New Quote Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">From Samanportable Website</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #0A3D2A;">
              <h2 style="color: #0A3D2A; margin-top: 0;">Quote Request Details</h2>
              ${formatFormDataForEmail(formData)}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;">
                <strong>Priority:</strong> This is a quote request that requires pricing and timeline estimation.
              </p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong>Action Required:</strong> Please provide a detailed quote within 48 hours.
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from the quote request form on ${COMPANY_INFO.website}</p>
              <p>Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
New Quote Request - Samanportable

Quote Request Details:
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Priority: This is a quote request that requires pricing and timeline estimation.
Action Required: Please provide a detailed quote within 48 hours.

This email was sent from the quote request form on ${COMPANY_INFO.website}
Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}
    `;

    // Send email
    await sendToAllRecipients({
      subject: EMAIL_TEMPLATES.QUOTE_REQUEST.subject,
      html: htmlContent,
      text: textContent,
      replyTo: email
    });

    res.status(200).json({ 
      success: true, 
      message: 'Quote request submitted successfully' 
    });

  } catch (error) {
    console.error('Quote request submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit quote request' 
    });
  }
}
