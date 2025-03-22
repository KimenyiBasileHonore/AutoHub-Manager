import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch registered users from your backend API
    axios.get('http://localhost:7070/api/mifotra/mifotra/allusers')
      .then((response) => {
        setUsers(response.data.users);
        // setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        // setLoading(false);
      });
  }, []);


  return (
    <div className="container mx-auto px-4 py-8 bg-blue-200">
      <h1 className="text-3xl font-semibold text-black mb-4">Registered Users</h1>

      {/* {loading ? (
        <p>Loading...</p>
      ) : ( */}
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
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
            {users.map((user, index) => (
              <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white hover:bg-gray-200'}>
                <td className="px-6 py-4 whitespace-no-wrap">{user.firstName}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{user.lastName}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{user.nID}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      {/* )} */}
    </div>
  );
}

export default UserList;
