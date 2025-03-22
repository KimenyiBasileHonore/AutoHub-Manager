import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(3);

  useEffect(() => {
    axios.get('http://localhost:4000/api/user/client-list')
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Calculate current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="font-serif mt-16 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-blue-500 mb-4">Registered Clients</h1>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border:gray-400">
        <thead>
          <tr className="bg-gray-900 text-white font-bold">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Full Names
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr 
              key={user._id} 
              className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200'}
            >
              <td className="px-6 py-4 text-black whitespace-no-wrap">{user.names}</td>
              <td className="px-6 py-4 text-black whitespace-no-wrap">{user.address}</td>
              <td className="px-6 py-4 text-black whitespace-no-wrap">{user.phone}</td>
              <td className="px-6 py-4 text-black whitespace-no-wrap">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
        </span>
        <button 
          onClick={nextPage} 
          disabled={currentPage >= Math.ceil(users.length / usersPerPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserList;