import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ setActiveComponent }) => {
    return (
        <div className="sidebar-container">
            <div className='sidebar first-part'>
                <ul>
                    <li>
                        <button onClick={() => setActiveComponent('userProfile')}>
                            <FontAwesomeIcon icon={faUser} /></button>
                    </li>
                    <li>
                        <button onClick={() => setActiveComponent('chatList')}>
                            <FontAwesomeIcon icon={faComments} /></button>
                    </li>
                    <li>
                        <button onClick={() => setActiveComponent('searchUser')}>
                            <FontAwesomeIcon icon={faUser} /></button>
                    </li>
                    <li>
                        <button onClick={() => setActiveComponent('searchMessages')}>
                            <FontAwesomeIcon icon={faSearch} /></button>
                    </li>
                </ul>
            </div>
            <div className='sidebar second-part'>
                <ul>
                    <li>
                        <button onClick={() => setActiveComponent('logout')}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;