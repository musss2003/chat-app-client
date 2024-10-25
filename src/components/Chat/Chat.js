import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { formatTimeStamp } from '../../utils/formatTimeStamp';
import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL);


const Chat = ({ currentUser, selectedUser, onSendMessage, messages, onlineUsers, typingUserId }) => {
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null); // Ref for the last message
    const inputRef = useRef(null); // Reference for the input element
    const [isTyping, setIsTyping] = useState(false); // State to track typing status
    const typingTimeoutRef = useRef(null); // Ref for typing timeout


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message = {
                sender: currentUser._id,
                receiver: selectedUser._id,
                content: newMessage,
                read: false, // New messages are initially unread
            };

            // Emit message via socket but don't update messages locally
            await onSendMessage(message);

            // Clear input
            setNewMessage('');
            socket.emit('stopTyping', { senderId: currentUser._id, receiverId: selectedUser._id });
        }
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { senderId: currentUser._id, receiverId: selectedUser._id });
        }
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('stopTyping', { senderId: currentUser._id, receiverId: selectedUser._id });
        }, 3000);
    };

    // Scroll to the bottom of the chat container when messages change
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // Avoid jumping the entire page
            });
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }

        const markMessagesAsRead = async () => {
            if (messages.length > 0 && messageEndRef.current) {
                // Mark messages as read in db and emit to the server
                socket.emit('markMessagesAsRead', {
                    userId: currentUser._id,
                    selectedUserId: selectedUser._id,
                });
            }
        };

        markMessagesAsRead();

    }, [currentUser._id, messages, onlineUsers, selectedUser._id, typingUserId]);

    const isSelectedUserOnline = onlineUsers[selectedUser?._id] === 'online';


    return (
        <div className="chat-wrapper">
            {selectedUser && (
                <div className="chat-topbar">
                    <div className="user-info">
                        <div className="username">{selectedUser.username}</div>
                        <div className={`last-online ${isSelectedUserOnline ? 'online' : ''}`}>

                            {isSelectedUserOnline ? 'Online' : formatTimeStamp(selectedUser.timeStamp)}
                            {(typingUserId === selectedUser._id) && <div className="typing-indicator">{selectedUser.username} is typing...</div>}
                        </div>
                    </div>
                </div>
            )}
            <div className="chat-container">
                {messages.map((message, index) => (
                    <div
                        key={`${message._id}-${index}`}
                        className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            {message.content}
                            <div className="message-time">{formatTimeStamp(message.timestamp)}</div>
                        </div>
                    </div>
                ))}
                {/* This div ensures scrolling to the bottom */}
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
                        } else {
                            handleTyping();
                        }
                    }}
                    ref={inputRef} // Attach the reference here
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
