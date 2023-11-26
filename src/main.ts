import type { Setting, PluginManifest, WorkspaceLeaf } from 'obsidian';
import { Plugin } from 'obsidian';
import { HelpMateSettingTab } from './UI/settingsTab/SettingsTab';
import type { HelpMateSettings } from './settings';
import { DEFAULT_SETTINGS } from './settings';
import { HelpMateView, VIEW_TYPE_HELPMATE } from './UI/sidepane/HelpMateView';
import { createCodeBlock } from './UI/codeblock';
import HelpMateAPI from './HelpMateAPI';
import integrationWithSettings from './UI/settingsTab/integrationWithSettings';
import { initializeCommands } from './commands';

export default class HelpMatePlugin extends Plugin {
  APP_NAME = this.manifest.name;
  APP_ID = this.manifest.id;
  HELPMATE_API: HelpMateAPI = new HelpMateAPI(this);
  settings: HelpMateSettings = DEFAULT_SETTINGS;
  icon = 'life-buoy';
  ribbonIcon!: HTMLElement;

  async onload() {
    console.log('loading ' + this.APP_NAME);
    await this.loadSettings();

    this.addSettingTab(new HelpMateSettingTab(this.app, this));

    this.registerView(VIEW_TYPE_HELPMATE, (leaf) => new HelpMateView(leaf, this));

    // API access to HelpMate for Templater, Dataviewjs and the console debugger
    window.helpMateAPI = this.HELPMATE_API;

    this.registerMarkdownCodeBlockProcessor('helpmate', (source, el, ctx) => {
      createCodeBlock(this, source, el, ctx);
    });

    if (this.settings.ribbonIconEnabled) this.showRibbonButton();

    initializeCommands(this);

    this.registerEvent(
      // based on plugin from https://github.com/pjeby/hotkey-helper
      this.app.workspace.on(
        'plugin-settings:plugin-control',
        (setting: Setting, manifest: PluginManifest, enabled: boolean) => {
          if (manifest.helpUrl) {
            integrationWithSettings(this, setting, manifest, enabled);
          }
        }
      )
    );
  }

  async activateView(url?: string) {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_HELPMATE);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
      if (url) (leaves[0].view as HelpMateView).updateView(url);
    } else {
      // Our view could not be found in the workspace, create a new leaf
      const leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_HELPMATE, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    if (leaf) workspace.revealLeaf(leaf);
  }

  showRibbonButton(): void {
    this.ribbonIcon = this.addRibbonIcon(this.icon, 'HelpMate', async () => {
      await this.activateView();
    });
  }

  onunload(): void {
    console.log('unloading ' + this.APP_NAME);
    try {
      delete window.helpMateAPI;
    } catch (error) {
      console.log(error);
    }
  }

  async loadSettings(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Obsidian loadData is set to return Any
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
