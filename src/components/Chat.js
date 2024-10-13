import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the back-end server

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Listen for typing events
        socket.on('typing', (username) => {
            setIsTyping(true);
            setTypingUser(username);
            setTimeout(() => {
                setIsTyping(false);
                setTypingUser(''); // Clear the typing user after timeout
            }, 3000); // Duration for which typing indicator is shown
        });

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        // Clean up on component unmount
        return () => {
            socket.off('receiveMessage');
            socket.off('typing'); // Clean up typing listener
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', message); // Send message to the server
            setMessage(''); // Clear input field
        }
    };

    const handleTyping = () => {
        socket.emit('typing', 'User'); // Replace 'User' with the actual username
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <div>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping(); // Emit typing event
                    }} 
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            {isTyping && <div>{typingUser} is typing...</div>} {/* Display typing indicator */}
        </div>
    );
};

export default Chat;
