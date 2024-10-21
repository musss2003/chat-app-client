import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute.js';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainPage from './container/MainPage/MainPage.js';
import socketIOClient from 'socket.io-client';
import './App.css';


const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
                if (token) {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    // res.data contains token and user
                    setCurrentUser(res.data.user);
                    setLoading(false); // Set loading to false after fetching user

                    // Notify the server that the user is online
                    const socket = socketIOClient(process.env.REACT_APP_API_URL);

                    // Clean up on component unmount
                    return () => {
                        socket.disconnect();
                    };
                } else {
                    setLoading(false); // Set loading to false if no token is found
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                setLoading(false); // Set loading to false on error
                navigate('/login');
            }
        };

        fetchCurrentUser();
        
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    if (loading) {
        return <div className="lds-dual-ring"></div>// Render a loading indicator while fetching user
    }

    return (
        <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {currentUser && <Route path="/main" element={<ProtectedRoute element={MainPage} currentUser={currentUser} />} />}
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default App;