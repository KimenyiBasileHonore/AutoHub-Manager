import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import vishal from '../pic/vishal.jpg';
import axios from 'axios';

function SignupForm() {
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const [formData, setFormData] = useState({
        names: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        role: 'CLIENT',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/client/signup', formData);
            if (response.status === 201) {
                const token = response.data.token; // Assuming the token is returned from the server
                localStorage.setItem('token', token); // Store the token in localStorage
                console.log('User signed up successfully');
                toast.success('Client registered successfully');
                navigate('/ClientLogin');
            } else {
                console.error('Unexpected response status:', response.status);
                toast.error('An unexpected error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Network error. Please try again later.');
        }
    };

    return (
        <div className="font-serif min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${vishal})` }}>
            <div className="flex justify-left ml-24 mt-24 w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className='text-center'> 
                        <span className="text-2xl font-bold mb-4">Create </span>
                        <span className='text-2xl font-bold mb-4 text-blue-700'>account</span>
                    </h1>
                    <br />
                    <form onSubmit={handleSubmit} className="pr-4" autoComplete="off"> {/* Disable autocomplete for the entire form */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="names"
                                placeholder="Names"
                                value={formData.names}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                autoComplete="off" // Disable autocomplete for this field
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                autoComplete="off" // Disable autocomplete for this field
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="number"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                autoComplete="off" // Disable autocomplete for this field
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                autoComplete="new-email" // Use "new-email" to prevent autofill
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                autoComplete="new-password" // Use "new-password" to prevent autofill
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/clientlogin" className="text-blue-500 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-blue-500 hover:underline">
                            Back to home page
                        </Link>
                    </div>
                </div>
                <span className='text-white ml-32 font-bold text-4xl justify-center'>Autohub Manager</span>
                <ToastContainer />
            </div>
        </div>
    );
}

export default SignupForm;