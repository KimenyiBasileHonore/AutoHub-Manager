import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addingcar = () => {
    // Predefined options
    const carOptions = [
        'Toyota Land Cruiser',
        'Toyota Prado',
        'Nissan Patrol',
        'Mitsubishi Pajero',
        'Toyota RAV4',
        'Nissan X-Trail',
        'Subaru Forester',
        'Mazda CX-5',
        'Hyundai Tucson',
        'Kia Sportage'
    ];

    const gearboxOptions = [
        'Automatic',
        'Manual',
        'Semi-Automatic',
        'CVT (Continuously Variable Transmission)'
    ];

    const tankOptions = [
        'Petrol',
        'Diesel',
        'Hybrid',
        'Electric'
    ];

    const colorOptions = [
        'White',
        'Black',
        'Silver',
        'Gray',
        'Red',
        'Blue',
        'Green',
        'Bronze',
        'Navy Blue',
        'Dark Gray'
    ];

    const statusOptions = [
        'NEW',
        'USED',
        'REFURBISHED'
    ];

    // Validation Schema
    const productValidationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Car name is required')
            .oneOf(carOptions, 'Please select a valid car from the options'),
        
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be a positive number')
            .min(1000, 'Price must be at least 1000 RWF')
            .max(500000000, 'Price is too high'),
        
        gearbox: Yup.string()
            .required('Gearbox type is required')
            .oneOf(gearboxOptions, 'Please select a valid gearbox type'),
        
        tank: Yup.string()
            .required('Fuel type is required')
            .oneOf(tankOptions, 'Please select a valid fuel type'),
        
        color: Yup.string()
            .required('Color is required')
            .oneOf(colorOptions, 'Please select a valid color'),
        
        status: Yup.string()
            .required('Status is required')
            .oneOf(statusOptions, 'Please select a valid status'),
        
        basicInfo: Yup.string()
            .required('Basic information is required')
            .min(20, 'Basic information must be at least 20 characters')
            .max(500, 'Basic information cannot exceed 500 characters'),
        
        region: Yup.string()
            .required('Region is required')
            .min(3, 'Region must be at least 3 characters'),
        
        moreDetails: Yup.string()
            .optional()
            .max(1000, 'Additional details cannot exceed 1000 characters'),

        stock: Yup.number()
            .required('Stock number is required')
            .integer('Stock must be a whole number')
            .positive('Stock must be at least 1'),
        
        photo: Yup.mixed()
            .required('At least one photo is required')
            .test('fileSize', 'File too large', (value) => {
                return value && value[0]?.size <= 5000000; // 5MB
            })
            .test('fileType', 'Unsupported file type', (value) => {
                return value && ['image/jpeg', 'image/png', 'image/webp'].includes(value[0]?.type);
            })
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(values).forEach(key => {
                if (key === 'photo') {
                    // Handle multiple file uploads
                    Array.from(values.photo).forEach(file => {
                        formData.append('photo', file);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            const response = await axios.post('http://localhost:4000/api/prod/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            toast.success('Product added successfully!');
            resetForm();
            setSubmitting(false);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Add New Product</h2>
            
            <Formik
                initialValues={{
                    name: '',
                    price: '',
                    gearbox: '',
                    tank: '',
                    color: '',
                    status: '',
                    basicInfo: '',
                    region: '',
                    moreDetails: '',
                    photo: null,
                    stock: ''
                }}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Car Name Dropdown */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Car Name</label>
                                <Field 
                                    as="select" 
                                    name="name" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Car</option>
                                    {carOptions.map(car => (
                                        <option key={car} value={car}>{car}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Price Input */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (RWF)</label>
                                <Field 
                                    type="number" 
                                    name="price" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    placeholder="Enter price"
                                />
                                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Gearbox Dropdown */}
                            <div>
                                <label htmlFor="gearbox" className="block text-sm font-medium text-gray-700">Gearbox Type</label>
                                <Field 
                                    as="select" 
                                    name="gearbox" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Gearbox</option>
                                    {gearboxOptions.map(gearbox => (
                                        <option key={gearbox} value={gearbox}>{gearbox}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="gearbox" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Tank/Fuel Dropdown */}
                            <div>
                                <label htmlFor="tank" className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                <Field 
                                    as="select" 
                                    name="tank" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Fuel Type</option>
                                    {tankOptions.map(tank => (
                                        <option key={tank} value={tank}>{tank}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="tank" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Color Dropdown */}
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                                <Field 
                                    as="select" 
                                    name="color" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Color</option>
                                    {colorOptions.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="color" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Vehicle Status</label>
                                <Field 
                                    as="select" 
                                    name="status" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Number</label>
                                <Field
                                    type="number"
                                    name="stock"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    placeholder="Enter stock quantity"
                                />
                                <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Basic Info Textarea */}
                            <div className="col-span-2">
                                <label htmlFor="basicInfo" className="block text-sm font-medium text-gray-700">Basic Information</label>
                                <Field 
                                    as="textarea" 
                                    name="basicInfo" 
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    placeholder="Enter basic information about the vehicle"
                                />
                                <ErrorMessage name="basicInfo" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Region Input */}
                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
                                <Field 
                                    type="text" 
                                    name="region" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    placeholder="Enter region"
                                />
                                <ErrorMessage name="region" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* More Details Textarea */}
                            <div className="col-span-2">
                                <label htmlFor="moreDetails" className="block text-sm font-medium text-gray-700">Additional Details (Optional)</label>
                                <Field 
                                    as="textarea" 
                                    name="moreDetails" 
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    placeholder="Enter any additional details"
                                />
                                <ErrorMessage name="moreDetails" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Photo Upload */}
                            <div className="col-span-2">
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Vehicle Photos</label>
                                <input 
                                    type="file" 
                                    name="photo"
                                    multiple
                                    onChange={(event) => {
                                        setFieldValue("photo", event.currentTarget.files);
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100"
                                />
                                <ErrorMessage name="photo" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? 'Adding Product...' : 'Add Product'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Addingcar;