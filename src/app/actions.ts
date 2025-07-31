
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
        name: string;
        price: string;
    };
}


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
    
    const emailOptions: MailOptions = {
        to: shippingDetails.email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: `White Wolf Order Confirmation - #${orderId.substring(0, 6)}`,
        html: `<h1>Thank you for your order!</h1>
                <p>Hi ${shippingDetails.name},</p>
                <p>We've received your order and will process it shortly.</p>
                <h3>Order Summary:</h3>
                <ul>
                    ${itemsToPurchase.map(item => `<li>${item.quantity}x ${item.product.name} - ₹${item.product.price}</li>`).join('')}
                </ul>
                <p><b>Total: ₹${totalAmount.toFixed(2)}</b></p>
                <p><b>Shipping Address:</b></p>
                <p>${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}</p>
                <p>Thanks for shopping with White Wolf!</p>`,
        text: `Thank you for your order! Hi ${shippingDetails.name}, we've received your order #${orderId.substring(0, 6)} and will process it shortly. Total: ₹${totalAmount.toFixed(2)}.`,
    };

    return await sendSgEmail(emailOptions);
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    const emailOptions: MailOptions = {
        to: email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: "Welcome to The White Wolf Pack!",
        html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining The White Wolf. We're excited to have you in the pack. Explore our latest collections and find your style.</p>`,
        text: `Welcome, ${name}! Thank you for joining The White Wolf.`
    };
    return await sendSgEmail(emailOptions);
}

export async function sendOrderStatusUpdateEmail({ email, name, orderId, status }: { email: string; name: string; orderId: string; status: string }) {
    if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    
    let subject = `Your White Wolf Order #${orderId.substring(0,6)} has been ${status}`;
    let html = `<p>Hi ${name},</p><p>We're updating you that your order #${orderId.substring(0,6)} has been marked as ${status}.</p>`;

    if (status === 'Delivered') {
        html += `<p>We hope you love your new items! Thank you for shopping with us.</p>`;
    }
     if (status === 'Cancelled') {
        html += `<p>Your order has been successfully cancelled. If you have any questions, feel free to contact us.</p>`;
    }
    
    const emailOptions: MailOptions = { to: email, from: { name: 'White Wolf', email: process.env.SENDGRID_FROM_EMAIL }, subject, html, text: `Your order #${orderId.substring(0,6)} has been ${status}.` };
    return await sendSgEmail(emailOptions);
}

export async function sendReturnStatusEmail({ email, name, orderId, status }: { email: string; name: string; orderId: string; status: 'Return Accepted' | 'Return Request Rejected' | 'Return Successful' }) {
    if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };

    let subject = `Update on your return for order #${orderId.substring(0,6)}`;
    let html = `<p>Hi ${name},</p>`;
    
    if (status === 'Return Accepted') {
        html += `<p>Your return request for order #${orderId.substring(0,6)} has been accepted. We will arrange for pickup shortly.</p>`;
    } else if (status === 'Return Request Rejected') {
         html += `<p>We regret to inform you that your return request for order #${orderId.substring(0,6)} has been rejected. Please contact support for more details.</p>`;
    } else { // Return Successful
         html += `<p>Your return for order #${orderId.substring(0,6)} is complete and your refund has been processed. Thank you.</p>`;
    }

    const emailOptions: MailOptions = { to: email, from: { name: 'White Wolf', email: process.env.SENDGRID_FROM_EMAIL }, subject, html, text: `Update on your return for order #${orderId.substring(0,6)}.` };
    return await sendSgEmail(emailOptions);
}

export async function sendAccountDeletionEmail({ email, name }: { email: string; name: string }) {
     if (!process.env.SENDGRID_FROM_EMAIL) return { success: false, error: "Sender email is not configured." };
    const emailOptions: MailOptions = {
        to: email,
        from: {
            name: 'White Wolf',
            email: process.env.SENDGRID_FROM_EMAIL
        },
        subject: "Your White Wolf Account Has Been Deleted",
        html: `<h1>Goodbye, ${name}</h1><p>This is a confirmation that your account with White Wolf has been permanently deleted as you requested. We're sorry to see you go.</p>`,
        text: `Goodbye, ${name}. Your White Wolf account has been deleted.`
    };
    return await sendSgEmail(emailOptions);
}
