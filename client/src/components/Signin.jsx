import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import env from "../config.js";

const Signin = () => {
  const [reg, setReg] = useState('');
  const [password, setPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (token) {
      axios.post(`${env.backendHost}/verifyToken`, { token })
        .then((response) => {
          if (response.status === 200) {
            navigate("/");
          }
        }).catch(() => {
          Cookies.remove("userToken");
        });
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    setRegError('');
    setPasswordError('');
    setServerError('');

    if (!reg) {
      setRegError('Registration number is required');
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
      const response = await axios.post(`${env.backendHost}/loginUser`, {
        registrationNumber: reg,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set('userToken', token, { expires: 1 }); // Store token for 1 day
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setServerError('Invalid credentials');
      } else if (error.response && error.response.status === 404) {
        setServerError('No user found');
      } else {
        setServerError('Internal Server Error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col text-4xl font-bold items-center justify-center mb-6">
        <div>Sign In</div>
      </div>

      <div className="flex flex-col mb-4">
        <input
          value={reg}
          placeholder="Enter your registration number"
          onChange={(ev) => setReg(ev.target.value)}
          className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
        />
        {regError && <label className="text-red-600 text-sm mt-1">{regError}</label>}
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

export default Signin;
