import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/transactions', icon: '📋', label: 'Transactions' },
  { to: '/reports', icon: '📈', label: 'Reports' },
  { to: '/advisor', icon: '🤖', label: 'AI Advisor' },
];

export function TabBar() {
  return (
    <nav className="tab-bar" id="main-navigation">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'active' : ''}`
          }>
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          <span className="tab-indicator" />
        </NavLink>
      ))}
    </nav>
  );
}
