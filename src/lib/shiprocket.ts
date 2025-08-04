
import axios from 'axios';
import type { Order } from './types';

const API_URL = 'https://apiv2.shiprocket.in/v1/external';

const getAuthToken = async (): Promise<string> => {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        throw new Error('Shiprocket API credentials are not configured in environment variables.');
    }

    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data.token;
    } catch (error: any) {
        console.error('Shiprocket Authentication Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Shiprocket.');
    }
};

export const createShipment = async (order: Order) => {
    const token = await getAuthToken();
    
    const nameParts = order.customer.name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

    const orderItems = order.items.map(item => ({
        name: item.product.name,
        sku: item.product.id.substring(0, 10), // Use first 10 chars of product ID as SKU
        units: item.quantity,
        selling_price: Number(item.product.price),
        hsn: 6109, // A default HSN code for apparel, can be customized per product
    }));
    
    const orderDate = order.orderDate.seconds ? new Date(order.orderDate.seconds * 1000) : new Date(order.orderDate);
    const formattedOrderDate = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;

    const sub_total = order.total;

    // Calculate total weight and find max dimensions from all products in the order
    let totalWeight = 0;
    let maxLength = 0;
    let maxBreadth = 0;
    let maxHeight = 0;

    order.items.forEach(item => {
        const productWeight = item.product.weight || 0.5; // Default to 0.5kg if not set
        totalWeight += productWeight * item.quantity;
        maxLength = Math.max(maxLength, item.product.length || 10); // Default to 10cm
        maxBreadth = Math.max(maxBreadth, item.product.breadth || 10);
        maxHeight = Math.max(maxHeight, item.product.height || 10);
    });

    const shipmentData = {
        channel_id: process.env.SHIPROCKET_CHANNEL_ID,
        order_id: order.id,
        order_date: formattedOrderDate,
        pickup_location: "Home",
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: order.customer.address,
        billing_city: order.customer.city,
        billing_pincode: order.customer.pincode,
        billing_state: order.customer.state,
        billing_country: "India",
        billing_email: order.customer.email,
        billing_phone: order.customer.phone,
        shipping_is_billing: true,
        shipping_customer_name: firstName,
        shipping_last_name: lastName,
        shipping_address: order.customer.address,
        shipping_city: order.customer.city,
        shipping_pincode: order.customer.pincode,
        shipping_state: order.customer.state,
        shipping_country: "India",
        shipping_email: order.customer.email,
        shipping_phone: order.customer.phone,
        order_items: orderItems,
        payment_method: order.paymentMethod === 'Online' ? 'Prepaid' : 'COD',
        sub_total: sub_total,
        length: maxLength,
        breadth: maxBreadth,
        height: maxHeight,
        weight: totalWeight, // Use calculated total weight
    };

    console.log("Sending the following data to Shiprocket:", JSON.stringify(shipmentData, null, 2));

    try {
        const response = await axios.post(`${API_URL}/orders/create/adhoc`, shipmentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Shiprocket Shipment Creation Response:', response.data);
        return response.data;
    } catch (error: any) {
        let errorMessage = 'An unknown error occurred.';
        if (error.response?.data?.errors) {
            const errorDetail = JSON.stringify(error.response.data.errors);
            if (errorDetail.toLowerCase().includes('pickup location')) {
                errorMessage = "Invalid Pickup Location. Please ensure you have a pickup location named 'Home' in your Shiprocket dashboard settings.";
            } else {
                 errorMessage = errorDetail;
            }
        }
        throw new Error(`Failed to create shipment: ${errorMessage}`);
    }
};
