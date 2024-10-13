import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
            alert('Password reset email sent');
        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Send Reset Email</button>
        </form>
    );
};

export default ForgotPassword;