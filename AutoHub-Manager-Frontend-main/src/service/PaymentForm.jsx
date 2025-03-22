import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [productnames, setProductNames] = useState('');
    const [names, setNames] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (location.state && location.state.totalPrice) {
            setPrice(location.state.totalPrice);
            const cartItems = location.state.productscart;
            const itemNames = cartItems.map(item => `${item.productId.name} (${item.quantity})`);
            setProductNames(itemNames.join(', '));
        }
    }, [location.state]);

    useEffect(() => {
        const timer = setTimeout(() => {
            toast.error('You are out of time');
            navigate('/clientdashboard');
        }, 30000); // 30 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [navigate]);

    const handleSubmit = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/payment/accept-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            names: names,
            productnames: productnames,
            price: price,
          }),
        });
    
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error('Error in response:', data);
        }
    
        // After successful payment, mark the cart items as paid
        await fetch('http://localhost:4000/api/cart/clear-cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token"),
          },
        });
    
        navigate('/paymentSuccess');
      } catch (error) {
        console.error('Error submitting payment:', error);
        navigate('/paymentFailure');
      }
    };
    
    return (
        <div className="max-w-md mx-auto mt-32 p-6 bg-gray-200 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-500">Payment Form</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="names">
                    Full Name
                </label>
                <input
                    type="text"
                    id="names"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productnames">
                    Product Names and Quantities
                </label>
                <input
                    type="text"
                    id="productnames"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={productnames}
                    readOnly
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price
                </label>
                <input
                    type="number"
                    id="price"
                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                onClick={handleSubmit}
            >
                Pay Now
            </button>
        </div>
    );
};

export default PaymentForm;