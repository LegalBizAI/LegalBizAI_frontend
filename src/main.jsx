// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('VITE_REPO_NAME', import.meta.env.VITE_REPO_NAME);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter
            basename={
                import.meta.env.VITE_REPO_NAME
                    ? `/${import.meta.env.VITE_REPO_NAME}/`
                    : '/'
            }
        >
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
