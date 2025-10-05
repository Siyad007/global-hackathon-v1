// src/components/layout/MainLayout.jsx (NEW FILE)
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet /> {/* This is where your pages will be rendered */}
      </main>
    </div>
  );
};

export default MainLayout;