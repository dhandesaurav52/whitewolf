
"use server";

import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SendGrid API Key not found in server action. Email sending will be disabled.");
}

interface MailOptions {
  to: string;
  from: string; // Must be a verified sender in SendGrid
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
    
    const emailOptions = {
        to: shippingDetails.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Order Confirmation - #${orderId.substring(0, 6)}`,
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
