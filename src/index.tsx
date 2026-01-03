import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // تأكد أن لديك ملف CSS أو احذف هذا السطر

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
