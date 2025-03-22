import React, { useState, useEffect } from 'react';
import './CartItems.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientChat from './ClientChart';
import { parseJwt } from './utils';

const Orders = ({ vendorId }) => {
    const [productscart, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);
    const clientId = decodedToken.clientId;

    useEffect(() => {
        axios.get('http://localhost:4000/api/cart/user', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
        })
            .then((response) => {
                const filteredProducts = response.data.filter(item => item.paymentStatus !== 'PAID');
                setProducts(filteredProducts);
            })
            .catch((error) => {
                console.error('Error fetching cart items:', error);
                setError(error);
            });
    }, [clientId, token]);

    useEffect(() => {
        let total = 0;
        productscart.forEach(item => {
            const price = parseFloat(item.productId.price);
            total += price * item.quantity;
        });
        setTotalPrice(total);
    }, [productscart]);

    const removeFromCart = (cartItemId) => {
        // Remove product from the cart
        axios.delete(`http://localhost:4000/api/cart/productcart/${cartItemId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        })
        .then((response) => {
            // Update state by removing the product from the cart list
            setProducts(prevProducts =>
                prevProducts.filter(item => item._id !== cartItemId)
            );
    
            toast.success('Product removed from cart successfully');
        })
        .catch((error) => {
            console.error('Error removing product from cart:', error);
            toast.error('Product could not be removed from cart. Please try again later.');
        });
    };
        


    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const getButtonColor = (status) => {
        return status === 'NEW' ? '#3182ce' : '#e53e3e';
    };

    const handleButtonClick = async () => {
        try {
            const cartId = productscart[0]?._id;  // Get the cartId from the first item or any other method

            const requestData = {
                names: 'Customer Name',
                cartId: cartId,  // Pass cartId for unauthenticated users
            };

            const response = await axios.post('http://localhost:4000/api/payment/accept-payment', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")  // Keep token if authenticated
                },
            });

            window.location.href = response.data.url;
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Failed to initiate payment');
        }
    };


    const handleAddToCartClick = () => {
        // Navigate to the previous route or a default route if no previous route exists
        const previousPath = location.state?.from || '/Clientdashboard/';
        navigate(previousPath);
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='text-right'>
                <ToastContainer />
            </div>

            <h1 className="font-bold text-3xl text-blue-500 mb-8">Your Pending Carts</h1>

            <div className='grid md:grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-6'>
                    {productscart.map((item) => (
                        <div key={item._id} className="border rounded-lg overflow-hidden shadow-lg flex">
                            <img
                                src={item.productId.photo && item.productId.photo.length > 0
                                    ? `http://localhost:4000/${item.productId.photo[0].path}`
                                    : 'placeholder.jpg'}
                                alt={item.productId.name}
                                className="w-1/3 h-64 object-cover"
                            />
                            <div className="p-6 w-2/3 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl text-black font-semibold">{item.productId.name}</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            className="btn-buy rounded-full text-white text-sm py-1 px-4"
                                            style={{ backgroundColor: getButtonColor(item.productId.status) }}
                                        >
                                            {item.productId.status}
                                        </button>
                                        {/* <button 
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            Remove
                                        </button> */}
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => removeFromCart(item._id, item.productId._id, item.quantity)}
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-md">Quantity: {item.quantity}</p>
                                    <p className="text-md">Price (RWF): {item.productId.price}</p>
                                    <p className="text-md">Gear Box: {item.productId.gearbox}</p>
                                    <p className="text-md">Tank: {item.productId.tank}</p>
                                    <p className="text-md">Added on {formatDate(item.date)}</p>
                                </div>

                                <div className="flex items-center mt-4">
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
                </div>

                <div className='sticky top-8'>
                    <div className="border rounded-lg overflow-hidden shadow-lg p-6">
                        <h2 className="text-2xl text-black font-semibold mb-4">Total Price</h2>
                        <div className="space-y-3">
                            <p className='text-lg'>Product Name: {productscart.map(item => item.productId.name).join(', ')}</p>
                            <p className="text-lg">Quantity: {productscart.reduce((acc, item) => acc + item.quantity, 0)}</p>
                            <p className="text-lg font-bold">Total price (RWF): {totalPrice}</p>

                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={handleButtonClick}
                                    className='bg-blue-900 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded flex-1'
                                >
                                    Make Payment
                                </button>
                                <button
                                    onClick={handleAddToCartClick}
                                    className='bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded flex-1'
                                >
                                    Add Item to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat button and modal remain the same */}
            <div>
                <div className="fixed bottom-8 right-8">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold p-4 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-110"
                        onClick={toggleModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.919 8.919 0 01-4.7-1.37l-4.27.9a1 1 0 01-1.18-1.18l.9-4.27A8.92 8.92 0 012 10c0-4.418 3.134-8 7-8s8 3.134 8 8zM9 8a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 011-1h6a1 1 0 010 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
                            <div className="flex justify-end p-2">
                                <button
                                    className="bg-blue-300 text-black hover:text-white hover:bg-red-500 px-2 py-1 rounded mb-4"
                                    onClick={toggleModal}
                                >
                                    X
                                </button>
                            </div>
                            <div className="p-6">
                                <ClientChat vendorId={vendorId} clientId={clientId} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;