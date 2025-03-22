import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import Addingproduct from './Addingproduct';
import UpdateModal from './UpdateModal';

const AdmData = () => {
    const [products, setProducts] = useState([]);
    const [displayQuestionTypePage, setDisplayQuestionTypePage] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        axios.get('http://localhost:4000/api/prod/allproduct')
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Next and Previous page handlers
    const nextPage = () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleUpdateClick = (product) => {
        setSelectedProduct(product);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setIsUpdateModalOpen(false);
    };

    const handleDeleteClick = async (productId) => {
        try {
            await axios.delete(`http://localhost:4000/api/prod/product/${productId}`);
            const updatedProducts = products.filter((product) => product._id !== productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleQuestionTypeClick = () => {
        setDisplayQuestionTypePage(true);
    };

    const handleBackToListClick = () => {
        setDisplayQuestionTypePage(false);
    };

    return (
        <div className='font-serif container mx-auto px-4 py-8 '>
            {!displayQuestionTypePage ? (
                <>
                    <div className="mt-8 pdf-button-container flex justify-end">
                        <button className="pdf-button -right bg-blue-500 text-xm" onClick={handleQuestionTypeClick}>
                            New product +
                        </button>
                    </div>

                    <div className="font-serif container mx-auto px-4  items-left">
                        <h1 className="text-2xl font-semibold text-blue-500 mb-4">Product database</h1>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white shadow-md rounded-lg  ">
                                <thead>
                                    <tr className=" text-black">
                                        <th className="px-2 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Car</th>
                                        <th className="px-2 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Name</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Price</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracing-wider">Status</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Gear box</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Tank</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Stock</th>
                                        <th className="px-4 py-3 border-b border-black text-left text-xm font-medium  font-semibold tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product, index) => (
                                        <tr key={product._id} className={index % 2 === 0 ? '' : 'bg-white hover:bg-gray-200'}>
                                            <td className="px-4 py-4 whitespace-no-wrap">
                                                <div className="flex items-center">
                                                    {product.photo && product.photo.length > 0 && (
                                                        <div className="flex items-center">
                                                            {product.photo.map((photo, index) => (
                                                                <img key={index} src={`http://localhost:4000/${photo.path}`} className="h-10 w-10 object-cover mr-2" alt={`Product Image ${index}`} />
                                                            ))}
                                                            <span>{product.car}</span>
                                                        </div>
                                                    )}
                                                    <span>{product.car}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-no-wrap">{product.name}</td>
                                            <td className="px-4 py-4 whitespace-no-wrap">{product.price}</td>
                                            <td className="px-4 py-4 whitespace-no-wrap">{product.status}</td>
                                            <td className="px-4 py-4 whitespace-no-wrap">{product.gearbox}</td>
                                            <td className="px-4 py-4 whitespace-no-wrap">{product.tank}</td>
                                            <td className="px-4 py-4 font-bold text-red-500">{product.stock}</td>
                                            <td className="px-4 py-4 whitespace-no-wrap">
                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => handleDeleteClick(product._id)}>Delete</button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-no-wrap">
                                                <div className="flex items-center">
                                                    <span className="mr-2">{product.rating.toFixed(1)}</span>
                                                    {[...Array(5)].map((_, index) => (
                                                        <svg
                                                            key={index}
                                                            className={`h-5 w-5 fill-current ${index < product.rating ? "text-yellow-600" : "text-gray-400"}`}
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center mt-4 space-x-4">
                                <button 
                                    onClick={prevPage} 
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                >
                                    Previous
                                </button>
                                
                                <span className="text-gray-700">
                                    Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
                                </span>
                                
                                <button 
                                    onClick={nextPage} 
                                    disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                                    className={`px-4 py-2 rounded ${currentPage === Math.ceil(products.length / itemsPerPage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <button className="pdf-button -right bg-blue-500 text-xm" onClick={handleBackToListClick}> Back to car List</button>
                    <Addingproduct selectedProduct={selectedProduct} />
                </div>
            )}
        </div>
    );
}

export default AdmData;