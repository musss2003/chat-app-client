import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axios from 'axios';
import io from 'socket.io-client';
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const socket = io(process.env.REACT_APP_API_URL);

const Chat = ({ currentUser, selectedUserId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const chatContainerRef = useRef(null);



    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const responseTwo = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setMessages(response.data);
                setSelectedUser(responseTwo.data);

                // Scroll to bottom after setting messages
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }

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

    useEffect(() => {
        if (chatContainerRef.current) {
            console.log('scrolling');
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
        <div className='chat-wrapper'>
            {selectedUser && <div className="chat-topbar">
                <div className="user-info">
                    <div className='username'>{selectedUser.username}</div>
                    <div className='last-online'>{formatTimeStamp(selectedUser.timeStamp)}</div>
                </div>
            </div>}
            <div className="chat-container">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            {message.content}
                            <div className="message-time">{formatTimeStamp(message.timestamp)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};


export default Chat;