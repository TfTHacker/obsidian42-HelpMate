// This component is used to render a webview browser in the UI. It only works on
// desktop platforms, as WebView component is specific to Electron.
// For mobile browser, see the file IFrameBrowser.tsx

import type HelpMatePlugin from 'src/main';
import type HelpMateAPI from 'src/HelpMateAPI';
import { useState, useRef, useEffect } from 'preact/hooks';
import HelpSourceButton from '../sidepane/HelpSourceButton';
import HelpMoreButton from '../sidepane/HelpMoreButton';
import { isValidUrl } from 'src/resources';
import { Notice } from 'obsidian';

interface WebViewBrowserProps {
  urlAddress: string;
  plugin: HelpMatePlugin;
  showToolbar?: boolean;
}

interface HTMLWebViewElement extends HTMLElement {
  getURL: () => string;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  url: string;
  loadURL: (url: string) => void;
}

const iconHeight = 18;

const WebViewBrowser = ({
  urlAddress,
  plugin,
  showToolbar = true,
}: WebViewBrowserProps) => {
  const [url, setUrl] = useState<string>(urlAddress || '');
  const api: HelpMateAPI = plugin.HELPMATE_API;
  const debug = api.enableDebugging.webViewBrowser;
  const webviewRef = useRef<HTMLWebViewElement>(null);

  const executeWebViewMethod = (method: keyof HTMLWebViewElement, logMessage: string) => {
    if (webviewRef.current) {
      debug && api.log(`WebViewBrowser: ${logMessage}`, webviewRef.current.getURL());
      /* @ts-expect-error - no type def */
      webviewRef.current[method]();
    }
  };

  const goBack = () => {
    executeWebViewMethod('goBack', 'goBack');
  };
  const goForward = () => {
    executeWebViewMethod('goForward', 'goForward');
  };

  const navigateTo = () => {
    debug && api.log('WebViewBrowser: navigateTo', url);
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      const newUrl = `https://${url}`;
      if (isValidUrl(newUrl)) setUrl(newUrl);
    }
    if (isValidUrl(url)) webviewRef.current?.loadURL(url);
    else new Notice('Invalid URL');
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      navigateTo();
    }
  };

  const handleChange = (event: Event) => {
    setUrl((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    const handleDomReady = () => {
      debug && api.log('WebViewBrowser: dom-ready', webviewRef.current);
      const addEventListener = (eventName: string) => {
        webviewRef.current?.addEventListener(eventName, () => {
          debug && api.log(`WebViewBrowser: ${eventName}`, webviewRef.current?.getURL());
          setUrl(webviewRef.current?.getURL() ?? '');
        });
      };

      addEventListener('did-navigate-in-page');
      addEventListener('did-navigate');
    };

    webviewRef.current?.addEventListener('dom-ready', handleDomReady);

    return () => webviewRef.current?.removeEventListener('dom-ready', handleDomReady);
  }, []);

  return (
    <div class="hm-view-browser">
      {showToolbar && (
        <div class="hm-view-browser-toolbar">
          <HelpSourceButton setSelectedUrl={setUrl} plugin={plugin} />
          <input
            type="text"
            value={url}
            onChange={handleChange}
            onKeyUp={handleKeyPress}
            placeholder="Enter URL"
            class="hm-view-browser-toolbar-input"
          />
          <button
            onClick={navigateTo}
            class="hm-view-browser-toolbar-button"
            aria-label="Navigate To"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right-square"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8" />
              <path d="m12 16 4-4-4-4" />
            </svg>
          </button>
          <button
            onClick={goBack}
            class="hm-view-browser-toolbar-button"
            aria-label="Go Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconHeight}
              height={iconHeight}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goForward}
            class="hm-view-browser-toolbar-button"
            aria-label="Go Forward"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconHeight}
              height={iconHeight}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <HelpMoreButton currentUrl={url} plugin={plugin} />
        </div>
      )}

      {/* @ts-expect-error - electron tag */}
      <webview
        ref={webviewRef}
        src={url}
        class="hm-view-browser-webframe"
        enableblinkfeatures="AutoDarkMode"
      />
    </div>
  );
};

export default WebViewBrowser;
