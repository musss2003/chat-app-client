import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchUser.css'; // Import the CSS file
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const SearchUser = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/search`, {
                    params: { query },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setResults(res.data);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="search-container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for users"
                className="search-input"
            />
            <ul className="results-list">
                {results.map(user => (
                    <li
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`result-item ${selectedUser && selectedUser._id === user._id ? 'selected' : ''}`}
                    >
                        <div className="user-info">
                            <span className="user-name">{user.username}</span>
                            <span className="last-online">{formatTimeStamp(user.timeStamp)}</span>
                        </div>
                        <div className="last-message">Last message: {user.lastMessage}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUser;