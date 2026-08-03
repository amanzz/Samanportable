import { NextApiRequest, NextApiResponse } from 'next';
import { sendToAllRecipients, formatFormDataForEmail } from '@/lib/mailer';
import { EMAIL_TEMPLATES, COMPANY_INFO } from '@/config/emails';
import { upsertLabourColonyLead } from '@/lib/zohoCrm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      firstName, lastName, email, phone, message, region, productName, pageUrl,
      isLabourColony, companyName, projectLocation, industry, workerCapacity,
      requiredDate, configuration, requirementType, website,
    } = req.body;

    // Honeypot: silently accept bot submissions without creating a lead.
    if (website) return res.status(200).json({ success: true, ignored: true });

    // Strict Backend Validation
    if (!firstName || !email || !phone || !message || (!isLabourColony && !lastName)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (isLabourColony && (!companyName || !projectLocation || !industry || !workerCapacity || !requiredDate || !configuration || !requirementType)) {
      return res.status(400).json({ message: 'Complete all required project fields' });
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
    if (isLabourColony && (!/^\d+$/.test(String(workerCapacity)) || Number(workerCapacity) < 1)) {
      return res.status(400).json({ message: 'Enter a valid worker capacity' });
    }

    const attribution = {
      'Lead Source': req.body.leadSource || 'Website Enquiry',
      'Marketing Platform': req.body.marketingPlatform || 'Website',
      GCLID: req.body.gclid || '', GBRAID: req.body.gbraid || '', WBRAID: req.body.wbraid || '',
      'UTM Source': req.body.utm_source || '', 'UTM Medium': req.body.utm_medium || '',
      'UTM Campaign': req.body.utm_campaign || '', 'UTM Content': req.body.utm_content || '',
      'UTM Term': req.body.utm_term || '', 'Campaign ID': req.body.campaignid || '',
      'Ad Group ID': req.body.adgroupid || '', 'Creative ID': req.body.creative || '',
      Keyword: req.body.keyword || '', 'Match Type': req.body.matchtype || '',
      Device: req.body.device || '', Network: req.body.network || '',
      'Landing Page': req.body.landingPage || pageUrl || '',
      'First Landing Page': req.body.firstLandingPage || '',
    };
    const crmContext = isLabourColony ? [
      'Product: Labour Colony', `Company: ${companyName}`, `Location: ${projectLocation}`,
      `Industry: ${industry}`, `Workers: ${workerCapacity}`, `Config: ${configuration}`,
      `Type: ${requirementType}`, `Date: ${requiredDate}`,
      attribution.GCLID ? `GCLID: ${attribution.GCLID}` : '',
      attribution['UTM Campaign'] ? `UTM: ${attribution['UTM Campaign']}` : '',
    ].filter(Boolean).join(' | ').slice(0, 250) : String(message).slice(0, 250);

    let zohoAccepted = isLabourColony ? await upsertLabourColonyLead(req.body) : false;
    if (!zohoAccepted) {
      const zohoData = new URLSearchParams();
      zohoData.append('Name_First', firstName || '-');
      zohoData.append('Name_Last', lastName || '-');
      zohoData.append('PhoneNumber_countrycode', phone || '');
      zohoData.append('Email', email || '');
      zohoData.append('Dropdown1', isLabourColony ? 'Prefab Labor Colony' : (productName || 'MS Porta Cabin'));
      zohoData.append('Dropdown', region || '-Select-');
      zohoData.append('SingleLine', crmContext);

      const zohoResponse = await fetch('https://forms.zohopublic.com/samanportable1/form/GetQuoteForm/formperma/-RQ6B5h5-oglLK1XIN6BcUhddk3Z4msxkoTE5r7OBok/htmlRecords/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: zohoData.toString()
      });
      zohoAccepted = zohoResponse.ok;
      if (!zohoAccepted) {
        console.error(`[Zoho CRM] Submission failed. Status: ${zohoResponse.status}`);
        return res.status(502).json({ message: 'Lead system is temporarily unavailable. Please try again.' });
      }
    }

    // Format form data
    const formData = {
      'Full Name': `${firstName} ${lastName || ''}`.trim(),
      'Company Name': companyName || '',
      'Email': email,
      'Phone': phone,
      'Product Interest': isLabourColony ? 'Labour Colony' : (productName || 'General Enquiry'),
      'Project Location': projectLocation || '',
      'Industry': industry || '',
      'Worker Capacity': workerCapacity || '',
      'Required Configuration': configuration || '',
      'Requirement Type': requirementType || '',
      'Required Date': requiredDate || '',
      'Requirement Details': message,
      ...attribution,
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
          <title>New Enquiry</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0A3D2A 0%, #1a5f3a 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">New Enquiry</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">From Samanportable Website</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #0A3D2A;">
              <h2 style="color: #0A3D2A; margin-top: 0;">Enquiry Details</h2>
              ${formatFormDataForEmail(formData)}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong>Action Required:</strong> Please respond to this enquiry within 24 hours.
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from the enquiry form on ${COMPANY_INFO.website}</p>
              <p>Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
New Enquiry - Samanportable

Enquiry Details:
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Action Required: Please respond to this enquiry within 24 hours.

This email was sent from the enquiry form on ${COMPANY_INFO.website}
Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}
    `;

    // Send email
    try {
      await sendToAllRecipients({
        subject: isLabourColony ? 'New Labour Colony Enquiry - SAMAN Portable' : EMAIL_TEMPLATES.ENQUIRY.subject,
        html: htmlContent,
        text: textContent,
        replyTo: email
      });
    } catch (mailError) {
      // Zoho is the system of record. Do not tell a genuine prospect the lead failed
      // after CRM has already accepted it; alerting can be repaired independently.
      console.error('Lead accepted by Zoho, but notification email failed:', mailError instanceof Error ? mailError.message : 'Unknown error');
    }

    return res.status(200).json({
      success: true, 
      message: 'Enquiry submitted successfully' 
    });

  } catch (error) {
    console.error('Enquiry submission error:', error);
    return res.status(500).json({
      success: false, 
      message: 'Failed to submit enquiry' 
    });
  }
}
