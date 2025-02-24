import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface MenuItem {
  name: string;
  path: string;
  subPaths?: string[];
}

const mainMenu: MenuItem[] = [
  { 
    name: 'HOME', 
    path: '/', 
    subPaths: ['/dash', '/layout', '/tokens', '/power', '/thermal']
  },
  { 
    name: 'CONFIG', 
    path: '/config',
    subPaths: ['/config/hardware', '/config/presets', '/config/systems']
  },
  { 
    name: 'FINANCIALS', 
    path: '/financials',
    subPaths: ['/financials/balance', '/financials/income', '/financials/costs']
  },
];

const subMenu: MenuItem[] = [
  { name: 'DASH', path: '/dash' },
  { name: 'LAYOUT', path: '/layout' },
  { name: 'TOKENS', path: '/tokens' },
  { name: 'POWER', path: '/power' },
  { name: 'THERMAL', path: '/thermal' },
];

export function Sidebar() {
  const location = useLocation();

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) return true;
    if (item.subPaths) {
      return item.subPaths.some(subPath => location.pathname.startsWith(subPath));
    }
    return false;
  };

  const linkStyles = (isActive: boolean) =>
    clsx(
      'block px-4 py-2 text-sm font-mono transition-colors rounded',
      isActive
        ? 'text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20'
        : 'text-cyber-text hover:text-cyber-blue hover:bg-cyber-blue/5'
    );

  return (
    <div className="fixed w-48 h-screen bg-cyber-dark border-r border-cyber-blue/20">
      {/* Wordmark */}
      <div className="p-4 border-b border-cyber-blue/20">
        <h1 className="font-rajdhani font-semibold text-2xl text-cyber-blue tracking-wider">
          OVERCLOCK
        </h1>
      </div>
      
      <div className="p-4">
        {/* Main Menu */}
        <div className="space-y-2 mb-8">
          {mainMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkStyles(isMenuItemActive(item))}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-cyber-blue/20 my-4" />

        {/* Sub Menu */}
        <div className="space-y-2">
          {subMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkStyles(location.pathname === item.path)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 