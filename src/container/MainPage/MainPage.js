import React, { useState, useEffect } from 'react';
import './MainPage.css'; // Import the CSS file
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList';
import Messages from '../../components/Messages';

const MainPage = ({ currentUser, setActiveComponent, handleChatSelect, selectedChat }) => {
    useEffect(() => {
        // Your existing useEffect logic
    }, [currentUser]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-page">
            <div className="left-column">
                <Sidebar setActiveComponent={setActiveComponent} />
            </div>
            <div className="middle-column">
                <SearchUser />
                <ChatList currentUser={currentUser} onChatSelect={handleChatSelect} />
                {/* <Groups /> Add your Groups component here */}
            </div>
            <div className="right-column">
                {/* <Messages currentUser={currentUser} chat={selectedChat} /> */}
            </div>
        </div>
    );
};

export default MainPage;