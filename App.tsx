import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, TopBar } from './components/Layout';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { Card, Badge, Button } from './components/ui';
import { APP_DATA } from './data';
import { AdobeAppId, OS, Shortcut } from './types';
import { Heart, Search, Monitor, Command, Info } from 'lucide-react';

const App = () => {
  // State
  const [currentAppId, setCurrentAppId] = useState<AdobeAppId>('ps');
  const [os, setOS] = useState<OS>('mac');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);
  const [activeVirtualKey, setActiveVirtualKey] = useState<string | null>(null);

  // Initialize Theme & Favorites from LocalStorage
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Favorites
    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // Theme Toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Favorites Toggle
  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  // Filtering Logic
  const filteredShortcuts = useMemo(() => {
    const app = APP_DATA[currentAppId];
    if (!app) return [];

    let shortcuts = app.shortcuts;

    // Filter by Favorites Mode
    if (isFavoritesMode) {
      shortcuts = shortcuts.filter(s => favorites.includes(s.id));
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      shortcuts = shortcuts.filter(s => 
        s.action.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) ||
        s.keys[os].some(k => k.toLowerCase().includes(q))
      );
    }

    // Filter by Virtual Keyboard
    if (activeVirtualKey) {
       shortcuts = shortcuts.filter(s => 
         s.keys[os].some(k => {
           // Basic normalization for comparison
           const keyUpper = k.toUpperCase();
           const activeUpper = activeVirtualKey.toUpperCase();
           
           if (activeUpper === 'CMD' && (keyUpper === 'CMD' || keyUpper === 'COMMAND')) return true;
           if (activeUpper === 'CTRL' && (keyUpper === 'CTRL' || keyUpper === 'CONTROL')) return true;
           if (activeUpper === 'OPT' && (keyUpper === 'OPT' || keyUpper === 'ALT')) return true;
           if (activeUpper === 'SHIFT' && keyUpper === 'SHIFT') return true;
           
           return keyUpper === activeUpper;
         })
       );
    }

    return shortcuts;
  }, [currentAppId, searchQuery, os, favorites, isFavoritesMode, activeVirtualKey]);

  // Group by Category
  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {};
    filteredShortcuts.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [filteredShortcuts]);

  const currentAppData = APP_DATA[currentAppId];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      
      <Sidebar 
        apps={Object.values(APP_DATA)} 
        currentApp={currentAppId} 
        onAppChange={setCurrentAppId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          os={os}
          setOS={setOS}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleFavoritesMode={() => setIsFavoritesMode(!isFavoritesMode)}
          isFavoritesMode={isFavoritesMode}
          exportPdf={handleExport}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-6xl">
            
            {/* Header Area */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                  <span style={{ color: currentAppData.color }}>{currentAppData.name}</span>
                  <span className="text-zinc-400 font-light text-2xl">Cheat Sheet</span>
                </h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  {isFavoritesMode ? `Viewing your ${favorites.length} saved shortcuts.` : `Master your workflow with ${filteredShortcuts.length} shortcuts.`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 no-print">
                 <Badge variant="outline">
                   {os === 'mac' ? <Command className="h-3 w-3 mr-1"/> : <Monitor className="h-3 w-3 mr-1"/>}
                   {os === 'mac' ? 'macOS Mode' : 'Windows Mode'}
                 </Badge>
              </div>
            </div>

            {/* Virtual Keyboard */}
            {!isFavoritesMode && (
              <VirtualKeyboard 
                onKeyClick={setActiveVirtualKey} 
                activeKey={activeVirtualKey} 
                platform={os}
              />
            )}

            {/* Shortcuts Grid */}
            {Object.keys(groupedShortcuts).length > 0 ? (
              <div className="space-y-8 pb-12">
                {Object.entries(groupedShortcuts).map(([category, shortcuts]: [string, Shortcut[]]) => (
                  <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      {category}
                      <span className="text-xs font-normal text-zinc-500 ml-auto">{shortcuts.length} items</span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {shortcuts.map((shortcut) => {
                         const isFav = favorites.includes(shortcut.id);
                         return (
                          <Card key={shortcut.id} className="group relative flex flex-col justify-between p-4 hover:shadow-md transition-shadow dark:hover:border-zinc-700">
                            <div className="flex items-start justify-between gap-4">
                              <span className="font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {shortcut.action}
                              </span>
                              <button 
                                onClick={() => toggleFavorite(shortcut.id)}
                                className={`shrink-0 transition-colors ${isFav ? 'text-red-500' : 'text-zinc-300 hover:text-zinc-400 dark:text-zinc-700 dark:hover:text-zinc-600'} no-print`}
                              >
                                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-2 justify-end">
                              {shortcut.keys[os].map((k, i) => (
                                <kbd 
                                  key={i}
                                  className="inline-flex min-w-[24px] items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-bold text-zinc-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.05)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-none"
                                >
                                  {k}
                                </kbd>
                              ))}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                   <Search className="h-6 w-6 text-zinc-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No shortcuts found</h3>
                <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                  We couldn't find any shortcuts matching your criteria. Try adjusting your search, filters, or OS setting.
                </p>
                {activeVirtualKey && (
                  <Button variant="outline" className="mt-4" onClick={() => setActiveVirtualKey(null)}>
                    Clear Keyboard Filter
                  </Button>
                )}
              </div>
            )}
            
            {/* Footer */}
            <footer className="mt-12 border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
              <p>POWERED BY KREASAI.COM</p>
              <p className="mt-1">&copy; {new Date().getFullYear()} Adobe Cheat Sheet. All rights reserved.</p>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;