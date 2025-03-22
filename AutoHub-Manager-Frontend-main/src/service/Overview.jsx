import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import money from "../pic/money.png";
import gearshift from "../pic/gearshift.png";
import fuel from "../pic/fuel.png";
import Footers from '../pages/Footers';




const Overview = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [isOpen, setIsOpen] = useState({
        carCost: true,
        basicInfo: true,
        region: true,
        color: true,
        moreDetails: true,
        image: true,
    });

    useEffect(() => {
        axios.get('http://localhost:4000/api/prod/allproduct', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
        })
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);


    const addToCart = (productId, quantity) => {
        axios.post('http://localhost:4000/api/cart/add-to-cart', { productId, quantity }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
        })
        .then((response) => {
            toast.success('Product added successfully');
    
            console.log("Updated stock received from backend:", response.data.updatedStock); // Debugging log
    
            if (response.data.updatedStock !== undefined) {
                // Update stock in UI
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId
                            ? { ...product, stock: response.data.updatedStock } // Ensure stock updates dynamically
                            : product
                    )
                );
            }
        })
        .catch((error) => {
            console.error('Error adding product to cart:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        });
    };
    
    

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
    const handleProductSelection = (productId) => {
        let selectedItem;
        if (productId === '') {
            selectedItem = null;
        } else {
            selectedItem = products.find(product => product._id === productId);
        }

        setSelectedProduct(selectedItem);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    const handleRating = async (rating) => {
        try {
            const newRating = (selectedProduct.rating + rating) / 2;
            const response = await axios.put(
                `http://localhost:4000/api/prod/product/${selectedProduct._id}/rate`,
                { rating: newRating },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem("token")
                    },
                }
            );
            setSelectedProduct((prevProduct) => ({
                ...prevProduct,
                rating: response.data.product.rating,
            }));
        } catch (error) {
            console.error('Error updating product rating:', error);
            toast.error('Failed to update rating. Please try again later.');
        }
    };


    return (
        <div>
            <div className='flex justify-between  px-4 py-4 '>
                <h1 className=" font-bold text-3xl text-blue-500  ml-8">Catalog</h1>
                <div className=" ">
                    <select className="border border-black bg-transparent text-gray-700 hover:text-gray-900 focus:outline-none mr-8 px-4 py-1 rounded transition duration-300 ease-in-out"
                        onChange={(e) => handleProductSelection(e.target.value)}>

                        <option value="">Prices</option>
                        {products
                            .slice()
                            .sort((a, b) => a.price - b.price)
                            .map((product) => (
                                <option key={product.id} value={product._id}>{product.name} : {product.price}</option>
                            ))}
                    </select>
                    <select className="border border-black bg-transparent text-gray-700 hover:text-gray-900 focus:outline-none mr-8 px-4 py-1 rounded transition duration-300 ease-in-out">
                        <option value="">Manufacturer  </option>
                        {/* Manufacturer ▼ */}
                    </select>
                    <select
                        className="border border-black bg-transparent text-gray-700 hover:text-gray-900 focus:outline-none mr-8 px-4 py-1 rounded transition duration-300 ease-in-out"
                        onChange={(e) => handleProductSelection(e.target.value)}
                    >
                        <option value="">Rating</option>
                        {products
                            .slice()
                            .sort((a, b) => a.rating - b.rating)
                            .map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - {product.rating && typeof product.rating === 'number' ? product.rating.toFixed(1) : 'No rating'}

                                </option>

                            ))}
                    </select>
                </div>
            </div>
            <div className=" mx-auto px-34   py-8">
                <div className='text-right'>
                    <ToastContainer />
                </div>

                <div className=" grid grid-cols-1 md:grid-cols-4 gap-12 mx-auto px-2 py-8 max-w-1xl ">
                    {products.map((product) => (
                        <div className=" bg-gray-400 rounded-lg overflow-hidden shadow-md" key={product._id}>
                            <div className=' bg-gray-400 py-2 px-4 flex justify-between items-center'>
                                <span className='text-black font-bold uppercase'>{product.name}</span>
                                <button className=" rounded-full text-white text-sm py-1 px-4" style={{ backgroundColor: product.status === 'NEW' ? '#3182ce' : '#e53e3e' }}>{product.status}</button>
                            </div>
                            <div className=" p-4 cursor-pointer" >
                                <div onClick={() => openModal(product)}>
                                    {product.photo && product.photo.length > 0 && (
                                        <div className="border rounded-lg overflow-hidden shadow-md">
                                            <img src={`http://localhost:4000/${product.photo[0].path}`} className="w-full h-64 object-cover" alt={`Product Image`} />
                                        </div>
                                    )}
                                    <div className="details ml-5 mt-4">
                                        <div class="lg:flex text-center">
                                            <div class="item">
                                                <img src={money} alt="price" class="ml-6 w-9 h-9" />
                                                <span class="font-bold text-md ml-4 text-gray-900">{product.price}</span>
                                            </div>
                                            <div class="item">
                                                <img src={gearshift} alt="gearbox" class="ml-8 w-9 h-9" />
                                                <span class="font-bold text-md ml-5 text-gray-900">{product.gearbox}</span>
                                            </div>
                                            <div class="item">
                                                <img src={fuel} alt="tank" class=" ml-6 w-9 h-9" />
                                                <span class="font-bold text-md ml-5 text-gray-900">{product.tank}</span>
                                            </div>

                                        </div>


                                    </div>
                                </div>
                                <div className='footer bg-gray-200 py-2 px-4 flex justify-between rounded items-center'>
                                    <select className="mr-2 border border-gray-400 px-2 py-1 rounded" onChange={(e) => setQuantity(e.target.value)}>
                                        {[...Array(100).keys()].map((num) => (
                                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                                        ))}
                                    </select>
                                    <button className="border border-black bg-green-500 text-white focus:outline-none  px-2 py-1 rounded transition duration-300 ease-in-out" onClick={() => addToCart(product._id, quantity)}>Add to Cart</button>
                                </div>
                            </div>


                        </div>

                    ))}
                </div>
                <div className="fixed bottom-8 right-8">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold p-4 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.919 8.919 0 01-4.7-1.37l-4.27.9a1 1 0 01-1.18-1.18l.9-4.27A8.92 8.92 0 012 10c0-4.418 3.134-8 7-8s8 3.134 8 8zM9 8a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 011-1h6a1 1 0 010 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {isModalOpen && selectedProduct && (
                <>
                    <div className="fixed right-0 top-0 bottom-0 w-1/3 bg-blue-900 shadow-lg border rounded-lg shadow-gray-800 p-8 overflow-y-auto backdrop-filter backdrop-blur-sm bg-opacity-50">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl text-black uppercase font-bold mb-4">{selectedProduct.name}</h2>
                            <button className="bg-gray-100 text-black hover:text-white hover:bg-red-500 px-2 py-1 rounded mb-4" onClick={closeModal}>X</button>
                        </div>
                        <button className="accordion-btn  font-bold  flex justify-between w-full py-2 px-4 text-lg text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('basicInfo')}>
                            Basic Information {isOpen['basicInfo'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content  ${isOpen['basicInfo'] ? 'block' : 'hidden'}`}>
                            <p className='text-white'>{selectedProduct.basicInfo}</p>
                        </div>
                        <button className="accordion-btn font-bold  flex justify-between w-full py-2 text-lg  px-4 text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('carCost')}>
                            Car cost (RWF){isOpen['carCost'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content ${isOpen['carCost'] ? 'block' : 'hidden'}`}>
                            <p className='text-white mb-4'>{selectedProduct.price}</p>
                        </div>
                        <button className="accordion-btn font-bold  flex justify-between w-full text-lg  py-2 px-4 text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('region')}>
                            Region {isOpen['region'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content ${isOpen['region'] ? 'block' : 'hidden'}`}>
                            <p className='text-white mb-4'>{selectedProduct.region}</p>
                        </div>
                        <button className="accordion-btn font-bold  flex justify-between w-full text-lg  py-2 px-4 text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('color')}>
                            Color {isOpen['color'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content ${isOpen['color'] ? 'block' : 'hidden'}`}>
                            <p className='text-white mb-4'>{selectedProduct.color}</p>
                        </div>
                        <button className="accordion-btn font-bold flex justify-between w-full text-lg py-2 px-4 text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('moreDetails')}>
                            More details {isOpen['moreDetails'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content ${isOpen['moreDetails'] ? 'block' : 'hidden'}`}>
                            <p className='text-white'>{selectedProduct.moreDetails}</p>
                        </div>
                        <button className="accordion-btn font-bold flex justify-between w-full text-lg py-2 px-4 text-left bg-gray-400 rounded-lg mb-4" onClick={() => toggleAccordion('image')}>
                            Image {isOpen['image'] ? '-' : '+'}
                        </button>
                        <div className={`accordion-content ${isOpen['image'] ? 'block' : 'hidden'}`}>
                            {selectedProduct.photo && selectedProduct.photo.length > 0 && (
                                <div className="border rounded-lg overflow-hidden shadow-md">
                                    <img src={`http://localhost:4000/${selectedProduct.photo[0].path}`} className="w-full h-64 object-cover" alt={`Product Image`} />
                                </div>
                            )}
                        </div>
                        <div className="accordion-btn mt-4 font-bold  flex justify-between w-full py-2 px-4 text-lg text-left bg-gray-400 rounded-lg mb-4">
                            <span className="text-lg font-bold">Rate:</span>
                            <div className="flex items-center">
                                <span className="mr-2">{selectedProduct.rating.toFixed(1)}</span>
                                {[...Array(5)].map((_, index) => (
                                    <svg
                                        key={index}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 fill-current ${index < selectedProduct.rating ? "text-yellow-600" : "text-white"
                                            }`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() => handleRating(index + 1)}
                                    >
                                        <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                                    </svg>

                                ))}
                            </div>
                        </div>
                        <div className='footer bg-gray-400 py-2 px-4 flex justify-between items-center'>
                            <select className="accordion-btn font-bold  text-left bg-gray-100 rounded-lg" onChange={(e) => setQuantity(e.target.value)}>
                                {[...Array(100).keys()].map((num) => (
                                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                                ))}
                            </select>
                            <p className='mr-48 text-sm font-bold'>Choose Quantity</p>
                        </div>


                        <button className="btn-purchase w-full py-2 px-4 bg-white text-lg text-black font-semibold rounded-lg mt-4" onClick={() => addToCart(selectedProduct._id, quantity)}>ADD TO THE CART</button>
                    </div>
                </>
            )}

            <Footers />
        </div>
    );
};

export default Overview;

