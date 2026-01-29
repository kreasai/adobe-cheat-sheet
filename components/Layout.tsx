import React, { useState } from 'react';
import { Menu, Search, X, Monitor, Command, Download, Moon, Sun, Heart, Laptop, Printer } from 'lucide-react';
import { Button, Input, Badge } from './ui';
import { AdobeAppId, OS } from '../types';

interface SidebarProps {
  apps: { id: string; name: string; color: string; icon: string }[];
  currentApp: string;
  onAppChange: (id: AdobeAppId) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ apps, currentApp, onAppChange, isOpen, onClose }) => (
  <aside 
    className={`
      fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-950
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0 no-print
    `}
  >
    <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
      <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50">
        <Command className="h-6 w-6 text-blue-600" />
        <span>Adobe Cheats</span>
      </div>
      <button onClick={onClose} className="ml-auto lg:hidden">
        <X className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase">Applications</div>
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => {
            onAppChange(app.id as AdobeAppId);
            onClose();
          }}
          className={`
            flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
            ${currentApp === app.id 
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50' 
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'}
          `}
        >
          <span 
            className="flex h-8 w-8 items-center justify-center rounded border font-bold text-xs" 
            style={{ color: app.color, borderColor: app.color, backgroundColor: `${app.color}15` }}
          >
            {app.icon}
          </span>
          {app.name}
        </button>
      ))}
    </div>
  </aside>
);

interface TopBarProps {
  onMenuClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  os: OS;
  setOS: (os: OS) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  toggleFavoritesMode: () => void;
  isFavoritesMode: boolean;
  exportPdf: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onMenuClick, searchQuery, setSearchQuery, os, setOS, toggleDarkMode, isDarkMode, 
  toggleFavoritesMode, isFavoritesMode, exportPdf
}) => (
  <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 lg:px-6 no-print">
    <button onClick={onMenuClick} className="mr-4 lg:hidden">
      <Menu className="h-5 w-5" />
    </button>
    
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
      <Input 
        placeholder="Search shortcuts (e.g., 'Save', 'Ctrl+S')..." 
        className="pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div className="ml-auto flex items-center gap-2 lg:gap-4">
      <div className="hidden sm:flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button 
          onClick={() => setOS('mac')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${os === 'mac' ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          <Command className="h-3 w-3" /> Mac
        </button>
        <button 
          onClick={() => setOS('win')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${os === 'win' ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          <Monitor className="h-3 w-3" /> Win
        </button>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleFavoritesMode} className={isFavoritesMode ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : ''} aria-label="Favorites">
        <Heart className={`h-5 w-5 ${isFavoritesMode ? 'fill-current' : ''}`} />
      </Button>

      <Button variant="ghost" size="icon" onClick={exportPdf} aria-label="Export PDF">
        <Printer className="h-5 w-5" />
      </Button>
      
      <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle Theme">
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  </header>
);

export { Sidebar, TopBar };
