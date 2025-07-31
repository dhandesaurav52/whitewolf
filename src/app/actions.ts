
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
   if (!process.env.SENDGRID_API_KEY) {
    console.error("Attempted to send email without an API key.");
    throw new Error("Email service is not configured.");
  }
  try {
    await sgMail.send(options);
    console.log(`Email sent to ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
    // Don't rethrow the error to the client to avoid exposing sensitive details.
    // Just log it on the server.
    return { success: false, error: 'Failed to send email.' };
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
    const emailOptions = {
        to: shippingDetails.email,
        from: 'thewhitewolf0501@gmail.com', // Your verified SendGrid sender
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
