import React, { useState } from 'react';
import ChatList from '../../components/ChatList';
import SearchUser from '../../components/SearchUser';
import Messages from '../../components/Messages';
import SearchMessages from '../../components/SearchMessages';
import Sidebar from '../../components/Sidebar/Sidebar';
import './MainPage.css'; // Import CSS for styling

const MainPage = ({ currentUser }) => {
    const [activeComponent, setActiveComponent] = useState('chatList');
    const [selectedChat, setSelectedChat] = useState(null);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setActiveComponent('messages');
    };

    return (
        <div className="main-page">
            <Sidebar setActiveComponent={setActiveComponent} />
            <div className="content">
                {activeComponent === 'chatList' && <ChatList currentUser={currentUser} onChatSelect={handleChatSelect} />}
                {activeComponent === 'searchUser' && <SearchUser />}
                {activeComponent === 'messages' && selectedChat && <Messages currentUser={currentUser} chat={selectedChat} />}
                {activeComponent === 'searchMessages' && <SearchMessages />}
            </div>
        </div>
    );
};

export default MainPage;