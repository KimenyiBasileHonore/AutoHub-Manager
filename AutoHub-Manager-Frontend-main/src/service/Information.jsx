// src/components/Information.js
import React, { useState, useEffect } from 'react';
import './CartItems.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import OrderStatus from './OrderStatus';
import AppointmentModal from './AppointmentModal'; // Import the new modal component

const Information = () => {
    const [productscart, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedProductId, setSelectedProductId] = useState(null); // State to store selected product ID
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:4000/api/cart/user', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
        })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching cart items:', error);
            });
    }, []);

    useEffect(() => {
        let total = 0;
        productscart.forEach(item => {
            const price = parseFloat(item.productId.price);
            total += price * item.quantity;
        });
        setTotalPrice(total);
    }, [productscart]);

    const removeFromCart = (cartItemId) => {
        axios.delete(`http://localhost:4000/api/cart/productcart/${cartItemId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
        })
            .then((response) => {
                setProducts(productscart.filter(item => item._id !== cartItemId));
                toast.success('Product removed from cart successfully');
            })
            .catch((error) => {
                console.error('Error removing product from cart:', error);
                toast.error('Product could not be removed from cart. Please try again later.');
            });
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const getButtonColor = (status) => {
        return status === 'NEW' ? '#3182ce' : '#e53e3e';
    };

    const openModal = (productId) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };

    return (
        <div className='flex flex-col'>
            <div className='text-right'>
                <ToastContainer />
            </div>
            <div>
                <h1 className="font-bold text-3xl text-blue-500 mb-8 ml-8">Your Orders</h1>
            </div>
            {productscart.map((item) => (
                <div className='ml-12' key={item._id}>
                    <div className="border rounded-lg overflow-hidden shadow-lg shadow-gray-800 flex mb-4">
                        <div className='flex flex-col items-center'>
                            <img src={item.productId.photo && item.productId.photo.length > 0 ? `http://localhost:4000/${item.productId.photo[0].path}` : 'placeholder.jpg'} alt={item.productId.name} className=" h-64 object-cover" />
                            <button className="mt-2 border border-blue-500 text-blue-500 bg-white py-2 px-4 rounded" onClick={() => openModal(item.productId._id)}>
                                Book test drive
                            </button>
                        </div>
                        <div className="p-4 w-1/4 grid">
                            <div className="w-3/4 flex flex-row justify-between">
                                <h2 className="text-2xl text-black font-semibold">{item.productId.name}</h2>
                                <button className="btn-buy rounded-full ml-12 text-white text-sm py-1 px-4" style={{ backgroundColor: getButtonColor(item.productId.status) }}>{item.productId.status}</button>
                                {item.paymentStatus === 'PENDING' && (
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-32" onClick={() => removeFromCart(item._id)}>Remove</button>
                                )}
                            </div>
                            <p className="text-md mb-2">Quantity: {item.quantity}</p>
                            <p className="text-md mb-2">Price (RWF): {item.productId.price}</p>
                            <p className="text-md mb-2">Gear Box: {item.productId.gearbox}</p>
                            <p className="text-md mb-2">Tank: {item.productId.tank}</p>
                            <p className="text-md mb-2">Ordered on {formatDate(item.
createdAt)}</p>
                            <OrderStatus status={item.orderStatus} />
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">{item.productId.rating.toFixed(1)}</span>
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`h-5 w-5 fill-current ${index < item.productId.rating ? "text-yellow-600" : "text-gray-400"}`}
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            <AppointmentModal isOpen={isModalOpen} onClose={closeModal} productId={selectedProductId} />
            <div className="fixed bottom-8 right-8">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold p-4 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.919 8.919 0 01-4.7-1.37l-4.27.9a1 1 0 01-1.18-1.18l.9-4.27A8.92 8.92 0 012 10c0-4.418 3.134-8 7-8s8 3.134 8 8zM9 8a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 011-1h6a1 1 0 010 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Information;
