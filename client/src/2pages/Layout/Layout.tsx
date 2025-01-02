import React from 'react';
import { Outlet } from 'react-router';
import Header from '../../3widgets/NavBar/NavBar';
import Sidebar from '../../3widgets/SideBar/SideBar'; 
import { AuthStatus } from '../../4features/auth/model/types';
import { useAppSelector } from '../../6shared/lib/hooks'; 
import Cookie from '../../6shared/ui/Cookie';
import './Layout.css';

export default function Layout(): React.JSX.Element {
  const status = useAppSelector((store) => store.auth.data.status); 

  return (
    <div className="container">
      <div className="header">
        <Header />
      </div>
      <div className="main">
        {status === AuthStatus.authenticated && <Sidebar />} 
        <div className="content">
          <Outlet />
          <Cookie />
        </div>
      </div>
    </div>
  );
}