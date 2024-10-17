import React, { useEffect, useState } from 'react';
import './MainPage.css'; // Import the CSS file
import SearchUser from '../../components/SearchUser/SearchUser';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatList from '../../components/ChatList/ChatList';
import Chat from '../../components/Chat/Chat';

const MainPage = ({ currentUser }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleChatSelect = (chat) => {
        setSelectedUserId(chat.sender._id === currentUser._id ? chat.receiver._id : chat.sender._id);
    }

    const handleUserSelect = (user) => {
        setSelectedUserId(user._id);
    }

    return (
        <div className="main-page">
            <div className="left-column">
                <Sidebar />
            </div>
            <div className="middle-column">
                <SearchUser currentUser={currentUser} onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
                <ChatList currentUser={currentUser} onChatSelect={handleChatSelect}/>
                {/* <Groups /> Add your Groups component here */}
            </div>
            <div className="right-column">
                {selectedUserId && <Chat currentUser={currentUser} selectedUserId={selectedUserId} />}
            </div>
        </div>
    );
};

export default MainPage;