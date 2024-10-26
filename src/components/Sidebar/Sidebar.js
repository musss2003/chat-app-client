import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ handleClick, activeComponent, sidebarOpen, onClose }) => {


    return (
        <div className="sidebar-container">
            {sidebarOpen && <button className='sidebar-close-button' onClick={onClose}>X</button>}
            <div className='sidebar first-part'>
                <ul>
                    <li className={activeComponent === 'userProfile' ? 'active' : ''}>
                        <button
                            onClick={() => handleClick('userProfile')}>
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                    </li>
                    <li className={activeComponent === 'chat' ? 'active' : ''}>
                        <button
                            onClick={() => handleClick('chat')}>
                            <FontAwesomeIcon icon={faComments} />
                        </button>
                    </li>
                    <li className={activeComponent === 'searchUser' ? 'active' : ''}>
                        <button
                            onClick={() => handleClick('searchUser')}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </li>
                </ul>
            </div>
            <div className='sidebar second-part'>
                <ul>
                    <li className={activeComponent === 'signOut' ? 'active' : ''}>
                        <button
                            onClick={() => handleClick('signOut')}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;