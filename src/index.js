import React from 'react';
import ReactDOM from 'react-dom/client';  // Import 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create the root using ReactDOM.createRoot
const root = ReactDOM.createRoot(rootElement);

// Render your app using root.render()
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);