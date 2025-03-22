import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    companyName: '', // Updated to store the selected company name
    description: '',
    attachment: [],
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [companyNames, setCompanyNames] = useState([]); // State to store the list of company names

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachment: [...e.target.files],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (key === 'attachment') {
          for (let i = 0; i < formData[key].length; i++) {
            formDataToSend.append('attachment', formData[key][i]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      await axios.post('http://localhost:7070/api/problem/reports', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSubmissionStatus('success');
      alert('Problem report submitted successfully.');
      // Reset form fields
      setFormData({
        firstName: '',
        email: '',
        phone: '',
        companyName: '',
        description: '',
        attachment: [],
      });
    } catch (error) {
      console.error(error);
      setSubmissionStatus('error');
      alert('Error submitting problem report.');
    }
  };

  // Fetch the list of company names from your backend when the component mounts
  useEffect(() => {
    async function fetchCompanyNames() {
      try {
        const response = await axios.get('http://localhost:7070/api/companies'); // Replace with your actual API endpoint
        setCompanyNames(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCompanyNames();
  }, []);

  return (
    <div className="min-h-screen ml-20 flex items-center justify-center bg-blue-200">
      <div className="max-w-md w-full p-6 space-y-4 bg-gray-500 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-indigo-800">Report a Problem</h2>
        {submissionStatus === 'success' ? (
          <div className="text-green-900 font-semibold">Problem report submitted successfully.</div>
        ) : submissionStatus === 'error' ? (
          <div className="text-red-600">Error submitting problem report.</div>
        ) : null}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="firstName" className="block  text-gray-900">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-900">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-900">
              Phone:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-gray-900">
              Company Name:
            </label>
            <select
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="">Select a Company</option>
              {companyNames.map((companyName) => (
                <option key={companyName} value={companyName}>
                  {companyName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-900">
              Problem Description:
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the problem..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="attachment" className="block text-gray-900">
              Attachments:
            </label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              multiple
              onChange={handleFileChange}
              className="w-full mt-2 text-gray-800 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
