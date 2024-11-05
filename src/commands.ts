import type HelpMatePlugin from "./main";
import { getPluginHelpList } from "./resources";

// helpmate is a custom property that we add to the Command interface
// to track which commands are added by HelpMate
declare module "obsidian" {
	export interface Command {
		helpmate?: boolean;
	}
}

export const initializeCommands = (plugin: HelpMatePlugin) => {
	plugin.addCommand({
		id: "open-helpmate",
		name: "Open sidepane",
		callback: () => plugin.activateView(),
	});
	addHelpMateResourcesToCommandPalette(plugin);
};

export const addHelpMateResourcesToCommandPalette = (
	plugin: HelpMatePlugin,
) => {
	// when this function is called, we rebuild all the command palette entries
	// This only happens when the user makes changes to the list of plugins in settings
	for (const command of Object.values(plugin.app.commands.commands))
		if (command.helpmate) plugin.app.commands.removeCommand(command.id);

	for (const help of getPluginHelpList(plugin)) {
		plugin.addCommand({
			id: help.id,
			name: `view: ${help.name}`,
			callback: () => plugin.activateView(help.url),
			helpmate: true,
		});
	}
};
