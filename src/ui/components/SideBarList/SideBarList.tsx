import { CustomLink } from '../CustomLink/CustomLink';

import AddIcon from '../../assets/icons/add-icon.svg?react';
import ListIcon from '../../assets/icons/list-icon.svg?react';
import SignIcon from '../../assets/icons/sign-icon.svg?react';
import SettingsIcon from '../../assets/icons/settings-icon.svg?react';


const sidebarData = {
  nav: [
    {
      items: [
        {
          to: '/add-task',
          icon: AddIcon,
          text: "Add task",
        },
        {
          to: '/task-list',
          icon: ListIcon,
          text: "Task List",
        },
      ]
    },
    {
      items: [
        {
          to: '/authorization',
          icon: SignIcon,
          text: "Sign in",
        },
        {
          to: '/settings',
          icon: SettingsIcon,
          text: "Settings",
        }
      ]
    }
  ]
};

export const SideBarList = () => (
  <nav className='sidebar__nav'>
    {sidebarData.nav.map((section, index) => (
      <ul key={index} className="sidebar__list">
        {section.items.map((item, itemIndex) => (
          <CustomLink key={itemIndex} to={item.to}>
            <li className='sidebar__item'>
              <item.icon className='icon icon--medium' />
              <p className="sidebar__text">{item.text}</p>
            </li>
          </CustomLink>
        ))}
      </ul>
    ))}
  </nav>
);