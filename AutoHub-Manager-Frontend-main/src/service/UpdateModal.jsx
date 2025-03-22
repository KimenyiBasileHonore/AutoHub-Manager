import React from 'react';

const UpdateModal = ({ isOpen, onClose, onUpdate, product }) => {
    const [updatedProduct, setUpdatedProduct] = React.useState(product || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    return (
        <>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex  items-center">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    <div className="modal-content bg-white p-8 rounded-lg shadow-md max-w-md">
                        <span className="close absolute top-0 right-0 mr-4 mt-2 text-gray-600 cursor-pointer" onClick={onClose}>&times;</span>
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Basic Information</h2>
                        <div className="accordion">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                                <input type="text" id="name" name="name" value={updatedProduct.name || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
                                <input type="text" id="price" name="price" value={updatedProduct.price || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="gearbox" className="block text-sm font-medium text-gray-700">Gearbox:</label>
                                <input type="text" id="gearbox" name="gearbox" value={updatedProduct.gearbox || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="basicInfo" className="block text-sm font-medium text-gray-700">Basic Information:</label>
                                <input type="text" id="basicInfo" name="basicInfo" value={updatedProduct.basicInfo || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region:</label>
                                <input type="text" id="region" name="region" value={updatedProduct.region || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color:</label>
                                <input type="text" id="color" name="color" value={updatedProduct.color || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="moreDetails" className="block text-sm font-medium text-gray-700">More Details:</label>
                                <input type="text" id="moreDetails" name="moreDetails" value={updatedProduct.moreDetails || ''} onChange={handleChange} className="mt-1 p-1 border border-gray-300 rounded-sm w-full" />
                            </div>
                            {/* Add other input fields for updating product details */}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={() => onUpdate(updatedProduct)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Update</button>
                            <button onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateModal;