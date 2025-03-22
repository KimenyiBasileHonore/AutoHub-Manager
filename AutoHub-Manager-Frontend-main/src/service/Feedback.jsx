import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import "../pages/Service.css";
import { useReactToPrint } from 'react-to-print';

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    // Fetch feedback data from the backend API
    axios.get("http://localhost:4000/api/feedback/feedback")
      .then((response) => {
        setFeedbackList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
      });
  }, []);

  const markFeedbackAsSeen = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/feedback/feedback/${id}/mark-seen`);
      const updatedFeedbackList = feedbackList.map((feedback) => {
        if (feedback._id === id) {
          return { ...feedback, isSeen: true };
        }
        return feedback;
      });
      setFeedbackList(updatedFeedbackList);
    } catch (error) {
      console.error("Error marking feedback as seen:", error);
    }
  };

  const markFeedbackAsUnseen = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/feedback/feedback/${id}/mark-unseen`);
      const updatedFeedbackList = feedbackList.map((feedback) => {
        if (feedback._id === id) {
          return { ...feedback, isSeen: false };
        }
        return feedback;
      });
      setFeedbackList(updatedFeedbackList);
    } catch (error) {
      console.error("Error marking feedback as unseen:", error);
    }
  };

  return (
    <div className="font-serif mt-16">
      <div className="pdf-button-container flex justify-end">
        <button className="pdf-button p-right bg-blue-500" onClick={handlePrint}>Download</button>
      </div>
      <h2 className="text-3xl font-semibold text-blue-500 mb-4">Feedback</h2>
      <div className="printable-content" ref={componentRef}>

        
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: '#6B46C1', color: 'white' }}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"> Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submission Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table Data - Replace this with dynamic data from your backend */}
            {feedbackList.map((feedback) => (
              <tr key={feedback.id}>
                <td className="px-6 py-4 whitespace-no-wrap">{feedback.Name}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{feedback.email}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <textarea
                    className="w-full h-24 resize-none border border-gray-600 p-2"
                    value={feedback.message}
                    readOnly
                  />
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">{new Date(feedback.submissionDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {!feedback.isSeen ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => markFeedbackAsSeen(feedback._id)}
                    >
                      Viewed
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => markFeedbackAsUnseen(feedback._id)}
                    >
                      Unseen
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
