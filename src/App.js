import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute.js';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainPage from './container/MainPage/MainPage.js';
import { io } from 'socket.io-client';



const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const socket = io(process.env.REACT_APP_API_URL); // Adjust the URL as needed

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // res.data contains token and user
                    setCurrentUser(res.data.user);

                    // Notify the server that the user is online
                    socket.emit('userOnline', currentUser._id);

                    // Clean up on component unmount
                    return () => {
                        socket.disconnect();
                    };
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        };

        fetchCurrentUser();
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    return (
        <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/main" element={<ProtectedRoute element={MainPage} currentUser={currentUser} />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default App;