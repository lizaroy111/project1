import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import Cookies from "js-cookie";
import env from "../config.js";

const ViewResult = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const { userData } = useContext(AuthContext);
  const [data, setData] = useState({ subjects: [] });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSemesterChange = (e) => {
    setSelectedSemester(Number(e.target.value));
  };

  useEffect(() => {
    const token = Cookies.get("userToken");

    if (userData && userData._id && token) {
      axios
        .post(
          `${env.backendHost}/getMarks`,
          { semester: selectedSemester },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setData(response.data);
          setErrorMessage(""); 
        })
        .catch((error) => {
          if (error.response) {
            console.error("Backend responded with an error:", error.response.data);
            if (error.response.status === 404) {
              setData({ subjects: [] });
              setErrorMessage(`No marks found for Semester ${selectedSemester}`);
            }
          } else if (error.request) {
            console.error("No response received:", error.request);
            setErrorMessage("No response from the server.");
          } else {
            console.error("Error setting up request:", error.message);
            setErrorMessage("Error occurred while fetching data.");
          }
        });
    }
  }, [userData, selectedSemester]);

  return (
    <div className="p-4 mt-[7%] text-black">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Semester
        </label>
        <select
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="border rounded-md p-2 w-full text-black"
        >
          <option value={1}>Semester 1</option>
          <option value={2}>Semester 2</option>
          <option value={3}>Semester 3</option>
          <option value={4}>Semester 4</option>
          <option value={5}>Semester 5</option>
          <option value={6}>Semester 6</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Marks</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects && data.subjects.length > 0 ? (
              data.subjects.map((subject, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{subject.sub}</td>
                  <td className="py-2 px-4 border-b">{subject.mark}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b" colSpan={2}>
                  {errorMessage || "No data available for the selected semester"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewResult;
