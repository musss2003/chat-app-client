import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const Chat = ({ currentUser, selectedUser, onSendMessage, messages }) => {
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);     // Ref for the last message

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message = {
                sender: currentUser._id,
                receiver: selectedUser._id,
                content: newMessage,
            };
            onSendMessage(message);
            setNewMessage('');
        }
    };

    // Scroll to the bottom of the chat container when messages change
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'nearest'  // Avoid jumping the entire page
            });
        }
    }, [messages]);

    return (
        <div className='chat-wrapper'>
            {selectedUser && (
                <div className="chat-topbar">
                    <div className="user-info">
                        <div className='username'>{selectedUser.username}</div>
                        <div className='last-online'>{formatTimeStamp(selectedUser.timeStamp)}</div>
                    </div>
                </div>
            )}
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
                {/* This div will help ensure scrolling to the bottom */}
                <div ref={messageEndRef} />
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(e);
                        }
                    }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
