import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faBuilding, faExclamationCircle,faDesktop } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the sign-out icon
import Registereduser from '../service/Registereduser';
import Registeredcompany from '../pages/Sections';
import ProblemReportList from '../service/Reportedproblem';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Systemreport from '../service/Systemreport';


// import Systemreport from '../service/Systemreport';

export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState("Registered user");
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
            <div className="fixed w-1/4 h-screen bg-yellow-800 flex flex-col">

                <div>
                    <h1 className="text-xl text-black font-bold mt-8 ml-4">
                        MIFOTRA
                        <br />
                        <FontAwesomeIcon icon={faUserCog} size="2x" />Admin
                    </h1>
                </div>

                <ul className="py-4 ml-2 mt-16 flex-grow">
                    <li
                        className={`py-2 px-6 text-black font-bold hover:bg-gray-300 cursor-pointer ${selectedItem === "Registered user" ? "bg-gray-300" : ""
                            }`}
                        onClick={() => handleItemClick("Registered user")}
                    >
                        <FontAwesomeIcon icon={faUserCog} className="mr-2" size="lg" /> {/* User icon */}
                        Registered user
                    </li>
                    <li
                        className={`py-2 px-6 text-black font-bold  hover:bg-gray-300 cursor-pointer ${selectedItem === "Registered company" ? "bg-gray-300" : ""
                            }`}
                        onClick={() => handleItemClick("Registered company")}
                    >
                        <FontAwesomeIcon icon={faBuilding} className="mr-2" size="lg" /> {/* Building icon */}
                        Registered company
                    </li>
                    <li
                        className={`py-2 px-6 text-black font-bold  hover:bg-gray-300 cursor-pointer ${selectedItem === "Reported problem" ? "bg-gray-300" : ""
                            }`}
                        onClick={() => handleItemClick("Reported problem")}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" size="lg" /> {/* Problem icon */}
                        Reported problem
                    </li>
                    <li
                        className={`py-2 px-6 text-black font-bold hover:bg-gray-300 cursor-pointer ${selectedItem === "System report" ? "bg-gray-300" : ""
                            }`}
                        onClick={() => handleItemClick("System report")}
                    >
                        <FontAwesomeIcon icon={faDesktop} className="mr-2" size="lg" />
                        System report
                    </li>
                </ul>

                {/* Rest of the sidebar content */}
                <div className="flex-grow"></div>
                <div className="p-4  ml-4">
                    <button
                        className="bg-blue-900 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
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
                    {selectedItem === "Registered user" && (
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="flex flex-wrap -m-4">
                                    <Registereduser />
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
                    {selectedItem === "Reported problem" && (
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="flex flex-wrap -m-4">
                                    <ProblemReportList />
                                </div>
                            </div>
                        </section>
                    )}
                    {selectedItem === "System report" && (
                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="flex flex-wrap -m-4">
                                    <Systemreport />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
