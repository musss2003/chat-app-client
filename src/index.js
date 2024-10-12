import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' instead
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot

root.render(<App />); // Use root.render() instead of ReactDOM.render()
