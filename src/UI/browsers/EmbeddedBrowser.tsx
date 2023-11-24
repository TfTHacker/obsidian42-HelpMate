// This is the common entry point for the "Browser". It will decide which browser to use based on the environment.
// if it is an electron app then it will use the WebViewBrowser, otherwise it will use the IFrameBrowser.

import type { FunctionalComponent } from 'preact';
import { BrowserMode } from 'src/HelpMateAPI';
import WebViewBrowser from './WebViewBrowser';
import IFrameBrowser from './IFrameBrowser';
import { Platform } from 'obsidian';
import type HelpMatePlugin from 'src/main';
import AcknowledgeWebUse from '../sidepane/AcknowledgeWebUse';
import { useState } from 'preact/hooks';

interface EmbeddedBrowserProps {
  urlAddress: string;
  plugin: HelpMatePlugin;
  showToolbar?: boolean;
}

const EmbeddedBrowser: FunctionalComponent<EmbeddedBrowserProps> = ({
  urlAddress,
  plugin,
  showToolbar = true,
}: EmbeddedBrowserProps) => {
  const browseMode: BrowserMode =
    plugin.settings.forceIframe ? BrowserMode.iFrame
    : Platform.isDesktop ? BrowserMode.webView
    : BrowserMode.iFrame;

  const [isAcknowledged, setIsAcknowledged] = useState(
    plugin.settings.acknowledgedWebUse
  );

  if (!isAcknowledged) {
    return <AcknowledgeWebUse onAcknowledge={setIsAcknowledged} plugin={plugin} />;
  } else {
    return browseMode === BrowserMode.webView ?
        <WebViewBrowser
          urlAddress={urlAddress}
          plugin={plugin}
          showToolbar={showToolbar}
        />
      : <IFrameBrowser
          urlAddress={urlAddress}
          plugin={plugin}
          showToolbar={showToolbar}
        />;
  }
};

export default EmbeddedBrowser;
