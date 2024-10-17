import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchUser.css'; // Import the CSS file
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const SearchUser = ({ currentUser, onUserSelect, selectedUserId }) => {
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

                console.log('Search results:', res.data);
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
                        onClick={() => {onUserSelect(user)}}
                        className={`result-item ${selectedUserId && selectedUserId === user._id ? 'selected' : ''}`}
                    >
                        <div className="user-info">
                            <span className="user-name">{user.username}</span>
                            <span className="last-online">{formatTimeStamp(user.timeStamp)}</span>
                        </div>
                        {user.lastMessage ? (<div className="last-message">
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