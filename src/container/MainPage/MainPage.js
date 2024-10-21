import React, { useEffect, useState } from 'react';
import './MainPage.css';
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList/ChatList';
import Chat from '../../components/Chat/Chat';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router';
const socket = io(process.env.REACT_APP_API_URL);



const MainPage = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    // Handle selecting a chat from the chat list
    const handleChatSelect = (chat) => {
        setSelectedUserId(chat.sender._id === currentUser._id ? chat.receiver._id : chat.sender._id);
    };

    // Handle selecting a user from search
    const handleUserSelect = (user) => {
        setSelectedUserId(user._id);
    };

    useEffect(() => {


    });

    // Fetch messages and handle socket events
    useEffect(() => {

        if (!currentUser) return;

        // Join the room when a specific chat is selected
        if (selectedUserId) {
            socket.emit('joinRoom', { userId: currentUser._id, selectedUserId });
        } else{
            socket.emit('joinRoomAlone', { userId: currentUser._id});
        }

        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/chats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setChats(res.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();

        socket.on('refreshChatList', () => {
            console.log('Refreshing chat list');    
            fetchChats();
        });

        if (!currentUser || !selectedUserId) return;

        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${selectedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setMessages(response.data);
                setSelectedUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Clear any previous 'receiveMessage' listener before setting up a new one
        socket.off('receiveMessage');
        socket.on('receiveMessage', (message) => {
            console.log('Received message:', message);
            fetchChats(); // Fetch the updated chat list
            setMessages((prevMessages) => [...prevMessages, message]);
        });


        // Notify the server that the user is online
        socket.emit('userOnline', currentUser._id);

        // Cleanup: Leave room and remove socket listeners on component unmount
        return () => {
            socket.off('receiveMessage'); // Remove the listener to prevent duplicate handling
            socket.emit('leaveRoom', { userId: currentUser._id, selectedUserId });
        };
    }, [currentUser, selectedUserId]);

    // Handle sending messages
    const handleSendMessage = async (message) => {
        // Emit the message to the server via socket
        socket.emit('sendMessage', message);
    };

    return (
        <div className="main-page">
            <div className="left-column">
                <Sidebar />
            </div>
            <div className="middle-column">
                <SearchUser currentUser={currentUser} onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
                <ChatList currentUser={currentUser} onChatSelect={handleChatSelect} selectedUserId={selectedUserId} chats={chats} />
            </div>
            <div className="right-column">
                {selectedUser ? (
                    <Chat currentUser={currentUser} selectedUser={selectedUser} onSendMessage={handleSendMessage} messages={messages} />
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
