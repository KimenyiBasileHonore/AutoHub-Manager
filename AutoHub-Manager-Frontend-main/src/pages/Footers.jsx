import React from 'react';
import playStoreImage from "../pic/playStoreImage.png";
import paymentGatewaysImage from "../pic/paymentGatewaysImage.jpeg";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="bg-gray-900 text-gray-300 py-10 px-6 md:px-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
                    <p>Address: 99 Kigali, Kicukiro, Street 32</p>
                    <p>Phone: +250783842055 / +25073113942</p>
                    <p>Hours: 08:00 - 23:00, Mon - Sat</p>
                </div>
                
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">About</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-400">Delivery Information</a></li>
                        <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-400">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">My Account</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-blue-400">Sign In</a></li>
                        <li><a href="#" className="hover:text-blue-400">View Cart</a></li>
                        <li><a href="#" className="hover:text-blue-400">My Wishlist</a></li>
                        <li><a href="#" className="hover:text-blue-400">Track Order</a></li>
                        <li><a href="#" className="hover:text-blue-400">Help</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Install App</h3>
                    <p>Download from App Store or Google Play</p>
                    <div className="flex space-x-2 my-2">
                        <img src={playStoreImage} alt="Play Store" className="w-32 h-auto" />
                    </div>
                    <p>Secure Payment Gateways</p>
                    <img src={paymentGatewaysImage} alt="Payment Gateways" className="w-40 h-auto mt-2" />
                </div>
            </div>
            
            <div className="flex justify-center space-x-6 mt-6">
                <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebook /></a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaLinkedin /></a>
            </div>
            
            <p className="text-center text-gray-500 mt-6 text-sm">© 2024 Autohub Manager - All Rights Reserved</p>
        </div>
    );
}

export default Footer;