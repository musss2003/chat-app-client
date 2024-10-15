import React, { useState } from 'react';
import axios from 'axios';

const SearchUser = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
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

    return (
        <div>
            <h2>Search User</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for users"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map(user => (
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUser;