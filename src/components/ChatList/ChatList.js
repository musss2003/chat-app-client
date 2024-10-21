import React, { useEffect } from 'react';
import './ChatList.css'; // Import the CSS file for styling
import { formatTimeStamp } from '../../utils/formatTimeStamp';

const ChatList = ({ currentUser, onChatSelect, selectedUserId, chats }) => {
    
    useEffect(() => {

    }, [chats, selectedUserId]);

    return (
        <div className="chat-list-container">
            <ul className="chat-list">
                {chats.map(chat => {
                    const isSelected = chat.sender._id === selectedUserId || chat.receiver._id === selectedUserId;
                    const hasUnreadMessages = chat.unreadCount > 0;

                    return (
                        <li
                            key={chat.receiver._id}
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
