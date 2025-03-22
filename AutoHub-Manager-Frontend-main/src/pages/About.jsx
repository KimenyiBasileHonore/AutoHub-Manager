import React, { useState } from 'react';
import Navigation from './Navigation';
import logo from '../pic/logo.jpg';

const ProfilePage = () => {
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        email: '',
        message: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);

        try {
            const response = await fetch("http://localhost:4000/api/feedback/feedback", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ Name: '', email: '', message: '' });
            } else {
                console.error('Error submitting feedback:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const toggleDropdown2 = () => {
        setDropdownOpen2(!dropdownOpen2);
    };

    return (
        <div className="font-serif bg-black text-white min-h-screen">
            <Navigation />
            <div className="flex justify-center items-center min-h-screen pt-9">
                <div className="shadow-lg rounded-lg p-8 max-w-3xl w-full bg-gray-900">
   
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <img src={logo} alt="Company Logo" className="w-20 h-20 rounded-full object-cover" />
                            <div>
                                <h1 className="text-2xl font-bold">Akagera Motors</h1>
                                <p className="text-sm">Car selling company</p>
                                <p className="text-sm">Kigali, Rwanda</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={toggleDropdown2} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Quote</button>
                            {dropdownOpen2 && (
                                <form onSubmit={handleSubmit} className="flex flex-col bg-gray-800 text-white rounded-lg shadow-lg p-4">
                                    <input type="text" placeholder="Name" className="border border-gray-300 bg-black text-white rounded-lg px-2 py-1 mb-2" value={formData.Name} onChange={handleChange} name="Name" />
                                    <input type="email" placeholder="Email" className="border border-gray-300 bg-black text-white rounded-lg px-2 py-1 mb-2" value={formData.email} onChange={handleChange} name="email" />
                                    <textarea placeholder="Message" className="border border-gray-300 bg-black text-white rounded-lg px-2 py-1 mb-2" value={formData.message} onChange={handleChange} name="message"></textarea>
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
                                </form>
                            )}
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">View catalog</button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm">5000+ sales</p>
                    </div>
                    <div className="space-y-6">
                        <Card title="Description">
                            <p>Established in 1997, Akagera Motors is the exclusive distributor for Mahindra, Toyota, Mercedes Benz, MCV, Foton & Fuso...</p>
                        </Card>
                        <Card title="Badges">
                            <ul className="list-disc list-inside">
                                <li>Eco-Friendly Badge</li>
                                <li>Quality Assurance Badge</li>
                                <li>Innovation Badge</li>
                                <li>Customer Satisfaction Badge</li>
                                <li>Safety Badge</li>
                            </ul>
                        </Card>
                        <Card title="Address">
                            <p>Kigali, Rwanda</p>
                            <p>Kg 122 st</p>
                        </Card>
                        <Card title="Contacts">
                            <p>info@akagera.motors</p>
                            <p>+250788999992</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, children }) => (
    <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {children}
    </div>
);

export default ProfilePage;
