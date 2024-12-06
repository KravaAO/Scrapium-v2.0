import { Outlet } from 'react-router-dom';
import { SideBar } from '../SideBar/SideBar';
import { TopBar } from '../TopBar/TopBar';

import './Layout.scss';

export const Layout = () => (
  <div className="layout">
    <TopBar />
    <SideBar />
    <div className="content">
      <Outlet />
    </div>
  </div>
);