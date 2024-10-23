import React, { createContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Signin from "../src/components/Signin.jsx";
import ViewResult from "./components/ViewResult.jsx";
import Admin from "./components/Admin.jsx";
import CreateUser from "./components/CreateUser.jsx";
import AdminSignin from "./components/AdminSignin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AddMark from "./components/AddMark.jsx";
import axios from "axios";
import env from "./config.js"

export const AuthContext = createContext();

const App = () => {
  const [userData, setUserData] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (token) {
      axios
        .post(`${env.backendHost}/decodeUser`, { token: `Bearer ${token}` })
        .then((response) => {
          if (response.status === 200) {
            setIsAuthenticated(true);
            setUserData(response.data)
          }
          else
            Cookies.remove("userToken");
        }).catch(() => {
          Cookies.remove("userToken");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("userToken");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, setIsAuthenticated, handleLogout }}>
      <Header />
      <Routes>
        
        <Route exact
          path="/"
          element={<ProtectedRoute type="A" element={Hero} />}
        />

        <Route exact
          path="/signin"
          element={<Signin />}
        />

        <Route exact
          path="/viewresult"
          element={<ProtectedRoute type="A" element={ViewResult} />}
        />

        <Route exact
          path="/adminSignin"
          element={<ProtectedRoute element={AdminSignin} />}
        />
        <Route
          exact
          path="/admin"
          element={<ProtectedRoute type="B" element={Admin} />}
        />
        <Route
          exact
          path="/admin/createUser"
          element={<ProtectedRoute type="B" element={CreateUser} />}
        />
        <Route
          exact
          path="/admin/addMarks"
          element={<ProtectedRoute type="B" element={AddMark} />}
        />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
};

export default App;
