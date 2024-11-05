import type { MarkdownPostProcessorContext } from "obsidian";
import { render } from "preact";
import type HelpMatePlugin from "src/main";
import { getPluginHelpList } from "src/resources";
import EmbeddedBrowser from "./browsers/EmbeddedBrowser";

// contents of the code block
// url: the url of the code block
// height: the height of the code block control
// toolbar: whether to show the toolbar

export function createCodeBlock(
	plugin: HelpMatePlugin,
	source: string,
	element: HTMLElement,
	_: MarkdownPostProcessorContext,
) {
	let controlHeight = 400;
	let controlUrl = getPluginHelpList(plugin)[0].url;
	let controlToolbar = true;

	const lines = source.split("\n");

	for (const line of lines) {
		const [key, value] = line.split(": ");
		switch (key) {
			case "url":
				controlUrl = value;
				break;
			case "height":
				controlHeight = Number.parseInt(value);
				break;
			case "toolbar":
				controlToolbar = value.toLowerCase() === "true";
				break;
			default:
				// do nothing
				break;
		}
	}

	render(
		<div style={{ height: controlHeight }}>
			<EmbeddedBrowser
				plugin={plugin}
				urlAddress={controlUrl}
				showToolbar={controlToolbar}
			/>
		</div>,
		element,
	);
}
