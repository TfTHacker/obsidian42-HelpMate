// This is the sidepane. It does one thing, it loades the HelpMateViewContainer which contains all the logic for the pane.

import type { WorkspaceLeaf } from 'obsidian';
import { ItemView } from 'obsidian';
import { render } from 'preact';
import type HelpMatePlugin from 'src/main';
import HelpMateViewContainer from './HelpMateViewContainer';

export const VIEW_TYPE_HELPMATE = 'help-mate';

export class HelpMateView extends ItemView {
  plugin: HelpMatePlugin;

  constructor(leaf: WorkspaceLeaf, helpMatePlugin: HelpMatePlugin) {
    super(leaf);
    this.plugin = helpMatePlugin;
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    const browserDiv = container.createDiv();
    browserDiv.style.height = '100%';
    browserDiv.style.width = '100%';
    browserDiv.classList.add('hm-view-parent');
    render(<HelpMateViewContainer plugin={this.plugin} />, browserDiv);
    return Promise.resolve();
  }

  updateView(url: string) {
    const container = this.containerEl.children[1];
    const browserDiv = container.querySelector('.hm-view-parent');
    if (browserDiv) {
      render(null, browserDiv);
      render(
        <HelpMateViewContainer plugin={this.plugin} initialUrlAddress={url} />,
        browserDiv
      );
    }
  }

  getIcon() {
    return this.plugin.icon;
  }

  getViewType() {
    return VIEW_TYPE_HELPMATE;
  }

  getDisplayText() {
    return 'HelpMate';
  }

  async onClose() {
    // Nothing to clean up.
  }
}
