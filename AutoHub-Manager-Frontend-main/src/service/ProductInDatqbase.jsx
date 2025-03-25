import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const AdmData = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBoxOpen, setIsBoxOpen] = useState(false);
    const pdfRef = useRef();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/prod/allproduct');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const currentDate = new Date().toLocaleDateString();

            pdf.text(`Product Inventory Report - ${currentDate}`, 10, 10);
            pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
            pdf.save(`Product_Inventory_${currentDate}.pdf`);
        });
    };

    const toggleBox = () => {
        setIsBoxOpen(!isBoxOpen);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Collapsible Box */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                {/* Box Header */}
                <div 
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={toggleBox}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        {isBoxOpen ? (
                            <ChevronUp className="mr-2" size={20} />
                        ) : (
                            <ChevronDown className="mr-2" size={20} />
                        )}
                        Product Inventory Report
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {products.length} Products
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadPDF();
                            }}
                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Download size={16} className="mr-1" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Box Content - Only visible when open */}
                {isBoxOpen && (
                    <div ref={pdfRef} className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white">
                                    <thead>
                                        <tr className="text-left text-gray-600 text-sm font-medium bg-gray-50">
                                    
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Gear Box</th>
                                            <th className="px-4 py-3">Tank</th>
                                            <th className="px-4 py-3">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((product, index) => (
                                            <tr key={product._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                               
                                                <td className="px-4 py-4">{product.name}</td>
                                                <td className="px-4 py-4">{product.price}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        product.status === 'available' ? 'bg-green-100 text-green-800' :
                                                        product.status === 'out of stock' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">{product.gearbox}</td>
                                                <td className="px-4 py-4">{product.tank}</td>
                                                <td className="px-4 py-4 font-bold text-red-500">{product.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdmData;