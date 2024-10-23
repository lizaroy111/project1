
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminSignin = () => {
  const [Admin, setAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [AdminError, setAdminError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      axios
        .post('http://localhost:3001/api/verifyToken', { token })
        .then((response) => {
          if (response.status === 200) {
            navigate('/admin');
          }
        })
        .catch(() => {
          Cookies.remove('authToken');
        });
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    setAdminError('');
    setPasswordError('');
    setServerError('');

    if (!Admin) {
      setAdminError('Admin is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const onButtonClick = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/adminLogin', {
        adminId: Admin,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set('authToken', token, { expires: 1 }); 
        navigate('/admin');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setServerError('Invalid credentials');
      } else if (error.response && error.response.status === 404) {
        setServerError('No admin found');
      } else {
        setServerError('Internal Server Error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col text-4xl font-bold items-center justify-center mb-6">
        <div>Admin Sign In</div>
      </div>

      <div className="flex flex-col mb-4">
        <input
          value={Admin}
          placeholder="Enter your Admin here"
          onChange={(ev) => setAdmin(ev.target.value)}
          className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
        />
        {AdminError && <label className="text-red-600 text-sm mt-1">{AdminError}</label>}
      </div>

      <div className="flex flex-col mb-4">
        <input
          value={password}
          type="password"
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
        />
        {passwordError && <label className="text-red-600 text-sm mt-1">{passwordError}</label>}
      </div>

      <div className="flex flex-col mb-4">
        <input
          className="h-12 w-96 bg-blue-600 text-white text-lg rounded-lg cursor-pointer"
          type="button"
          onClick={onButtonClick}
          value={'Log in'}
        />
        {serverError && <label className="text-red-600 text-sm mt-1">{serverError}</label>}
      </div>
    </div>
  );
};

export default AdminSignin;
