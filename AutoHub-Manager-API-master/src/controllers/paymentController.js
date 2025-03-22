import Stripe from 'stripe';
import Cart from '../models/cart.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);

export const acceptPayment = async (req, res) => {
    try {
        let cartItems;

        if (req.user) {
            // Find pending cart items for authenticated user
            cartItems = await Cart.find({ user: req.user._id, paymentStatus: 'PENDING' }).populate('productId');
        } else if (req.body.cartId) {
            // Find pending cart items for a specific cart ID (unauthenticated user)
            cartItems = await Cart.find({ _id: req.body.cartId, paymentStatus: 'PENDING' }).populate('productId');
        } else {
            return res.status(400).json({ message: 'Cart ID is required for unauthenticated users' });
        }

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No pending cart items found' });
        }

        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'rwf',
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `http://localhost:4000/api/payment/payment-success?cartId=${req.body.cartId || req.user._id}`,
            cancel_url: 'http://localhost:5173/PaymentFailure',
            metadata: {
                customer_name: req.body.names
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const processSuccessInfo = async (req, res) => {
    try {
        let cartItems;

        if (req.user) {
            cartItems = await Cart.find({ user: req.user._id, paymentStatus: 'PENDING' });
        } else if (req.query.cartId) {
            cartItems = await Cart.find({ _id: req.query.cartId, paymentStatus: 'PENDING' });
        } else {
            return res.status(400).json({ message: 'Cart ID is required for unauthenticated users' });
        }

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No pending cart items found' });
        }

        for (let item of cartItems) {
            item.paymentStatus = 'PAID';
            await item.save();
        }

        res.redirect('http://localhost:5173/PaymentSuccess');
    } catch (error) {
        console.error('Error processing success info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
