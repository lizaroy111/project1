
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Admin = () => {
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      axios
        .post(`http://localhost:3001/api/decodeAdmin`, { token: `Bearer ${token}` })
        .then((response) => {
          if (response.status === 200) {
            setAdminId(response.data.adminId);
          }
        })
        .catch((err) => {
          console.error('Failed to decode token:', err);
          setError('Failed to authenticate. Redirecting to sign in...');
          setTimeout(() => navigate('/adminSignin'), 3000);
        });
    } else {
      navigate('/adminSignin');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="text-2xl font-bold mb-4">Welcome, Admin {adminId}</div>
      <div className="flex space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate('/admin/addMarks')}
        >
          Add Marks
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate('/admin/createUser')}
        >
          Create Student
        </button>
      </div>
    </div>
  );
};

export default Admin;
