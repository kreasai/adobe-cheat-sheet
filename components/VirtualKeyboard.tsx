import React from 'react';
import { Card } from './ui';

interface VirtualKeyboardProps {
  onKeyClick: (key: string | null) => void;
  activeKey: string | null;
  platform: 'win' | 'mac';
}

const ROWS = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Opt', 'Cmd', 'Space', 'Cmd', 'Opt', 'Ctrl']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyClick, activeKey, platform }) => {
  
  const handleKeyClick = (key: string) => {
    if (activeKey === key) {
      onKeyClick(null); // Deselect
    } else {
      onKeyClick(key);
    }
  };

  const isSpecialKey = (key: string) => key.length > 1;

  const getKeyLabel = (key: string) => {
    if (platform === 'win') {
      if (key === 'Cmd') return 'Win';
      if (key === 'Opt') return 'Alt';
    }
    return key;
  };

  return (
    <Card className="p-4 hidden xl:block mb-6 overflow-x-auto">
        <div className="flex flex-col gap-1.5 min-w-[800px]">
          {ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5 justify-center">
              {row.map((key, keyIndex) => {
                const label = getKeyLabel(key);
                const isActive = activeKey === label || activeKey === key;
                const widthClass = 
                  key === 'Space' ? 'w-64' :
                  key === 'Enter' || key === 'Shift' || key === 'Caps' || key === 'Tab' || key === 'Backspace' ? 'w-24' :
                  'w-12';
                
                return (
                  <button
                    key={`${rowIndex}-${keyIndex}`}
                    onClick={() => handleKeyClick(key)}
                    className={`
                      h-12 rounded border text-xs font-semibold shadow-sm transition-all
                      flex items-center justify-center
                      ${isActive 
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' 
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700'}
                      ${widthClass}
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-zinc-500">
           Click a key to filter shortcuts using that key. Toggle "Shift/Cmd/Ctrl" to see combinations.
        </div>
    </Card>
  );
};
