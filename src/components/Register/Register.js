import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);

            alert('Registration successful! Please log in.');

            navigate('/login');

        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <div className='wrapper'>
            <form className='register-form' onSubmit={onSubmit}>
                <input className='register-input' type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                <input className='register-input' type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                <input className='register-input' type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                <input className='register-input' type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
                <button type="submit">Register</button>
                <div className="links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
            <footer>
                <p>&copy; 2024 by Your Name. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Register;