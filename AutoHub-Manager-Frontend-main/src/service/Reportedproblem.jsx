import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProblemReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch problem reports from your backend API
    axios.get('http://localhost:7070/api/mifotra/mifotra/receive-reports')
      .then((response) => {
        setReports(response.data.reports);
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-3xl font-semibold text-white mb-4">Problem Reports</h1>
      <div className="overflow-x-auto">
        <div className="min-w-full overflow-auto">
          <table className="bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200'}>
                  <td className="px-6 py-4 whitespace-no-wrap">{report.firstName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{report.email}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{report.phone}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{report.companyName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{report.description}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {report.attachment && report.attachment.map((attachment, index) => (
                      <a key={index} href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Attachment {index + 1}
                      </a>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">{new Date(report.date).toLocaleDateString()}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProblemReportList;
