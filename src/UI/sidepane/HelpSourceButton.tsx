import type { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type HelpMatePlugin from 'src/main';
import type { HelpForPlugin } from 'src/resources';
import { getPluginHelpList } from 'src/resources';

interface HelpSourceButtonProps {
  setSelectedUrl: (url: string) => void;
  plugin: HelpMatePlugin;
}

const HelpSourceButton: FunctionComponent<HelpSourceButtonProps> = ({
  setSelectedUrl,
  plugin,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const helpUrls: HelpForPlugin[] = getPluginHelpList(plugin);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (index: number) => {
    setIsOpen(false);
    setSelectedUrl(helpUrls[index].url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="hm-source-button" ref={menuRef}>
      <button onClick={handleButtonClick} class="hm-view-browser-toolbar-button">
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
          class="lucide lucide-bookmark-check"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
          <path d="m9 10 2 2 4-4" />
        </svg>
      </button>
      {isOpen && (
        <ul className="hm-source-button-dropdown-menu">
          {helpUrls.map((url, index) => (
            <li
              key={index}
              onClick={() => {
                handleOptionClick(index);
              }}
              class="hm-source-button-list-item"
            >
              {url.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpSourceButton;
