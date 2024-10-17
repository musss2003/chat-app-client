import React, { useState, useEffect } from 'react';
import './Chat.css';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

const Chat = ({ currentUser, selectedUserId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Join the room
        socket.emit('joinRoom', { userId: currentUser._id, selectedUserId });

        // Listen for incoming messages
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Notify the server that the user is online
        socket.emit('userOnline', currentUser._id);

        // Clean up on component unmount
        return () => {
            socket.off('receiveMessage');
        };
    }, [selectedUserId, currentUser._id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message = {
                sender: currentUser._id,
                receiver: selectedUserId,
                content: newMessage,
            };
            socket.emit('sendMessage', message);
            setNewMessage('');
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}>
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="message-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;