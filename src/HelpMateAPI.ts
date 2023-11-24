import type HelpMatePlugin from './main';
import type { HelpMateSettings } from './settings';
import type { HelpForPlugin } from './resources';
import { getPluginHelpList } from './resources';

export enum BrowserMode {
  webView = 'WebView',
  iFrame = 'IFrame',
}

/**
 * Provide a simple API for use with Templater, Dataview and debugging the complexities of various pages.
 * main.ts will attach this to window.helpMateAPI
 */
export default class HelpMateAPI {
  private plugin: HelpMatePlugin;
  settings: HelpMateSettings;
  enableDebugging = {
    webViewBrowser: false,
    iFrameBrowser: true,
  };

  constructor(plugin: HelpMatePlugin) {
    this.plugin = plugin;
    this.settings = plugin.settings;
  }

  log = (logDescription: string, ...outputs: unknown[]): void => {
    console.log('HelpMate: ' + logDescription, outputs);
  };

  activateSidePane = async (url?: string): Promise<void> => {
    url ? await this.plugin.activateView(url) : await this.plugin.activateView();
  };

  getPluginHelpList = (): HelpForPlugin[] => {
    return getPluginHelpList(this.plugin);
  };
}
