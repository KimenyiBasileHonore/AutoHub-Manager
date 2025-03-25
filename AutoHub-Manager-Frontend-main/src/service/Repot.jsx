import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const OrdersPage = () => {
  const [processingOrders, setProcessingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const [processingRes, shippedRes, deliveredRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/cart/products-by-status?status=PROCESSING`),
          axios.get(`http://localhost:4000/api/cart/products-by-status?status=SHIPPED`),
          axios.get(`http://localhost:4000/api/cart/products-by-status?status=DELIVERED`)
        ]);

        setProcessingOrders(processingRes.data);
        setShippedOrders(shippedRes.data);
        setDeliveredOrders(deliveredRes.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PROCESSING": return "bg-yellow-100 text-yellow-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">SYSYTEM REPORT</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Processing Orders Card */}
          <div
            onClick={() => openModal('processing')}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 uppercase">PRODUCT IN  Process </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("PROCESSING")}`}>
                {processingOrders.length} orders
              </span>
            </div>
            <p className="text-gray-600">Orders that are being prepared for shipment</p>
          </div>

          {/* Shipped Orders Card */}
          <div
            onClick={() => openModal('shipped')}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 uppercase">Shipped PRODUCT</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("SHIPPED")}`}>
                {shippedOrders.length} orders
              </span>
            </div>
            <p className="text-gray-600">Orders that are on their way to customers</p>
          </div>

          {/* Delivered Orders Card */}
          <div
            onClick={() => openModal('delivered')}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 uppercase  ">Delivered PRODUCT</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("DELIVERED")}`}>
                {deliveredOrders.length} orders
              </span>
            </div>
            <p className="text-gray-600">Orders that have been successfully delivered</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'processing' && (
        <OrderModal
          title="PRODUCT IN PROCESS"
          orders={processingOrders}
          statusColor={getStatusColor("PROCESSING")}
          onClose={closeModal}
        />
      )}

      {activeModal === 'shipped' && (
        <OrderModal
          title="SHIPPED PRODUCT"
          orders={shippedOrders}
          statusColor={getStatusColor("SHIPPED")}
          onClose={closeModal}
        />
      )}

      {activeModal === 'delivered' && (
        <OrderModal
          title="DELIVERED PRODUCT"
          orders={deliveredOrders}
          statusColor={getStatusColor("DELIVERED")}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

const OrderModal = ({ title, orders, statusColor, onClose }) => {
  const modalRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    setIsPrintMode(true); // Activate print mode

    // Give React time to re-render with print mode styles
    setTimeout(() => {
      const input = modalRef.current;

      html2canvas(input, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const currentDate = new Date().toLocaleString();

        // Add title with better styling
        pdf.setFontSize(16);
        pdf.setTextColor(40);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 105, 15, { align: 'center' });

        // Add subtitle with date
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on: ${currentDate}`, 105, 20, { align: 'center' });

        // Add the content image
        pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);

        // Save the PDF
        pdf.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);

        // Reset states after PDF generation
        setIsGeneratingPDF(false);
        setIsPrintMode(false);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        setIsGeneratingPDF(false);
        setIsPrintMode(false);
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden ${isPrintMode ? 'print-mode' : ''}`}
      >
        {/* Header with buttons that will be hidden in print mode */}
        <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${isPrintMode ? 'hidden' : ''}`}>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} mr-4`}>
              {orders.length} orders
            </span>
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className={`mr-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm ${isGeneratingPDF ? 'opacity-75' : ''
                }`}
            >
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-gray-600 text-sm font-medium">
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6 hidden md:table-cell">Email</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6 text-center">Qty</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrderRow key={order._id} order={order} statusColor={statusColor} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Footer with buttons that will be hidden in print mode */}
        <div className={`px-6 py-4 border-t border-gray-200 flex justify-end space-x-4 ${isPrintMode ? 'hidden' : ''}`}>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isGeneratingPDF ? 'opacity-75' : ''
              }`}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const OrderRow = ({ order, statusColor }) => {
  const statusText = order.orderStatus || "N/A";
  const formattedStatus = statusText.charAt(0) + statusText.slice(1).toLowerCase();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {order.user?.names?.charAt(0) || "?"}
            </span>
          </div>
          <div className="ml-4">
            <p className="text-gray-900 font-medium">{order.user?.names || "N/A"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 hidden md:table-cell">
        <p className="text-gray-600">{order.user?.email || "N/A"}</p>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div className="ml-4">
            <p className="text-gray-900 font-medium">{order.productId?.name || "N/A"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">
          {order.quantity || "N/A"}
        </span>
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {formattedStatus}
        </span>
      </td>
    </tr>
  );
};

export default OrdersPage;