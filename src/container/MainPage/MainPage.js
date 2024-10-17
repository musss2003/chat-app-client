import React, { useEffect } from 'react';
import './MainPage.css'; // Import the CSS file
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList/ChatList';
import Messages from '../../components/Messages';

const MainPage = ({ currentUser }) => {
    useEffect(() => {
        // Your existing useEffect logic
    }, [currentUser]);

    if (!currentUser) {
        return <div className="lds-dual-ring"></div>
    }

    return (
        <div className="main-page">
            <div className="left-column">
                <Sidebar />
            </div>
            <div className="middle-column">
                <SearchUser />
                <ChatList currentUser={currentUser} />
                {/* <Groups /> Add your Groups component here */}
            </div>
            <div className="right-column">
                {/* <Messages currentUser={currentUser} chat={selectedChat} /> */}
            </div>
        </div>
    );
};

export default MainPage;