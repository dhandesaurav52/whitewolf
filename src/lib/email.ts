
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("SendGrid API Key not found. Email sending will be disabled.");
}

interface MailOptions {
  to: string;
  from: string; // Must be a verified sender in SendGrid
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: MailOptions) => {
  if (!SENDGRID_API_KEY) {
    console.error("Attempted to send email without an API key.");
    // In a real app, you might want to throw an error or handle this differently
    return;
  }

  const msg = {
    ...options
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);

    // For more detailed error logs if available
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
  }
};
