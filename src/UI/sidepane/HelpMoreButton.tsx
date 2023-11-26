import type { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type HelpMatePlugin from 'src/main';

interface HelpMoreButtonProps {
  currentUrl: string;
  plugin: HelpMatePlugin;
}

const HelpMoreButton: FunctionComponent<HelpMoreButtonProps> = ({
  currentUrl,
  plugin,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const commands = [
    {
      name: 'Open site in browser',
      index: 0,
      command: () => {
        window.open(currentUrl);
      },
    },
    {
      name: 'Code block from site',
      index: 1,
      command: async () => {
        const newFile =
          '```helpmate\nurl: ' +
          currentUrl +
          '\nheight: 800px\ntoolbar: false\n```\n\n\n';
        const randomInt = Math.floor(Math.random() * (10000 - 1000 + 1)) + 100;
        const fileName = `codeblock ${randomInt}.md`;
        await plugin.app.vault.create(fileName, newFile).then(async (file) => {
          await plugin.app.workspace.getLeaf().openFile(file);
        });
      },
    },
    {
      name: 'Plugin settings',
      index: 2,
      command: () => {
        const settings = plugin.app.setting;
        settings.open();
        settings.openTabById('HelpMate');
      },
    },
  ];

  const handleOptionClick = (index: number) => {
    setIsOpen(false);
    commands[index].command();
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
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
    <div className="hm-more-button" ref={menuRef}>
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
          class="lucide lucide-cog"
        >
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M12 2v2" />
          <path d="M12 22v-2" />
          <path d="m17 20.66-1-1.73" />
          <path d="M11 10.27 7 3.34" />
          <path d="m20.66 17-1.73-1" />
          <path d="m3.34 7 1.73 1" />
          <path d="M14 12h8" />
          <path d="M2 12h2" />
          <path d="m20.66 7-1.73 1" />
          <path d="m3.34 17 1.73-1" />
          <path d="m17 3.34-1 1.73" />
          <path d="m11 13.73-4 6.93" />
        </svg>
      </button>
      {isOpen && (
        <ul className="hm-more-button-dropdown-menu hm-button-dropdown-menu">
          {commands.map((command) => (
            <li
              key={command.index}
              onClick={() => {
                handleOptionClick(command.index);
              }}
              class="hm-source-button-list-item"
            >
              {command.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpMoreButton;
