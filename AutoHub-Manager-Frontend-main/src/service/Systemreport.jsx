import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import "./Maindashboard.css";
import download from "../pic/download.png"

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [companyCount, setCompanyCount] = useState(0);
    const [problemCount, setProblemCount] = useState(0);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', options)
    };

    useEffect(() => {
        // Fetch and set the user count
        axios.get('http://localhost:7070/api/mifotrareport/user-count')
            .then((response) => {
                setUserCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching user count:', error);
            });

        // Fetch and set the company count
        axios.get('http://localhost:7070/api/mifotrareport/company-count')
            .then((response) => {
                setCompanyCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching company count:', error);
            });

        // Fetch and set the problem report count
        axios.get('http://localhost:7070/api/mifotrareport/report-count')
            .then((response) => {
                setProblemCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching problem report count:', error);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* <h1 className="text-3xl font-semibold text-black mb-4">System Report</h1> */}
            <div className="pdf-button-container">
                <button className="pdf-button" onClick={handlePrint}>Download</button>
            </div>
            <div className="printable-content" ref={componentRef}>
                <br/><br/><br/>
                <div className='center'>
                    <h1>REPUBLIC OF RWANDA</h1>
                    <div className="icyi">
                        <div className="center-logo">
                            <img
                                src={download}
                                className="w-20 icyi rounded-lg"
                                alt=""
                            />
                        </div>
                    </div>
                    <h1>MINISTRY OF PUBLIC SERVICE AND LABOUR</h1>
                </div>
                <br />
                <hr className='custom-hr' style={{ fontSize: '8rem' }} />

                <br /><br />
                <h1 className='center text-bold' >WORKFORCE MONITORING AND EVALUATION MANAGEMENT SYSTEM</h1>
                <br />
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-400 text-white">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-100">
                            <td className="px-6 py-4 whitespace-no-wrap">Registered Users</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{userCount}</td>
                        </tr>
                        <tr className="bg-gray-200">
                            <td className="px-6 py-4 whitespace-no-wrap">Registered Companies</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{companyCount}</td>
                        </tr>
                        <tr className="bg-gray-100">
                            <td className="px-6 py-4 whitespace-no-wrap">Problem Reports</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{problemCount}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ marginTop: '30rem', textAlign: 'center' }}>
                <p>Kigali, Rwanda Done on</p><br /> {formattedDate}
            </div>
            </div>
        </div>
    );
}

export default Dashboard;
