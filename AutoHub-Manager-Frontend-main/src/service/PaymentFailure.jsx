// PaymentFailure.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-red-200 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-red-800">Payment Failed</h2>
      <p className="text-center text-gray-700">Oops! Something went wrong with your payment.</p>
      <div className="mt-6">
        <Link to="/Clientdashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
