export interface HelpMateSettings {
  acknowledgedWebUse: boolean;
  ribbonIconEnabled: boolean;
  includeObsidianHelp: boolean;
  obsidianHelpUrl: string;
  includeObsidianDevHelp: boolean;
  obsidianDevHelpUrl: string;
  includeHelpMateHelp: boolean;
  userResources: string;
  forceIframe: boolean;
}

export const DEFAULT_SETTINGS: HelpMateSettings = {
  acknowledgedWebUse: false,
  ribbonIconEnabled: true,
  includeObsidianHelp: true,
  obsidianHelpUrl: 'https://help.obsidian.md',
  includeObsidianDevHelp: true,
  obsidianDevHelpUrl: 'https://docs.obsidian.md/Home',
  includeHelpMateHelp: true,
  userResources: '',
  forceIframe: false,
};
