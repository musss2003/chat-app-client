import React, { useEffect, useState } from 'react';
import './MainPage.css';
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList/ChatList';
import Chat from '../../components/Chat/Chat';
import io from 'socket.io-client';
import axios from 'axios';
import UserProfile from '../../components/UserProfile/UserProfile';
const socket = io(process.env.REACT_APP_API_URL);



const MainPage = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({}); // State to keep track of online users
    const [typingUserId, setTypingUserId] = useState(null); // State to track who is typing
    const [activeComponent, setActiveComponent] = useState('chat');


    const handleSetActiveComponent = (component) => {
        setActiveComponent(component);
        if (component === 'signOut') {
            localStorage.removeItem('token'); // Remove token from storage
            window.location.href = '/login'; // Navigate to login page
        }
    };

    const updateUserStatus = (userId, status) => {
        setOnlineUsers(prevState => ({
            ...prevState,
            [userId]: status
        }));
    };


    // Handle selecting a chat from the chat list
    const handleChatSelect = (chat) => {
        setSelectedUserId(chat.sender._id === currentUser._id ? chat.receiver._id : chat.sender._id);
    };

    // Handle selecting a user from search
    const handleUserSelect = (user) => {
        setSelectedUserId(user._id);
    };

    // Fetch messages and handle socket events
    useEffect(() => {

        // Notify the server that the user is online
        socket.emit('userOnline', currentUser._id);

        socket.on('updateUserStatus', ({ userId, status }) => {
            // Update the UI to reflect the user's online status
            updateUserStatus(userId, status);
        });

        // Join the room when a specific chat is selected
        socket.emit('joinRoom', { userId: currentUser._id, selectedUserId });


        socket.on('typing', async ({ senderId }) => {
            setTypingUserId(senderId); // Ensure selectedUser is set before using it
            console.log(`${selectedUserId} is typing...`);
        });

        socket.on('stopTyping', ({ senderId }) => {
            setTypingUserId(null);
            console.log(`${selectedUserId} stopped typing.`);
        });

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
            fetchChats(); // Fetch the updated chat list
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup: Leave room and remove socket listeners on component unmount
        return () => {
            socket.off('receiveMessage'); // Remove the listener to prevent duplicate handling
            socket.off('userOnline'); // Remove online listener
            socket.off('updateUserStatus'); // Remove offline listener
            socket.off('typing');
            socket.off('stopTyping');
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
                <Sidebar handleClick={handleSetActiveComponent} activeComponent={activeComponent} />
            </div>
            <div className="middle-column">
                <SearchUser currentUser={currentUser} onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
                <ChatList currentUser={currentUser} onChatSelect={handleChatSelect} selectedUserId={selectedUserId} chats={chats} onlineUsers={onlineUsers} typingUserId={typingUserId} />
            </div>
            <div className="right-column">
                {(activeComponent === 'userProfile') ? (
                    <UserProfile user={currentUser} />
                ) : ((activeComponent === 'chat') && selectedUser) ? (
                    <Chat currentUser={currentUser} selectedUser={selectedUser} onSendMessage={handleSendMessage} messages={messages} onlineUsers={onlineUsers} typingUserId={typingUserId} />
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
