import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ChatList.css'; // Import the CSS file for styling
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const ChatList = ({ currentUser, onChatSelect }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/chats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setChats(res.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, [currentUser]);

    return (
        <div className="chat-list-container">
            <ul className="chat-list">
                {chats.map(chat => (
                    <li key={chat._id} className="chat-item" onClick={() => onChatSelect(chat)}>
                        <div className="chat-avatar"></div>
                        <div className="chat-details">
                            <div className="chat-header">
                                <div className="chat-user">
                                    {chat.sender._id === currentUser._id ? (
                                        <span>{chat.receiver.username}</span>
                                    ) : (
                                        <span>{chat.sender.username}</span>
                                    )}
                                </div>
                                <div className="chat-timestamp">
                                    {formatTimeStamp(chat.timestamp)}
                                </div>
                            </div>
                            <div className="chat-content">
                                {chat.sender._id === currentUser._id ? (
                                    <span>You: {chat.content}</span>
                                ) : (
                                    <span>{chat.content}</span>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;