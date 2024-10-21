import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchUser.css'; // Import the CSS file
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const SearchUser = ({ currentUser, onUserSelect, selectedUserId, renewMessages }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

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
    }, [query, renewMessages]);

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
                        onClick={() => {onUserSelect(user); setResults([]); setQuery('');}}
                        className={`result-item ${selectedUserId && selectedUserId === user._id ? 'search-selected' : ''}`}
                    >
                        <div className="search-user-info">
                            <span className="search-user-name">{user.username}</span>
                            <span className="search-last-online">{formatTimeStamp(user.timeStamp)}</span>
                        </div>
                        {user.lastMessage ? (<div className="search-last-message">
                            {user.lastMessage.sender === currentUser._id ? (
                            <span>You: {user.lastMessage.content}</span>
                        ) : (
                            <span>{user.lastMessage.content}</span>
                        )}
                        </div>) : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUser;