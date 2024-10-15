import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = ({ currentUser, onChatSelect }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setChats(res.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div>
            <h2>Chat List</h2>
            <ul>
                {chats.map(chat => (
                    <li key={chat._id} onClick={() => onChatSelect(chat)}>
                        {chat.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;