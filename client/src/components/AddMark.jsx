import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import env from "../config.js"
import Cookies from 'js-cookie';

const AddMark = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      const token = Cookies.get('authToken'); 
      const response = await axios.post(
        `${env.backendHost}/getSemStd`,
        { current_sem: selectedSemester },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      console.log(response);
      setStudents(response.data);
      setSelectedStudent(null);
      setSelectedSubject('');
      setMarks('');
      setSearchTerm('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedSemester]);

  const handleSemesterChange = (e) => {
    setSelectedSemester(Number(e.target.value));
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSelectedSubject('');
    setMarks('');
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUploadMarks = async () => {
    if (selectedStudent && selectedSubject && marks) {
      try {
        const token = Cookies.get('authToken');
        console.log('Auth Token:', token);
        console.log('Payload:', {
          registrationNumber: selectedStudent.registrationNumber,
          semester: selectedSemester,
          subject: selectedSubject,
          mark: Number(marks)
        });

        const response = await axios.post(`${env.backendHost}/addMark`, {
          registrationNumber: selectedStudent.registrationNumber,
          semester: selectedSemester,
          subjectName: selectedSubject,
          mark: Number(marks),
        }, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        console.log('Response:', response.data);
        alert(`Marks uploaded for ${selectedStudent.name} (${selectedSubject}: ${marks})`);
        setMarks('');
        setSelectedSubject('');
        fetchStudents();
      } catch (error) {
        console.error('Error uploading marks:', error.response ? error.response.data : error.message);
        alert('Failed to upload marks.');
      }
    } else {
      alert('Please select a student, subject, and enter marks.');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 mt-[5%]">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Semester
        </label>
        <select
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="border rounded-md p-2 w-full"
        >
          <option value={1}>Semester 1</option>
          <option value={2}>Semester 2</option>
          <option value={3}>Semester 3</option>
          <option value={4}>Semester 4</option>
          <option value={5}>Semester 5</option>
          <option value={6}>Semester 6</option>
          <option value={7}>Semester 7</option>
          <option value={8}>Semester 8</option>
        </select>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or registration number"
          className="border rounded-md p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Students</h2>
        <ul className="border rounded-md p-2 max-h-60 overflow-y-auto">
          {filteredStudents.map((student, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedStudent?.registrationNumber === student.registrationNumber ? 'bg-gray-300' : ''}`}
              onClick={() => handleStudentSelect(student)}
            >
              {student.name} (Reg: {student.registrationNumber})
            </li>
          ))}
          {filteredStudents.length === 0 && <li className="p-2 text-gray-500">No students found</li>}
        </ul>
      </div>

      {selectedStudent && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Upload Marks for {selectedStudent.name}</h2>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Subject</option>
              {selectedStudent.remainingSubjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Marks
            </label>
            <input
              type="number"
              value={marks}
              onChange={handleMarksChange}
              className="border rounded-md p-2 w-full"
              placeholder="Enter marks"
            />
          </div>
          <button
            onClick={handleUploadMarks}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Upload Marks
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMark;
