import type { FunctionComponent } from 'preact';
import EmbeddedBrowser from '../browsers/EmbeddedBrowser';
import type HelpMatePlugin from '../../main';
import type { HelpForPlugin } from 'src/resources';
import { getPluginHelpList } from 'src/resources';
interface HelpMateViewContainerProps {
  plugin: HelpMatePlugin;
  // optional. if not included, loads from list of help urls
  initialUrlAddress?: string;
}

const HelpMateViewContainer: FunctionComponent<HelpMateViewContainerProps> = ({
  plugin,
  initialUrlAddress,
}) => {
  const helpForPluginsList: HelpForPlugin[] = getPluginHelpList(plugin);
  const url =
    initialUrlAddress && initialUrlAddress !== '' ?
      initialUrlAddress
    : helpForPluginsList[0].url;

  return (
    <div style={{ height: '100%', width: '100%' }} class="hm-view-container">
      <EmbeddedBrowser urlAddress={url} plugin={plugin} />
    </div>
  );
};

export default HelpMateViewContainer;
