export type AdobeAppId = 'ps' | 'ai' | 'pr' | 'ae' | 'xd' | 'id';

export interface Shortcut {
  id: string;
  action: string;
  keys: {
    win: string[];
    mac: string[];
  };
  category: string;
  description?: string;
}

export interface AppData {
  id: AdobeAppId;
  name: string;
  color: string;
  icon: string; // Lucide icon name or initial
  shortcuts: Shortcut[];
}

export type OS = 'win' | 'mac';
