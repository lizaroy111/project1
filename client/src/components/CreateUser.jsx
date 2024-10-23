import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is installed
import env from "../config"; // Adjust the path to your config file
import Cookies from 'js-cookie';


const CreateUser = (props) => {
    const [studentName, setStudentName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [password, setpassword] = useState('');
    const [studentNameError, setStudentNameError] = useState('');
    const [registrationNumberError, setRegistrationNumberError] = useState('');
    const [passwordError, setpasswordError] = useState('');

    const navigate = useNavigate();

    const onButtonClick = async () => {
        setStudentNameError('');
        setRegistrationNumberError('');
        setpasswordError('');

        // Basic validation
        if (!studentName) {
            setStudentNameError('Student name is required');
            return;
        }
        if (!registrationNumber) {
            setRegistrationNumberError('Registration number is required');
            return;
        }
        if (!password) {
            setpasswordError('Roll number is required');
            return;
        }

        try {
            const token = Cookies.get("authToken")
            const response = await axios.post(`${env.backendHost}/createUser`, {
                name: studentName,
                registrationNumber: registrationNumber,
                password: password // Assuming password is used as a password
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            console.log('User created:', response.data);
            alert('User created successfully!');
            setStudentName('')
            setpassword('')
            setRegistrationNumber('')
            // navigate('/'); // Redirect to another page (adjust the path as needed)
        } catch (error) {
            console.error('Error creating user:', error.response ? error.response.data : error.message);
            // Handle specific error responses from the server
            if (error.response && error.response.status === 404) {
                setRegistrationNumberError('Registration number is already used');
            } else {
                alert('Failed to create user. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col text-4xl font-bold items-center justify-center mb-6">
                <div>Create Student Account</div>
            </div>

            <div className="flex flex-col mb-4">
                <input
                    value={studentName}
                    placeholder="Enter your student name here"
                    onChange={(ev) => setStudentName(ev.target.value)}
                    className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
                />
                {studentNameError && <label className="text-red-600 text-sm mt-1">{studentNameError}</label>}
            </div>

            <div className="flex flex-col mb-4">
                <input
                    value={registrationNumber}
                    placeholder="Enter your registration number here"
                    onChange={(ev) => setRegistrationNumber(ev.target.value)}
                    className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
                />
                {registrationNumberError && <label className="text-red-600 text-sm mt-1">{registrationNumberError}</label>}
            </div>

            <div className="flex flex-col mb-4">
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setpassword(ev.target.value)}
                    className="h-12 w-96 text-lg border border-gray-400 rounded-lg px-2"
                />
                {passwordError && <label className="text-red-600 text-sm mt-1">{passwordError}</label>}
            </div>

            <div className="flex flex-col mb-4">
                <input
                    className="h-12 w-96 bg-blue-600 text-white text-lg rounded-lg cursor-pointer"
                    type="button"
                    onClick={onButtonClick}
                    value={'Submit'}
                />
            </div>
        </div>
    );
};

export default CreateUser;
