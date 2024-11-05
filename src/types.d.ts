import type { Setting } from "obsidian";
import type HelpMateAPI from "./HelpMateAPI";

declare global {
	interface Window {
		helpMateAPI?: HelpMateAPI;
	}
}

declare module "obsidian" {
	export interface Command {
		helpmate?: boolean;
	}

	export interface App {
		commands: {
			commands: { [key: string]: Command };
			removeCommand: (id: string) => void;
		};
		customCss: {
			themes: { [key: string]: ThemeManifest };
			csscache: Map<string, string>;
		};
		plugins: {
			manifests: { [id: string]: PluginManifest };
		};
		setting: {
			open: () => void;
			openTabById: (id: string) => void;
		};
	}

	export interface PluginManifest {
		helpUrl?: string;
	}
	export interface ThemeManifest {
		name: string;
		helpUrl?: string;
	}
	interface Workspace {
		on(
			name: "plugin-settings:plugin-control",
			callback: (
				setting: Setting,
				manifest: PluginManifest,
				enabled: boolean,
			) => void,
		): EventRef;
	}
}
