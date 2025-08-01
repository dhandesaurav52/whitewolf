
"use server";

import sgMail from '@sendgrid/mail';
import * as db from '@/lib/firestore';
import { User } from '@/lib/types';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SendGrid API Key not found in server action. Email sending will be disabled.");
}

interface MailOptions {
  to: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  text: string;
  html: string;
}

// Simplified item type for the email action
interface EmailCartItem {
    quantity: number;
    product: {
        name:string;
        price: string;
    };
}

// --- Email Template Wrapper ---
const createEmailHtml = (content: string) => `
  <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #111827; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">White Wolf</h1>
      </div>
      <div style="padding: 20px; line-height: 1.6; color: #333;">
        ${content}
      </div>
      <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
        <p><a href="https://your-store-url.com/shop" style="color: #111827;">Shop</a> | <a href="https://your-store-url.com/profile" style="color: #111827;">My Account</a></p>
      </div>
    </div>
  </div>
`;


async function sendSgEmail(options: MailOptions) {
   if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.error("Email service is not configured. Missing SendGrid API Key or From Email.");
    return { success: false, error: "Email service is not configured on the server." };
  }

  // Check user's notification preference before sending
  try {
    const userProfile = await db.profiles.getByEmail(options.to);
    if (userProfile && userProfile.emailNotifications === false) {
      console.log(`Email to ${options.to} blocked due to user preference.`);
      return { success: true, message: "Email not sent due to user preference." };
    }
  } catch (e) {
      console.error("Could not check user email preferences, sending email by default.", e);
  }


  try {
    await sgMail.send(options);
    console.log(`Email sent to ${options.to}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email via SendGrid:', error);
    if (error.response) {
      console.error(error.response.body)
    }
    // Return a structured error to the caller
    return { success: false, error: 'Failed to send email. ' + (error.response?.body?.errors[0]?.message || 'Please check server logs.') };
  }
}

export async function sendOrderConfirmationEmail({
    shippingDetails,
    itemsToPurchase,
    totalAmount,
    orderId,
}: {
    shippingDetails: { name: string; email: string; address: string; city: string; state: string; pincode: string },
    itemsToPurchase: EmailCartItem[],
    totalAmount: number,
    orderId: string,
}) {
    if (!process.env.SENDGRID_FROM_EMAIL) {
        console.error("SENDGRID_FROM_EMAIL is not set in environment variables.");
        return { success: false, error: "Sender email is not configured." };
    }
    
    const emailContent = `
      <h2 style="color: #111827;">Thank you for your order!</h2>
      <p>Hi ${shippingDetails.name},</p>
      <p>We've received your order and are getting it ready for you. We'll notify you as soon as it ships.</p>
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 25px;">Order Summary (ID: #${orderId.substring(0, 6)})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        ${itemsToPurchase.map(item => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">${item.quantity}x ${item.product.name}</td>
            <td style="padding: 10px 0; text-align: right;">₹${item.product.price}</td>
          </tr>
        `).join('')}
      </table>
      <p style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px;">
        Total: ₹${totalAmount.toFixed(2)}
      </p>
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 25px;">Shipping Address</h3>
      <p style="margin-top: 10px;">
        ${shippingDetails.address}<br>
        ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}
      </p>
      <p style="margin-top: 30px;">Thanks for being part of the pack,</p>
      <p>The White Wolf Team</p>
    `;
    
    const emailOptions: MailOptions = {
        to: shippingDetails.email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: `Your White Wolf Order is Confirmed (#${orderId.substring(0, 6)})`,
        html: createEmailHtml(emailContent),
        text: `Thank you for your order! Hi ${shippingDetails.name}, we've received your order #${orderId.substring(0, 6)} and will process it shortly. Total: ₹${totalAmount.toFixed(2)}.`,
    };

    return await sendSgEmail(emailOptions);
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    
    const emailContent = `
        <h2 style="color: #111827;">Welcome to the Pack, ${name}!</h2>
        <p>We're excited to have you join The White Wolf community. Your account is all set up.</p>
        <p>Now you can explore our latest collections, build your wishlist, and experience a seamless checkout.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-store-url.com/shop" style="background-color: #111827; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop Now</a>
        </div>
        <p>Walk your own path.</p>
        <p>The White Wolf Team</p>
    `;

    const emailOptions: MailOptions = {
        to: email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: "Welcome to The White Wolf Pack!",
        html: createEmailHtml(emailContent),
        text: `Welcome, ${name}! Thank you for joining The White Wolf. We're excited to have you in the pack. Explore our latest collections and find your style.`
    };
    return await sendSgEmail(emailOptions);
}

export async function sendOrderStatusUpdateEmail({ email, name, orderId, status }: { email: string; name: string; orderId: string; status: string }) {
    if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    
    let subject = `Your White Wolf Order #${orderId.substring(0,6)} has been ${status}`;
    let emailContent = `<h2 style="color: #111827;">Order Status Update</h2><p>Hi ${name},</p><p>We're updating you that your order #${orderId.substring(0,6)} has been marked as <strong>${status}</strong>.</p>`;

    if (status === 'Delivered') {
        emailContent += `<p>We hope you love your new items! Thank you for shopping with us.</p>`;
    }
     if (status === 'Cancelled') {
        emailContent += `<p>Your order has been successfully cancelled. If you have any questions, feel free to contact our support team.</p>`;
    }
    
    const emailOptions: MailOptions = { to: email, from: { name: 'White Wolf', email: process.env.SENDGRID_FROM_EMAIL }, subject, html: createEmailHtml(emailContent), text: `Your order #${orderId.substring(0,6)} has been ${status}.` };
    return await sendSgEmail(emailOptions);
}

export async function sendReturnStatusEmail({ email, name, orderId, status }: { email: string; name: string; orderId: string; status: 'Return Accepted' | 'Return Request Rejected' | 'Return Successful' }) {
    if (!process.env.SENDGRID_FROM_EMAIL) {
      return { success: false, error: "Sender email is not configured." };
    }

    let subject = `Update on your return for order #${orderId.substring(0,6)}`;
    let bodyContent = `<h2 style="color: #111827;">Return Status Update</h2><p>Hi ${name},</p>`;
    
    if (status === 'Return Accepted') {
        bodyContent += `<p>Your return request for order #${orderId.substring(0,6)} has been <strong>accepted</strong>. We will arrange for pickup shortly and keep you updated.</p>`;
    } else if (status === 'Return Request Rejected') {
         bodyContent += `<p>We regret to inform you that your return request for order #${orderId.substring(0,6)} has been <strong>rejected</strong>. Please refer to our return policy or contact support for more details.</p>`;
    } else { // Return Successful
         bodyContent += `<p>Your return for order #${orderId.substring(0,6)} is complete and your refund has been processed. It should reflect in your account within 5-7 business days. Thank you.</p>`;
    }

    const emailHtml = createEmailHtml(bodyContent);
    const emailOptions: MailOptions = { to: email, from: { name: 'White Wolf', email: process.env.SENDGRID_FROM_EMAIL }, subject, html: emailHtml, text: `Update on your return for order #${orderId.substring(0,6)}.` };
    return await sendSgEmail(emailOptions);
}

export async function sendAccountDeletionEmail({ email, name }: { email: string; name: string }) {
     if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    
    const emailContent = `
        <h2 style="color: #111827;">Goodbye, ${name}</h2>
        <p>This is a confirmation that your account with White Wolf has been permanently deleted as you requested.</p>
        <p>We're sorry to see you go and hope to see you again in the future.</p>
        <p>The White Wolf Team</p>
    `;

    const emailOptions: MailOptions = {
        to: email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: "Your White Wolf Account Has Been Deleted",
        html: createEmailHtml(emailContent),
        text: `Goodbye, ${name}. Your White Wolf account has been deleted.`
    };
    return await sendSgEmail(emailOptions);
}
