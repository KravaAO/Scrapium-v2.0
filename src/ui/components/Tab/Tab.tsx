import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { openTab, closeTab } from '../../store/tabSlice';

import TabCloseIcon from '../../assets/icons/tab-close-icon.svg?react';

function getShortTitle(title: any, maxLength = 10) {
  return title.length > maxLength ? title.slice(0, maxLength) : title;
}

export const Tab = ({ task, isActive }: TabItemProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabClick = () => {
    dispatch(openTab(task.key));
    navigate('/parsing-workspace', {state: { key: task.key }});
  };

  const handleTabClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeTab(task.key));
  };

  return (
    <li className={cn('tab__item', { 'tab__item--active': isActive })} onClick={handleTabClick}>
      <p className='tab__text'>
        {getShortTitle(task.data.title)}
      </p>

      {isActive && <TabCloseIcon className='tab__close-icon icon--small' onClick={handleTabClose}/>}
    </li>
  )
};