import React, { useState, useRef, useEffect } from 'react';
import CompanyProblemReports from './Companyrelatedinfo';
import Registeredcompany from '../pages/Sections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faExclamationCircle,
    faBuilding,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState("Reporting problem");
    const mainContentRef = useRef(null);

    const handleLogout = () => {
        navigate('/');
        // Handle logout logic here
    };

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="fixed w-1/4 h-screen bg-cyan-900 flex flex-col">
                <div>
                    <h1 className="text-xl text-white font-bold mt-8 ml-4">
                        MIFOTRA
                        <br />
                        <FontAwesomeIcon
                            icon={faBuilding}
                            size="2x"
                            className="mr-2"
                            aria-label="User Icon"
                        />
                        Company
                    </h1>

                </div>

                <ul className="py-4 ml-2 mt-16 flex-grow">
                    <li
                        className={`py-2 px-6 text-white hover:bg-yellow-700 cursor-pointer ${selectedItem === 'Company related problem' ? 'bg-black' : ''
                            }`}
                        onClick={() => handleItemClick('Company related problem')}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                        Company related problem
                    </li>
                    <li
                        className={`py-2 px-6 text-white hover:bg-yellow-800 cursor-pointer ${selectedItem === 'Registered company' ? 'bg-black' : ''
                            }`}
                        onClick={() => handleItemClick('Registered company')}
                    >
                        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                        Registered company
                    </li>
                </ul>

                {/* Rest of the sidebar content */}
                <div className="flex-grow"></div>
                <div className=" mt-auto p-4 ml-4">
                    <button
                        className="bg-black hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> {/* Sign-out icon */}
                        Log Out
                    </button>
                </div>
            </div>


            {/* Main content */}
            <div className="w-3/4 bg-white ml-80 goooo">
                <div className="bg-gray-100 ml-5 py-4 px-6 fixed top-0 w-3/4 z-10">
                    <h2 className="text-lg font-semibold">{selectedItem || "Content"}</h2>
                </div>

                <div className="p-6" ref={mainContentRef}>
                    {selectedItem === "Company related problem" && (
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="flex flex-wrap -m-4">
                                    <CompanyProblemReports />
                                </div>
                            </div>
                        </section>
                    )}
                    {selectedItem === "Registered company" && (
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="flex flex-wrap -m-4">
                                    <Registeredcompany />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
