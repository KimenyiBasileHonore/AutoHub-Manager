import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import luca from "../pic/luca.jpg";
// Import custom CSS for styling

function CompanySignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessname: '',
        address: '',
        regno: '',
        businessemail: '',
        password: '',
        role: 'VENDOR', // Default role is "company"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/vendor/signup', formData);

           if (response.status === 201) {
                const token = response.data.token; // Assuming the token is returned from the server
                localStorage.setItem('token', token); // Store the token in localStorage
                console.log('User signed up successfully');
                toast.success('Vendor registered successfully');
                navigate('/Vendorlogin');
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
        <div className=" font-serif min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${luca})` }}>
            
            <div className="flex justify-left ml-24 mt-24 w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className='text-center'> <span className="text-2xl font-bold mb-4">Create </span><span className='text-2xl font-bold mb-4 text-blue-700'>account</span></h1>
                    <br />
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="text"
                            name="businessname"
                            placeholder="Business Name"
                            value={formData.businessname}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border rounded bg-white border-2 border-gray-400 hover:border-blue-900 hover:shadow"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border rounded bg-white border-2 border-gray-400 hover:border-blue-900 hover:shadow-md"
                        />
                        <input
                            type="number"
                            name="regno"
                            placeholder="Registration Number"
                            value={formData.regno}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border rounded bg-white border-2 border-gray-400 hover:border-blue-900 hover:shadow-md"
                        />
                        <input
                            type="email"
                            name="businessemail"
                            placeholder="Business Email"
                            value={formData.businessemail}
                            onChange={handleChange}
                             autoComplete="new-email"
                            className="w-full p-2 mb-4 border rounded bg-white border-2 border-gray-400 hover:border-blue-900 hover:shadow-md"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                             autoComplete="new-password"
                            className="w-full p-2 mb-4 border rounded bg-white border-2 border-gray-400 hover:border-blue-900 hover:shadow-md"
                        />
                        <button
                            type="submit"
                            className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 justify-center"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/Vendorlogin" className="text-blue-500 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-blue-500 hover:underline">
                            Back to home page
                        </Link>
                    </div>
                </div>
                <span className='text-white ml-32 font-bold text-4xl  justify-center'>Autohub Manager</span>
            </div>
            <ToastContainer />
        </div>

    );
}

export default CompanySignup;
