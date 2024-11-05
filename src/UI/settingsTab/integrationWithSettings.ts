// adds a button to the settings tab of a plugin
// that opens the helpmate view with the url of the plugin's help page

import type { ExtraButtonComponent, PluginManifest, Setting } from "obsidian";
import type HelpMatePlugin from "src/main";

interface ExtendedPluginManifest extends PluginManifest {
	helpUrl?: string;
}

const integrateIntoSettingsForm = (
	plugin: HelpMatePlugin,
	setting: Setting,
	manifest: PluginManifest,
	_: boolean,
) => {
	const extendedManifest = manifest as ExtendedPluginManifest;

	if (extendedManifest.helpUrl) {
		setting.addExtraButton((btn: ExtraButtonComponent) => {
			btn
				.setIcon(plugin.icon)
				.setTooltip("HelpMate")
				.onClick(async () => {
					// force it open to intialize
					await plugin.activateView();
					// then open proper url
					await plugin.activateView(extendedManifest.helpUrl);
					const div = document.querySelector(".modal-close-button");
					if (div) (div as HTMLElement).click();
				});
		});
	}
};

export default integrateIntoSettingsForm;
