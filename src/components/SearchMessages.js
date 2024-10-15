import React, { useState } from 'react';
import axios from 'axios';

const SearchMessages = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/search`, {
                params: { query },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setResults(res.data);
        } catch (error) {
            console.error('Error searching messages:', error);
        }
    };

    return (
        <div>
            <h2>Search Messages</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for messages"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map(message => (
                    <li key={message._id}>{message.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchMessages;