// compiles the list of resources available in the UI

import type HelpMatePlugin from './main';
import type { PluginManifest, ThemeManifest } from 'obsidian';

export interface HelpForPlugin {
  id: string;
  name: string;
  url: string;
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.trim());
    return true;
  } catch (error) {
    return false;
  }
};

export const getPluginHelpList = (plugin: HelpMatePlugin): HelpForPlugin[] => {
  const initialHelpList: HelpForPlugin[] = Object.values(plugin.app.plugins.manifests)
    .filter((p: PluginManifest) => p.helpUrl && p.id !== plugin.APP_ID)
    .map((p: PluginManifest) => ({ id: p.id, name: p.name, url: p.helpUrl ?? '' }));

  const customPluginList = plugin.settings.userResources.split('\n');
  customPluginList.forEach((p: string) => {
    if (p.trim() !== '') {
      const [name, url] = p.split('|');
      if (name && url && isValidUrl(url))
        initialHelpList.push({ id: name, name: name, url: url });
    }
  });

  const themeList = (Object.values(plugin.app.customCss.themes) as ThemeManifest[])
    .filter((p: ThemeManifest) => p.helpUrl)
    .map(
      (p: ThemeManifest): HelpForPlugin => ({
        id: p.name,
        name: p.name,
        url: p.helpUrl ? p.helpUrl : '',
      })
    );

  // add themes to the list if they have the helpUrl property in their manifest file
  themeList.forEach((p: HelpForPlugin) => {
    if (p.name && p.url && isValidUrl(p.url))
      initialHelpList.push({ id: p.name, name: p.name, url: p.url });
  });

  const pattern = /\[helpUrl:(.+?)\|(.+?)\]/;
  Array.from(plugin.app.customCss.csscache.entries()).forEach(([_, value]) => {
    const matches = value.match(pattern);
    if (matches) {
      const resourceName = matches[1].trim();
      const url = matches[2].trim();
      if (resourceName && url && isValidUrl(url))
        initialHelpList.push({ id: resourceName, name: resourceName, url: url });
    }
  });

  const sortedHelpForPluginList = initialHelpList.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (
    plugin.settings.includeObsidianDevHelp &&
    plugin.settings.obsidianDevHelpUrl &&
    isValidUrl(plugin.settings.obsidianDevHelpUrl)
  )
    sortedHelpForPluginList.unshift({
      id: 'obsidian-dev',
      name: 'Obsidian Developer Help',
      url: plugin.settings.obsidianDevHelpUrl,
    });

  if (
    plugin.settings.includeObsidianHelp &&
    plugin.settings.obsidianHelpUrl &&
    isValidUrl(plugin.settings.obsidianHelpUrl)
  )
    sortedHelpForPluginList.unshift({
      id: 'obsidian',
      name: 'Obsidian Help',
      url: plugin.settings.obsidianHelpUrl,
    });

  if (plugin.settings.includeHelpMateHelp)
    sortedHelpForPluginList.push({
      id: 'helpmate',
      name: 'HelpMate Help',
      url: 'https://tfthacker.com/HelpMate',
    });

  return sortedHelpForPluginList;
};
