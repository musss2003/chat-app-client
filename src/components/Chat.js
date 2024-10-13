import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('sendMessage', { content: message, sender: 'User1', receiver: 'User2' });
        setMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.content}</div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;