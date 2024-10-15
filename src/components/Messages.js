import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

const Messages = ({ currentUser, chat }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${chat._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        socket.on('receiveMessage', (message) => {
            if (message.chat === chat._id) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [chat]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            content,
            sender: currentUser._id,
            chat: chat._id,
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/messages`, messageData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            socket.emit('sendMessage', messageData);
            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h2>Chat with {chat.name}</h2>
            <div>
                {messages.map((message) => (
                    <div key={message._id}>
                        <strong>{message.sender === currentUser._id ? 'You' : message.sender.username}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message"
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Messages;