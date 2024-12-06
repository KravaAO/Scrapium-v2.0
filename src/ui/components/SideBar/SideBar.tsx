import { SideBarList } from '../SideBarList/SideBarList';

import './SideBar.scss';

import LogoIcon from '../../assets/icons/logo-icon.svg?react';

export const SideBar = () => (
  <div className="sidebar">
    <LogoIcon className='sidebar__logo'/>
    <SideBarList />
  </div>
);