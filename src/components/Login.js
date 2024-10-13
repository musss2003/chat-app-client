import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);

            console.log(res.data.token);

            localStorage.setItem('token', res.data.token);
            alert('User logged in successfully');
        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;