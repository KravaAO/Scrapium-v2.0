import { Tabs } from '../Tabs/Tabs';
import { WindowControl } from '../WindowControl/WindowControl';
import './TopBar.scss';

export const TopBar = () => (
  <div className="topbar">
    <Tabs />
    <WindowControl />
  </div>
);
