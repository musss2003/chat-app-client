import React from 'react';
import './Chat.css'; // Assuming you have some basic styles
import { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ currentUser, selectedUserId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                console.log('Messages:', response.data);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [selectedUserId]);

    return (
        <div className="chat-container">
            {messages.map((message, index) => (
                <div key={index} className="message">
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Chat;