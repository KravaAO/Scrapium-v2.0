import { useAppSelector } from '../../store/hooks';
import './Tabs.scss';
import { Tab } from '../Tab/Tab';

export const Tabs = () => {
  const tabs = useAppSelector(state => state.tabs.tabs);
  
  return (
    <div className="tab">
      <ul className='tab__list'>
        {tabs.map(tab => (
          <Tab
            key={tab.task.key}
            task={tab.task}
            isActive={tab.isActive}
          />
        ))}
      </ul>
    </div>
  )
};