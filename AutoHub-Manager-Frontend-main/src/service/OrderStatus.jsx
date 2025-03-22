import React from 'react';
import './OrderStatus.css';
import truck from "../pic/truck.png";

const OrderStatus = ({ status }) => {
    const statusStages = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
    const statusIndex = statusStages.indexOf(status);

    return (
        <div className="order-status-container">
            {statusStages.map((stage, index) => (
                <div key={stage} className={`status-item ${index <= statusIndex ? 'active' : ''} ${index === statusIndex ? 'current' : ''}`}>
                    {index === statusIndex && <img src={truck} alt="Truck Icon" className="truck-icon" />}
                    <span className="status-text">{stage}</span>
                    {index < statusStages.length - 1 && <span className={`arrow ${index < statusIndex ? 'active-arrow' : ''}`}>→</span>}
                </div>
            ))}
        </div>
    );
};

export default OrderStatus;
