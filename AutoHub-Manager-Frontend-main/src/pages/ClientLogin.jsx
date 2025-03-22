import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import vishal from '../pic/vishal.jpg';

function LoginForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/client/login', formData);
            console.log('Server Response:', response.data);
    
            if (response.data && response.data.token) {
                console.log('User logged in successfully');
                const { token, userId } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId); // Store the userId in localStorage
                console.log('User logged in successfully');
                toast.success('User logged in successfully');
                navigate('/Clientdashboard');
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
        <div className="font-serif min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${vishal})` }}>
            <div className="flex justify-left ml-24 mt-24 w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className='text-center'> <span className="text-2xl font-bold mb-4">Client </span><span className='text-2xl font-bold mb-4 text-blue-700'>Login</span></h1>
                    <br />
                    {errorMessage && (
                        <div className="text-red-500 text-center mb-4">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex">
                        <form onSubmit={handleSubmit} className="w-full pr-4">
                            <div className="mb-4 ">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="new-email"
                                    className="w-full px-3 py-2 border  rounded border-gray-400 focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:border-blue-900 bg-white border-2 border-gray-300 hover:border-blue-900 hover:shadow-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Log In
                            </button>
                            <div className="mt-4">
                                <Link to="/Clientsignup" className="flex items-center text-blue-500 hover:underline">
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
                    <span className='text-white ml-32 font-bold text-4xl  justify-center'>Autohub Manager</span>
                </div>
                <ToastContainer />
            </div>
            );
}

            export default LoginForm;
