import React, { useEffect, useState } from 'react';
import './MainPage.css'; // Import the CSS file
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList/ChatList';
import Chat from '../../components/Chat/Chat';
import io from 'socket.io-client';
import axios from 'axios';


const MainPage = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [renewMessages, setRenewMessages] = useState(false);

    const socket = io(process.env.REACT_APP_API_URL);


    const handleChatSelect = (chat) => {
        setRenewMessages(false);
        setSelectedUserId(chat.sender._id === currentUser._id ? chat.receiver._id : chat.sender._id);
    }

    const handleUserSelect = (user) => {
        setRenewMessages(false);
        setSelectedUserId(user._id);
    }

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUserId) return;

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

            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Join the room
        socket.emit('joinRoom', { userId: currentUser._id, selectedUserId });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            setRenewMessages((prev) => prev + 1);
        });

        // Notify the server that the user is online
        socket.emit('userOnline', currentUser._id);

        return () => {
            socket.off('receiveMessage');
        };

    }, [currentUser, selectedUserId, messages.length]);

    const handleSendMessage = (message) => {
        socket.emit('sendMessage', message);
        setRenewMessages((prev) => prev + 1);
    };

    return (
        <div className="main-page">
            <div className="left-column">
                <Sidebar />
            </div>
            <div className="middle-column">
                <SearchUser currentUser={currentUser} onUserSelect={handleUserSelect} selectedUserId={selectedUserId} renewMessages={renewMessages} />
                <ChatList currentUser={currentUser} onChatSelect={handleChatSelect} selectedUserId={selectedUserId} renewMessages={renewMessages} />
                {/* <Groups /> Add your Groups component here */}
            </div>
            <div className="right-column">
                {selectedUserId ? (
                    <Chat currentUser={currentUser} selectedUser={selectedUser} onSendMessage={handleSendMessage} messages={messages}  />
                ) : (
                    <div className="select-user-message">
                        Please select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;