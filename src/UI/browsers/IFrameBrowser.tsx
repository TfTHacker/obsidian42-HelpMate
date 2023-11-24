import type HelpMateAPI from 'src/HelpMateAPI';
import { useState, useRef } from 'preact/hooks';
import HelpSourceButton from '../sidepane/HelpSourceButton';
import type HelpMatePlugin from 'src/main';

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

  const navigateTo = () => {
    if (iframeRef.current) {
      debug && api.log('IFrameBrowser: navigateTo', inputUrl);
      setIframeUrl(inputUrl);
      iframeRef.current.src = inputUrl;
    } else {
      // Handle error when iframeRef.current is null
    }
  };

  const openSiteInBrowser = () => {
    if (iframeRef.current) window.open(iframeRef.current.src);
  };

  const updateUrl = (url: string) => {
    setInputUrl(url);
    setIframeUrl(url);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newUrl = (e.target as HTMLInputElement).value;
      setInputUrl(newUrl);
      setIframeUrl(newUrl);
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
          <button
            onClick={openSiteInBrowser}
            class="hm-view-browser-toolbar-button"
            aria-label="Go Forward"
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
              class="lucide lucide-rocket"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </button>
        </div>
      )}
      <iframe ref={iframeRef} src={iframeUrl} class="hm-view-browser-iframe" />
    </div>
  );
};

export default IFrameBrowser;
