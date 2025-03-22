import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  Users, 
  Briefcase, 
  Download, 
  LogOut, 
  RefreshCw, 
  Mail, 
  Phone, 
  Map, 
  Building, 
  Shield, 
  Bell, 
  Calendar,
  Clock,
  ChevronDown,
  PieChart,
  BarChart,
  TrendingUp
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AdminPage() {
    const [clients, setClients] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const pdfRef = useRef();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const clientsResponse = await axios.get('http://localhost:4000/api/user/client-list');
                const vendorsResponse = await axios.get('http://localhost:4000/api/user/vendors');
                
                setClients(clientsResponse.data.users);
                setVendors(vendorsResponse.data.vendors);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredClients = clients.filter(client =>
        client.names?.toLowerCase().includes(search.toLowerCase()) ||
        client.email?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredVendors = vendors.filter(vendor =>
        vendor.businessname?.toLowerCase().includes(search.toLowerCase()) ||
        vendor.businessemail?.toLowerCase().includes(search.toLowerCase())
    );

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const currentDate = new Date().toLocaleDateString();

            pdf.text(`AKAGERA Admin Dashboard - ${currentDate}`, 10, 10);
            pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
            pdf.save(`AKAGERA_Admin_Dashboard_${currentDate}.pdf`);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const clientsResponse = await axios.get('http://localhost:4000/api/user/client-list');
            const vendorsResponse = await axios.get('http://localhost:4000/api/user/vendors');
            
            setClients(clientsResponse.data.users);
            setVendors(vendorsResponse.data.vendors);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 text-black">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">AKAGERA</h2>
                    <div className="mb-6 text-center">

                        <h3 className="text-lg font-medium">Admin Panel</h3>
                    </div>
                </div>
                <nav className="mt-6">
                    <div 
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'dashboard' ? 'bg-gray-200' : 'hover:bg-indigo-300'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <PieChart className="mr-3" size={20} />
                        <span>Dashboard</span>
                    </div>
                    <div 
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'clients' ? 'bg-gray-200' : 'hover:bg-indigo-300'}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        <Users className="mr-3" size={20} />
                        <span>Clients</span>
                    </div>
                    <div 
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'vendors' ? 'bg-gray-200' : 'hover:bg-indigo-300'}`}
                        onClick={() => setActiveTab('vendors')}
                    >
                        <Briefcase className="mr-3" size={20} />
                        <span>Internal Staff</span>
                    </div>
                    <div 
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'reports' ? 'bg-gray-200' : 'hover:bg-indigo-300'}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <BarChart className="mr-3" size={20} />
                        <span>Reports</span>
                    </div>
                    <div 
                        className="flex items-center px-4 py-3 cursor-pointer text-red-300 hover:bg-indigo-700 mt-24"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3" size={20} />
                        <span>Logout</span>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell className="text-gray-500 cursor-pointer" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">3</span>
                        </div>
                        <div className="flex items-center cursor-pointer bg-gray-100 p-2 rounded-full">
                            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-2">
                                A
                            </div>
                            <span className="mr-1 text-sm font-medium">Admin</span>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Overview</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>{new Date().toLocaleDateString()}</span>
                                <Clock size={14} className="ml-3 mr-1" />
                                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={refreshData} 
                                className="flex items-center bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                <RefreshCw size={16} className="mr-2" /> Refresh
                            </button>
                            <button 
                                onClick={downloadPDF} 
                                className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                            >
                                <Download size={16} className="mr-2" /> Export PDF
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div ref={pdfRef}>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg text-white">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm">Total Clients</p>
                                            <h3 className="text-2xl font-bold">{clients.length}</h3>
                                            <p className="text-white/80 text-xs flex items-center mt-1">
                                                <TrendingUp size={12} className="mr-1" /> +5% this month
                                            </p>
                                        </div>
                                        <div className="h-12 w-12 bg-blue-400/30 rounded-full flex items-center justify-center">
                                            <Users size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg text-white p-4 rounded-lg shadow-lg ">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm">Internal Staff</p>
                                            <h3 className="text-2xl font-bold">{vendors.length}</h3>
                                            <p className="text-white/80 text-xs flex items-center mt-1">
                                                <TrendingUp size={12} className="mr-1" /> +2% this month
                                            </p>
                                        </div>
                                        <div className="h-12 w-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                                            <Briefcase size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="flex items-center bg-white p-3 rounded-lg shadow-md mb-6">
                                <Search className="text-gray-500 ml-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search clients or staff..." 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    className="ml-2 w-full p-2 outline-none"
                                />
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="flex border-b">
                                    <button 
                                        className={`flex-1 py-4 font-medium ${activeTab === 'clients' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                        onClick={() => setActiveTab('clients')}
                                    >
                                        <span className="flex items-center justify-center">
                                            <Users size={16} className="mr-2" /> Clients
                                        </span>
                                    </button>
                                    <button 
                                        className={`flex-1 py-4 font-medium ${activeTab === 'vendors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                        onClick={() => setActiveTab('vendors')}
                                    >
                                        <span className="flex items-center justify-center">
                                            <Briefcase size={16} className="mr-2" /> Internal Staff
                                        </span>
                                    </button>
                                </div>

                                <div className="p-4">
                                    {activeTab === 'clients' && (
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
                                                <Users className="mr-2" size={20} /> Client Directory
                                            </h2>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white">
                                                    <thead>
                                                        <tr className="bg-indigo-50 text-indigo-800">
                                                            <th className="py-3 px-4 text-left">Name</th>
                                                            <th className="py-3 px-4 text-left">Email</th>
                                                            <th className="py-3 px-4 text-left">Phone</th>
                                                            <th className="py-3 px-4 text-left">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredClients.map((client, index) => (
                                                            <tr key={client._id || index} className="hover:bg-indigo-50 border-b">
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center mr-3">
                                                                        {client.names?.charAt(0) || 'U'}
                                                                    </div>
                                                                    {client.names || 'Unknown'}
                                                                </td>
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <Mail size={16} className="mr-2 text-gray-500" />
                                                                    {client.email || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <Phone size={16} className="mr-2 text-gray-500" />
                                                                    {client.phone || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex space-x-2">
                                                                        <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                                                            <Mail size={16} />
                                                                        </button>
                                                                        <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                                                                            <Phone size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {filteredClients.length === 0 && (
                                                            <tr>
                                                                <td colSpan="4" className="py-4 text-center text-gray-500">
                                                                    No clients found matching your search.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'vendors' && (
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4 text-emerald-600 flex items-center">
                                                <Briefcase className="mr-2" size={20} /> Internal Staff Directory
                                            </h2>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white">
                                                    <thead>
                                                        <tr className="bg-emerald-50 text-emerald-800">
                                                            <th className="py-3 px-4 text-left">Business Name</th>
                                                            <th className="py-3 px-4 text-left">Email</th>
                                                            <th className="py-3 px-4 text-left">Address</th>
                                                            <th className="py-3 px-4 text-left">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredVendors.map((vendor, index) => (
                                                            <tr key={vendor._id || index} className="hover:bg-emerald-50 border-b">
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mr-3">
                                                                        <Building size={16} />
                                                                    </div>
                                                                    {vendor.businessname || 'Unknown'}
                                                                </td>
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <Mail size={16} className="mr-2 text-gray-500" />
                                                                    {vendor.businessemail || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4 flex items-center">
                                                                    <Map size={16} className="mr-2 text-gray-500" />
                                                                    {vendor.address || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex space-x-2">
                                                                        <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                                                            <Mail size={16} />
                                                                        </button>
                                                                        <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                                                                            <Phone size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {filteredVendors.length === 0 && (
                                                            <tr>
                                                                <td colSpan="4" className="py-4 text-center text-gray-500">
                                                                    No staff members found matching your search.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;