import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);

            localStorage.setItem('token', res.data.token);

            onLogin(res.data.user);

            navigate('/main');

        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={onSubmit} className='login-form'>
                <input className='login-input' type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                <input className='login-input' type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                <button type="submit">Login</button>
                <div className="links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/register">Register</Link>
                </div>
            </form>
            <footer>
                <p>&copy; 2024 by Mustafa Sinanovic. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Login;