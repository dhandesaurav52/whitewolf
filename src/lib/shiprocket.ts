
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
    
    const [firstName, ...lastNameParts] = order.customer.name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const orderItems = order.items.map(item => ({
        name: item.product.name,
        sku: item.product.id,
        units: item.quantity,
        selling_price: item.product.price,
        hsn: 4911, // Example HSN code, should be configured per product if needed
    }));

    const shipmentData = {
        order_id: order.id,
        order_date: new Date(order.orderDate).toISOString().split('T')[0], // format YYYY-MM-DD
        pickup_location: "Primary", // This should match a pickup location name in your Shiprocket account
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
        order_items: orderItems,
        payment_method: order.paymentMethod === 'Online' ? 'Prepaid' : 'COD',
        sub_total: order.total,
        length: 10, // These dimensions can be customized
        breadth: 10,
        height: 10,
        weight: 0.5, // Weight in kgs
    };

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
        console.error('Shiprocket Shipment Creation Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : error.message;
        throw new Error(`Failed to create shipment: ${errorMessage}`);
    }
};
