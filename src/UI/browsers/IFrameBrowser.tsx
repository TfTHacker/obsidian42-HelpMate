import type HelpMatePlugin from 'src/main';
import type HelpMateAPI from 'src/HelpMateAPI';
import { useState, useRef } from 'preact/hooks';
import HelpSourceButton from '../sidepane/HelpSourceButton';
import HelpMoreButton from '../sidepane/HelpMoreButton';
import { isValidUrl } from 'src/resources';
import { Notice } from 'obsidian';

interface IFrameBrowserProps {
  urlAddress: string;
  plugin: HelpMatePlugin;
  showToolbar?: boolean;
}

const IFrameBrowser = ({
  urlAddress,
  plugin,
  showToolbar = true,
}: IFrameBrowserProps) => {
  const api: HelpMateAPI = plugin.HELPMATE_API;
  const debug = api.enableDebugging.iFrameBrowser;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inputUrl, setInputUrl] = useState<string>(urlAddress || '');
  const [iframeUrl, setIframeUrl] = useState<string>(urlAddress || '');

  const updateUrl = (url: string) => {
    let newUrl = url;
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      newUrl = `https://${url}`;
    }
    if (isValidUrl(newUrl)) {
      setInputUrl(newUrl);
      setIframeUrl(newUrl);
    } else {
      new Notice('Invalid URL');
    }
  };

  const navigateTo = () => {
    if (iframeRef.current) {
      debug && api.log('IFrameBrowser: navigateTo', inputUrl);
      updateUrl(inputUrl);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newUrl = (e.target as HTMLInputElement).value;
      updateUrl(newUrl);
      // setInputUrl(newUrl);
      // setIframeUrl(newUrl);
    }
  };

  return (
    <div class="hm-view-browser">
      {showToolbar && (
        <div class="hm-view-browser-toolbar">
          <HelpSourceButton setSelectedUrl={updateUrl} plugin={plugin} />
          <input
            class="hm-view-browser-toolbar-input"
            type="text"
            value={inputUrl}
            onKeyPress={handleKeyPress}
            onChange={(e) => {
              setInputUrl((e.target as HTMLInputElement).value);
            }}
            placeholder="Enter URL"
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
          <HelpMoreButton currentUrl={iframeUrl} plugin={plugin} />
        </div>
      )}
      <iframe ref={iframeRef} src={iframeUrl} class="hm-view-browser-iframe" />
    </div>
  );
};

export default IFrameBrowser;
