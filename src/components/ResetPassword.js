import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const { token } = useParams();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
            alert('Password has been reset');
        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;