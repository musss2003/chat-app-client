import React, { useEffect } from 'react';
import './ChatList.css';
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const ChatList = ({ currentUser, onChatSelect, selectedUserId, chats, onlineUsers, typingUserId }) => {

    useEffect(() => {

    }, [chats, selectedUserId, onlineUsers, typingUserId]);

    return (
        <div className="chat-list-container">
            <ul className="chat-list">
                {chats.map(chat => {
                    const isSelected = chat.sender._id === selectedUserId || chat.receiver._id === selectedUserId;
                    const hasUnreadMessages = chat.unreadCount > 0;
                    const otherUserId = chat.sender._id === currentUser._id ? chat.receiver._id : chat.sender._id;
                    const isOnline = onlineUsers[otherUserId] === 'online';
                    const isTyping = typingUserId === otherUserId; // Check if this user is typing

                    return (
                        <li
                            key={chat.receiver._id}
                            className={`chat-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onChatSelect(chat)}
                        >
                            <div className="chat-avatar">
                                {isOnline && <div className="online-indicator"></div>}
                            </div>
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
                                    {isTyping ? (
                                        <span className="typing-indicator">is typing...</span>
                                    ) : chat.sender._id === currentUser._id ? (
                                        <span>You: {chat.content}</span>
                                    ) : (
                                        <span>{chat.content}</span>
                                    )}
                                </div>
                                {hasUnreadMessages && <div className="unread-indicator">{chat.unreadCount}</div>}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatList;
