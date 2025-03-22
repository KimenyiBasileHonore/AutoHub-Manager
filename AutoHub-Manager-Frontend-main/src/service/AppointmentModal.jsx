import React, { useState } from 'react';
import './AppointmentModal.css';
import axios from 'axios';

const AppointmentModal = ({ isOpen, onClose, productId }) => {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [popUpMessage, setPopUpMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/cart/book-appointment', {
                productId,
                date,
                location,
                phoneNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                }
            });
            setPopUpMessage('Appointment booked successfully!');
            console.log('Appointment booked successfully', response.data);
        } catch (error) {
            setPopUpMessage('Error booking appointment.');
            console.error('Error booking appointment:', error);
        }
    };

    const handleClosePopUp = () => {
        setPopUpMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {popUpMessage && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>{popUpMessage}</p>
                        <button className="popup-button" onClick={handleClosePopUp}>Close</button>
                    </div>
                </div>
            )}
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Book Test Drive</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Date:
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </label>
                        <label>
                            Location:
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </label>
                        <label>
                            Phone Number:
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </label>
                        <button type="submit">Book Appointment</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AppointmentModal;
