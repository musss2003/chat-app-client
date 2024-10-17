import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
    const [activeComponent, setActiveComponent] = useState('chatList');

    const handleSetActiveComponent = (component) => {
        setActiveComponent(component);
        console.log('Setting active component:', component);
    }

    return (
        <div className="sidebar-container">
            <div className='sidebar first-part'>
                <ul>
                    <li className={activeComponent === 'userProfile' ? 'active' : ''}>
                        <button
                            onClick={() => handleSetActiveComponent('userProfile')}>
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                    </li>
                    <li className={activeComponent === 'chatList' ? 'active' : ''}>
                        <button
                            onClick={() => handleSetActiveComponent('chatList')}>
                            <FontAwesomeIcon icon={faComments} />
                        </button>
                    </li>
                    <li className={activeComponent === 'searchUser' ? 'active' : ''}>
                        <button
                            onClick={() => handleSetActiveComponent('searchUser')}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </li>
                </ul>
            </div>
            <div className='sidebar second-part'>
                <ul>
                    <li className={activeComponent === 'signOut' ? 'active' : ''}>
                        <button
                            onClick={() => handleSetActiveComponent('signOut')}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;