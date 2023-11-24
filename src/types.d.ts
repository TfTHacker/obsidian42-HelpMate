import type HelpMateAPI from './HelpMateAPI';
import type { Setting } from 'obsidian';

declare global {
  interface Window {
    helpMateAPI?: HelpMateAPI;
  }
}

declare module 'obsidian' {
  export interface PluginManifest {
    helpUrl?: string;
  }
  export interface ThemeManifest {
    name: string;
    helpUrl?: string;
  }
  interface Workspace {
    on(
      name: 'plugin-settings:plugin-control',
      callback: (setting: Setting, manifest: PluginManifest, enabled: boolean) => void
    ): EventRef;
  }
}
