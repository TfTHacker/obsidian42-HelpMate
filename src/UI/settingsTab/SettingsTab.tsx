import type { App, ToggleComponent } from 'obsidian';
import { PluginSettingTab, Setting, TextAreaComponent } from 'obsidian';
import type HelpMatePlugin from 'src/main';
import { DEFAULT_SETTINGS } from '../../settings';

export class HelpMateSettingTab extends PluginSettingTab {
  plugin: HelpMatePlugin;

  constructor(app: App, plugin: HelpMatePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName(`HelpMate in ribbon`)
      .setDesc(`Show the HelpMate button in the ribbon.`)
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.ribbonIconEnabled);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.ribbonIconEnabled = value;
          await this.plugin.saveSettings();
          if (!this.plugin.settings.ribbonIconEnabled) this.plugin.ribbonIcon.remove();
          else this.plugin.showRibbonButton();
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(`Enable Obsidian's help in HelpMate`)
      .setDesc(`Show Obsidian's native help.`)
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.includeObsidianHelp);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.includeObsidianHelp = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(`Obsidian Help URL`)
      .setDesc(
        `URL to use for Obsidian help. This can be changed to a different URL for other languages.`
      )
      .addText((text) =>
        text.setValue(this.plugin.settings.obsidianHelpUrl).onChange(async (value) => {
          if (value.trim() === '') value = DEFAULT_SETTINGS.obsidianHelpUrl;
          this.plugin.settings.obsidianHelpUrl = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(`Enable Obsidian's help for developers in HelpMate`)
      .setDesc(`Show Obsidian's developer help.`)
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.includeObsidianDevHelp);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.includeObsidianDevHelp = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(`Obsidian developer help URL`)
      .setDesc(`URL to use for Obsidian's Developer help.`)
      .addText((text) =>
        text.setValue(this.plugin.settings.obsidianDevHelpUrl).onChange(async (value) => {
          if (value.trim() === '') value = DEFAULT_SETTINGS.obsidianDevHelpUrl;
          this.plugin.settings.obsidianDevHelpUrl = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(`Enable HelpMate's help in HelpMate`)
      .setDesc(`Show the deocumentation for HelpMate.`)
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.includeHelpMateHelp);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.includeHelpMateHelp = value;
          await this.plugin.saveSettings();
        });
      });

    containerEl
      .createEl('div', { text: 'List of custom help resources' })
      .addClass('setting-item');

    containerEl
      .createEl('div', {
        text: `Add custom help resources to be displayed in HelpMate. Input a list of URLs, one per line. 
											using the following format: "Title | URL". Title is the name of the resources, and URL is the the website. For example: `,
      })
      .addClass('setting-item-description');

    containerEl
      .createEl('div', { text: `Example Help | https://help.example.com` })
      .addClass('setting-item-description');

    const helpUrlList = new TextAreaComponent(containerEl);
    helpUrlList.inputEl.style.marginTop = '12px';
    helpUrlList.inputEl.style.width = '100%';
    helpUrlList.inputEl.style.height = '32vh';
    helpUrlList.setPlaceholder('Title | URL');
    helpUrlList.setValue(this.plugin.settings.userResources).onChange(async (value) => {
      this.plugin.settings.userResources = value;
      await this.plugin.saveSettings();
    });

    new Setting(containerEl)
      .setName(`Use IFRAME`)
      .setDesc(
        `On some devices the browser component of HelpMate may not display properly. This setting forces use of IFRAME 
						 which is more compatible across devices, but has less functionality. Only use this if you are having issues. Mobile
						 devices always use IFRAME, since this is the only supported option on mobile. So this setting does not apply to mobile.
						 (This setting will require a restart of Obsidian to take effect).`
      )
      .addToggle((cb: ToggleComponent) => {
        cb.setValue(this.plugin.settings.forceIframe);
        cb.onChange(async (value: boolean) => {
          this.plugin.settings.forceIframe = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
