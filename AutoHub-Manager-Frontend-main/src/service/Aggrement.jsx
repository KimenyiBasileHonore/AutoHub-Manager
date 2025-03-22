import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartItems = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('PROCESSING');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get('http://localhost:4000/api/cart/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                },
            })
                .then((response) => {
                    setCartItems(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching cart items:', error);
                    setError('Failed to fetch cart items. Please try again later.');
                });
        } else {
            setError('No token found. Please log in.');
        }
    }, []);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const getButtonColor = (status) => {
        return status === 'NEW' ? '#3182ce' : '#e53e3e';
    };

    const handleButtonClick = () => {
        window.location.href = 'https://dashboard.stripe.com/test/payments';
    };

    const handleStatusChange = (event, cartItemId) => {
        const newStatus = event.target.value;
        setStatus(newStatus);

        const token = localStorage.getItem("token");
        if (token) {
            axios.put('http://localhost:4000/api/cart/update-order-status', {
                cartItemId: cartItemId,
                orderStatus: newStatus
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((response) => {
                    console.log('Order status updated:', response.data);
                    // Optionally, you can refresh the cart items list to reflect the updated status
                })
                .catch((error) => {
                    console.error('Error updating order status:', error);
                    setError('Failed to update order status. Please try again later.');
                });
        } else {
            setError('No token found. Please log in.');
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    return (
        <div className="mt-16 font-serif container mx-auto px-4 py-8">
            <h1 className="font-bold text-2xl mb-4 text-blue-500">Customer inquiries</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="">
                {cartItems.map((item) => (
                    <div key={item._id} className="border rounded-lg overflow-hidden shadow-lg flex mb-4">
                        <img
                            src={item.productId.photo && item.productId.photo.length > 0 ? `http://localhost:4000/${item.productId.photo[0].path}` : 'placeholder.jpg'}
                            alt={item.productId.name}
                            className="w-2/4 h-64 object-cover"
                        />
                        <div className="p-4 w-2/4 grid">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl text-black font-semibold">{item.productId.name}</h2>
                                <button
                                    className="btn-buy rounded-full text-white text-xs py-1 px-4"
                                    style={{ backgroundColor: getButtonColor(item.productId.status) }}
                                >
                                    {item.productId.status}
                                </button>
                            </div>
                            <div className="flex items-center mb-2">
                                
                                <div className="flex">
                                    <span className="mr-2">{item.productId.rating.toFixed(1)}</span>
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`h-4 w-4 fill-current ${index < item.productId.rating ? "text-yellow-600" : "text-gray-400"}`}
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm mb-2">Quantity: {item.quantity}</p>
                            <p className="text-sm mb-2">Price: {item.productId.price}</p>
                            <button onClick={() => openModal(item.productId)} className='btn-buy rounded-full text-white text-xs py-1 px-4 w-32 bg-black'>More...</button>
                            <p className="text-sm font-bold mb-2">From: {item.user && item.user.email}</p>
                            <div className='flex items-center'>
                            <label className="text-md mb-2 font-bold">Order Status:</label>
                            <select
                                    value={item.orderStatus}
                                    onChange={(e) => handleStatusChange(e, item._id)}
                                    className="border border-black bg-transparent text-gray-700 hover:text-gray-900 focus:outline-none mr-8 px-4 py-1 rounded transition duration-300 ease-in-out"
                                >
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                                </div>
                        </div>
                        {isModalOpen && selectedProduct && (
                            <div className="fixed z-50 inset-0 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                        <div className="absolute inset-0  backdrop-filter backdrop-blur-sm bg-opacity-50"></div>
                                    </div>
                                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                        <div className="bg-black  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <h3 className="text-2xl text-white leading-6 font-medium text-gray-900" id="modal-headline">{selectedProduct.name}</h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600"><strong className='text-white'>Basic Information:</strong> {selectedProduct.basicInfo}</p>
                                                        <p className="text-sm text-gray-600"><strong className='text-white'>Price:</strong> {selectedProduct.price}</p>
                                                        <p className="text-sm text-gray-600"><strong className='text-white'>Region:</strong> {selectedProduct.region}</p>
                                                        <p className="text-sm text-gray-600"><strong className='text-white'>Color:</strong> {selectedProduct.color}</p>
                                                        <p className="text-sm text-gray-600"><strong className='text-white'>More details: </strong>{selectedProduct.moreDetails}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-black px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div className='fixed right-0 gap-8 top-32 bottom-0 bg-white backdrop-filter backdrop-blur-sm bg-opacity-50'>
                    <div className="border rounded-lg overflow-hidden shadow-lg bg-gray-300 shadow-gray-800 flex mb-4 mt-8">
                        <div className="p-4 w-full grid">
                            <button onClick={handleButtonClick} className='bg-blue-900 ml-8 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded'>Check payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CartItems;