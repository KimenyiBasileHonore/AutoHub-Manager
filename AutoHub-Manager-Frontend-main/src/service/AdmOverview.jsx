import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import up from '../pic/up.png';
import money from '../pic/money.png';
import gearshift from '../pic/gearshift.png';
import fuel from '../pic/fuel.png';

Chart.register(ArcElement, Tooltip, Legend);

const Admoverview = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [topSellingProduct, setTopSellingProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersResponse = await axios.get('http://localhost:4000/api/cart/count-all-cart-products');
                const productsResponse = await axios.get('http://localhost:4000/api/prod/product-count');
                const clientsResponse = await axios.get('http://localhost:4000/api/user/count-clients');
                const topProductResponse = await axios.get('http://localhost:4000/api/cart/top-selling-product');

                setTotalOrders(ordersResponse.data.totalQuantity);
                setTotalProducts(productsResponse.data.totalProducts);
                setTotalClients(clientsResponse.data.totalClients);
                setTopSellingProduct(topProductResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const calculatePercentage = (part, total) => {
        if (total === 0) return 0;
        return ((part / total) * 100).toFixed(2);
    };

    const totalEntities = totalOrders + totalProducts + totalClients;
    const ordersPercentage = calculatePercentage(totalOrders, totalEntities);
    const clientsPercentage = calculatePercentage(totalClients, totalEntities);
    const productsPercentage = calculatePercentage(totalProducts, totalEntities);

    const data = {
        labels: ['Orders', 'Clients', 'Products'],
        datasets: [
            {
                data: [totalOrders, totalClients, totalProducts],
                backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Distribution of Orders, Clients, and Products',
            },
        },
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div className="font-serif mt-8 ml-8 p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-semibold text-blue-500 mb-4">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-200 p-4 rounded shadow flex flex-col items-center">
                    <div className="text-green-500 text-3xl mb-2 flex items-center">
                        <span>{ordersPercentage}%</span>
                        <img src={up} className='h-16 w-12' alt="Up arrow" />
                    </div>
                    <div className="text-xl font-semibold">{totalOrders}+ Orders</div>
                </div>
                <div className="bg-gray-200 p-4 rounded shadow flex flex-col items-center">
                    <div className="text-green-500 text-3xl mb-2 flex items-center">
                        <span>{clientsPercentage}%</span>
                        <img src={up} className='h-16 w-12' alt="Up arrow" />
                    </div>
                    <div className="text-xl font-semibold">{totalClients}+ Visits</div>
                </div>
                <div className="bg-gray-200 p-4 rounded shadow flex flex-col items-center">
                    <div className="text-green-500 text-3xl mb-2 flex items-center">
                        <span>{productsPercentage}%</span>
                        <img src={up} className='h-16 w-12' alt="Up arrow" />
                    </div>
                    <div className="text-xl font-semibold">{totalProducts}+ Products</div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="bg-gray-400 p-4 rounded shadow flex-1 h-[32rem]">
                    <h3 className="text-lg font-bold text-black mb-2">Akagera's Statistics</h3>
                    <p className="text-sm text-black ">{getCurrentDate()}</p>
                    <div className="my-4 flex justify-center mt-8">
                        <Pie data={data} options={options} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow flex-1 flex flex-col justify-end mt-36 lg:mt-0">
                    <h3 className="text-lg font-semibold mb-2 text-blue-500">Top Selling Car</h3>
                    <div>
                        {topSellingProduct ? (
                            <div className="bg-gray-400 rounded-lg overflow-hidden shadow-md" key={topSellingProduct.productDetails._id}>
                                <div className='bg-gray-400 py-2 px-4 flex justify-between items-center'>
                                    <span className='text-black font-bold uppercase'>{topSellingProduct.productDetails.name}</span>
                                    <button className="rounded-full text-white text-sm py-1 px-4" style={{ backgroundColor: topSellingProduct.productDetails.status === 'NEW' ? '#3182ce' : '#e53e3e' }}>{topSellingProduct.productDetails.status}</button>
                                </div>
                                <div className="p-4 cursor-pointer">
                                    <div onClick={() => openModal(topSellingProduct.productDetails)}>
                                        {topSellingProduct.productDetails.photo && topSellingProduct.productDetails.photo.length > 0 && (
                                            <div className="border rounded-lg overflow-hidden shadow-md">
                                                <img src={`http://localhost:4000/${topSellingProduct.productDetails.photo[0].path}`} className="w-full h-32 object-cover" alt={`Product Image`} />
                                            </div>
                                        )}
                                        <div className="details mt-4">
                                            <div className="lg:flex text-center">
                                                <div className="item">
                                                    <img src={money} alt="price" className="w-9 h-9 inline" />
                                                    <span className="font-bold text-md ml-2 text-gray-900">{topSellingProduct.productDetails.price}</span>
                                                </div>
                                                <div className="item">
                                                    <img src={gearshift} alt="gearbox" className="w-9 h-9 inline ml-2" />
                                                    <span className="font-bold text-md ml-2 text-gray-900">{topSellingProduct.productDetails.gearbox}</span>
                                                </div>
                                                <div className="item">
                                                    <img src={fuel} alt="tank" className="w-9 h-9 inline ml-2" />
                                                    <span className="font-bold text-md ml-2 text-gray-900">{topSellingProduct.productDetails.tank}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mb-4 items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`h-5 w-5 fill-current ${index < topSellingProduct.productDetails.rating ? "text-yellow-600" : "text-gray-400"}`}
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <polygon points="10,0 13,7 20,7 15,12 17,20 10,16 3,20 5,12 0,7 7,7" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Loading top selling product...</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow flex items-center">
                    <img src="path-to-buyer1-image" alt="Buyer 1" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <h4 className="text-lg font-semibold">Avery Howard</h4>
                        <p className="text-green-500 text-xl">+87,800</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                    <img src="path-to-buyer2-image" alt="Buyer 2" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <h4 className="text-lg font-semibold">Yessica Christy</h4>
                        <p className="text-green-500 text-xl">+87,800</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                    <img src="path-to-buyer3-image" alt="Buyer 3" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <h4 className="text-lg font-semibold">Nellie French</h4>
                        <p className="text-green-500 text-xl">+87,800</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                    <img src="path-to-buyer4-image" alt="Buyer 4" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <h4 className="text-lg font-semibold">Anne Wallace</h4>
                        <p className="text-green-500 text-xl">+87,800</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admoverview;
