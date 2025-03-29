import React from 'react';
import NavbarComponent from './NavbarComponent';
import Sidebar from './Sidebar';
import '../styles/Home.css'; 

export default function MainLayout({ children, hideSidebar = false }) {
  return (
    <div className="app-container">
      <NavbarComponent />
      <div className="main-content d-flex">
        {!hideSidebar && <Sidebar />}
        <div className="form-container flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
}
