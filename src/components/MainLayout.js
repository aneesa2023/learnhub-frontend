// src/components/MainLayout.js
import React from 'react';
import NavbarComponent from './NavbarComponent';
import Sidebar from './Sidebar';
import '../styles/Home.css'; // reuse layout styles

export default function MainLayout({ children }) {
  return (
    <div className="app-container">
      <NavbarComponent />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          {children}
        </div>
      </div>
    </div>
  );
}
