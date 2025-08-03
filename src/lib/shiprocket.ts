
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
    
    const nameParts = order.customer.name.split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (firstName || " ");


    const orderItems = order.items.map(item => ({
        name: item.product.name,
        sku: item.product.id,
        units: item.quantity,
        selling_price: Number(item.product.price),
        hsn: 6109, // HSN code for T-shirts/knitted apparel
    }));
    
    const orderDate = new Date(order.orderDate);
    const formattedOrderDate = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;


    const shipmentData = {
        order_id: order.id,
        order_date: formattedOrderDate,
        pickup_location: "Primary", // This MUST match a pickup location name in your Shiprocket account
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
        sub_total: Number(order.total),
        length: 10,
        breadth: 10,
        height: 10,
        weight: Number(0.5),
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
        let errorMessage = error.message;
        if (error.response?.data?.errors) {
            const errorDetail = JSON.stringify(error.response.data.errors);
            if (errorDetail.toLowerCase().includes('pickup location')) {
                errorMessage = "Invalid Pickup Location. Please ensure you have a pickup location named 'Primary' in your Shiprocket dashboard settings.";
            } else {
                 errorMessage = errorDetail;
            }
        }
        throw new Error(`Failed to create shipment: ${errorMessage}`);
    }
};
