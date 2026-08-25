import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { iosAudioUnlock } from './services/audio/iOSAudioUnlock.js';
// Prime audio context listeners on iOS / iPad
iosAudioUnlock.init();
// Register Service Worker for offline PWA operation
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PROD : true)) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then((reg) => {
            console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
            .catch((err) => {
            console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
