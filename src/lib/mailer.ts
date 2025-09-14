import nodemailer from 'nodemailer';
import { RECIPIENTS, COMPANY_INFO } from '@/config/emails';

// Create transporter with Brevo SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: '9370d8001@smtp-brevo.com',
    pass: 'xsmtpsib-6e091ced1f1dd85a80df1e7be8d15498acc55a5a6e530204f1cfa85f7e25a6cf-yS6mb7GJWB0gx8AH'
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: false, // Disable debug output
  logger: false // Disable logging
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Email sending function
export const sendEmail = async (options: {
  to?: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}) => {
  try {
    const { to, subject, html, text, from, replyTo } = options;
    
    const mailOptions = {
      from: from || `${COMPANY_INFO.name} <${COMPANY_INFO.email}>`,
      to: to || RECIPIENTS.join(', '),
      subject: subject,
      html: html,
      text: text,
      replyTo: replyTo || COMPANY_INFO.email
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    
    // Type guard for error object
    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      throw new Error('Failed to send email: Unknown error occurred');
    }
  }
};

// Send to all recipients
export const sendToAllRecipients = async (options: {
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}) => {
  return sendEmail({
    ...options,
    to: RECIPIENTS.join(', ')
  });
};

// Send to specific recipients
export const sendToRecipients = async (
  recipients: string | string[],
  options: {
    subject: string;
    html: string;
    text: string;
    from?: string;
    replyTo?: string;
  }
) => {
  const emailList = Array.isArray(recipients) ? recipients.join(', ') : recipients;
  return sendEmail({
    ...options,
    to: emailList
  });
};

// Send to single recipient
export const sendToRecipient = async (
  recipient: string,
  options: {
    subject: string;
    html: string;
    text: string;
    from?: string;
    replyTo?: string;
  }
) => {
  return sendEmail({
    ...options,
    to: recipient
  });
};

// Utility function to format form data for email
export const formatFormDataForEmail = (formData: Record<string, any>, formType = 'general') => {
  const formatField = (key: string, value: any) => {
    if (!value) return '';
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    return `<tr><td><strong>${label}:</strong></td><td>${value}</td></tr>`;
  };

  const fields = Object.entries(formData)
    .filter(([_, value]) => value)
    .map(([key, value]) => formatField(key, value))
    .join('');

  return `
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tbody>
        ${fields}
      </tbody>
    </table>
  `;
};

export default transporter;
