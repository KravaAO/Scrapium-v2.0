import CloseIcon from '../../assets/icons/close-win-icon.svg?react';
import Maximize from '../../assets/icons/maximize-win-icon.svg?react';
import Minimize from '../../assets/icons/minimaze-win-icon.svg?react';

import './WindowControl.scss';

const minimizeWindow: WindowControlEventHandler = () => {
  window.API.minimizeWindow();
};

const maximizeWindow: WindowControlEventHandler = () => {
  window.API.maximizeWindow();
};

const closeWindow: WindowControlEventHandler = () => {
  window.API.closeWindow();
};

export const WindowControl = () => (
  <div className='window-control'>
    <Minimize onClick={minimizeWindow} className='icon icon--medium' />
    <Maximize onClick={maximizeWindow} className='icon icon--medium' />
    <CloseIcon onClick={closeWindow} className='icon icon--medium' />
  </div>
);