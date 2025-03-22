import { useState, useRef, useEffect } from 'react';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './Maindashboard.css';
import Overview from "./Overview";
import Orders from "./Orders";
import Information from "./Information";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Overview");
  const [clientProfile, setClientProfile] = useState(null); // State to store client profile data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State to manage modal visibility
  const mainContentRef = useRef(null);

  // Fetch client profile data on component mount
  useEffect(() => {
    const fetchClientProfile = async () => {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        navigate('/'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/user/client/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientProfile(response.data); // Set the client profile data
      } catch (error) {
        console.error("Error fetching client profile:", error);
        localStorage.removeItem('token'); // Clear the token if the request fails
        navigate('/'); // Redirect to login
      }
    };

    fetchClientProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token saved in localStorage
    navigate('/ClientLogin'); // Redirect to the homepage or any other page
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when modal opens
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="font-serif container mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">Autohub Manager</h1>
      <div className="flex justify-between items-center">
        <ul className="lg:flex lg:gap-x-12 mt-4 ml-20">
          <li
            className={`text-2xl font-bold ${selectedItem === 'Overview' ? 'border-b-2 border-black pb-2' : 'text-gray-500'
              }`}
            onClick={() => handleItemClick('Overview')}
          >
            Overview
          </li>
          <li
            className={`text-2xl font-bold ${selectedItem === 'Orders' ? 'border-b-2 border-black pb-2' : 'text-gray-500'
              }`}
            onClick={() => handleItemClick('Orders')}
          >
            Cart
          </li>
          <li
            className={`text-2xl font-bold ${selectedItem === 'Information' ? 'border-b-2 border-black pb-2' : 'text-gray-500'
              }`}
            onClick={() => handleItemClick('Information')}
          >
            Orders
          </li>
        </ul>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-2xl font-bold text-gray-900 hover:bg-red-300 hover:text-white m-3 cursor-pointer"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul>
                <li
                  onClick={openProfileModal}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  View Profile
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
            {clientProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-lg">{clientProfile.names}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-lg">{clientProfile.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-lg">{clientProfile.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg">{clientProfile.email}</p>
                </div>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
            <button
              onClick={closeProfileModal}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Your dashboard content goes here */}
      <div className="w-full flex mt-8">
        <div className="flex flex-wrap -m-4">
          {selectedItem === "Overview" && (
            <Overview />
          )}
          {selectedItem === "Orders" && (
            <Orders />
          )}
          {selectedItem === "Information" && (
            <Information />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;