import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ChatList = ({ currentUser, onChatSelect }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchChats = async () => {

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/chats`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                    query: { userId: currentUser._id }
                });
                console.log('Fetched chats:', res.data);
                setChats(res.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, [currentUser]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

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