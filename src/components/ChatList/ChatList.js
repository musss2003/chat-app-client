import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ChatList.css'; // Import the CSS file for styling
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const ChatList = ({ currentUser, onChatSelect, selectedUserId, renewMessages }) => {
    const [chats, setChats] = useState([]);

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

    useEffect(() => {
        if (!currentUser) return;


        fetchChats();
    }, [currentUser, renewMessages]);

    return (
        <div className="chat-list-container">
            <ul className="chat-list">
                {chats.map(chat => {
                    const isSelected = chat.sender._id === selectedUserId || chat.receiver._id === selectedUserId;
                    return (
                        <li
                            key={chat._id}
                            className={`chat-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onChatSelect(chat)}
                        >
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
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatList;