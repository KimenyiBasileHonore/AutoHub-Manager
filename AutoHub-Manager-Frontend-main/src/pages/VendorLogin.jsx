import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import luca from "../pic/luca.jpg";

function CompanyLogin() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        businessemail: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/vendor/login', formData);
            if (response.data && response.data.token) {
                const { token, role, userId } = response.data; // Extract userId from response
                localStorage.setItem('token', token); // Store token
                localStorage.setItem('userId', userId); // Store userId
                console.log('Token:', token);
                console.log('User logged in successfully');
                toast.success('User logged in successfully');
    
                // Navigate based on the role
                if (role === 'ADMIN') {
                    navigate('/adminpage');
                } else {
                    navigate('/Vendordashboard');
                }
            } else {
                console.error('Invalid credentials');
                setErrorMessage('Invalid credentials');
            }
        } catch (error) {
            console.error('Network error:', error);
            setErrorMessage('Email or password is not correct. Please try again later.');
        }
    };
    

    return (
        <div className="font-serif min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${luca})` }}>
            <div className="flex justify-left ml-24 mt-24 w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className='text-center'> <span className="text-2xl font-bold mb-4">Vendor </span><span className='text-2xl font-bold mb-4 text-blue-700'>Login</span></h1>
                    <br />
                    {errorMessage && (
                        <div className="text-red-500 text-center mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="businessemail"
                                placeholder="Email"
                                value={formData.businessemail}
                                onChange={handleChange}
                                autoComplete="new-email"
                                className="w-80 p-2 mb-4 border-2 border-gray-400 rounded"
                            /><br />
                            <input
                                type="password"
                                 name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="w-80 p-2 mb-4 border-2 border-gray-400 rounded"
                            /><br />
                            <button
                                type="submit"
                                className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Log In
                            </button>
                            <div className="mt-4">
                                <Link to="/Vendorsignup" className="flex items-center text-blue-500 hover:underline">
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to Sign Up
                                </Link>
                            </div>
                            <div className="mt-4 text-center">
                                <Link to="/" className="text-blue-500 hover:underline">
                                    Back to home page
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <span className='text-white ml-32 font-bold text-4xl justify-center'>Autohub Manager</span>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CompanyLogin;