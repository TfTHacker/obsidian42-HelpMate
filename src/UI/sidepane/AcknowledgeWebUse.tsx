import type { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import type HelpMatePlugin from "src/main";

interface AcknowledgeProps {
	onAcknowledge: (acknowledged: boolean) => void;
	plugin: HelpMatePlugin;
}

const AcknowledgeWebUse: FunctionComponent<AcknowledgeProps> = ({
	onAcknowledge,
	plugin,
}) => {
	const [isChecked, setIsChecked] = useState(false);

	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
	};

	const handleButtonClick = () => {
		if (isChecked) {
			plugin.settings.acknowledgedWebUse = true;
			void plugin.saveSettings();
			onAcknowledge(true);
		} else {
			alert("Please check the Acknowledge checkbox to proceed");
		}
	};

	return (
		<div class="hm-acknowledge-message">
			<p>
				{" "}
				HelpMate displays the help content from websites in the sidepane. Please
				keep in mind that this help content is coming from the web and you are
				responsible to verify that the sites are safe.
			</p>
			<p>Please check the Acknowledge checkbox to proceed.</p>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleCheckboxChange}
			/>
			<label htmlFor="acknowledge-checkbox">Acknowledge this message</label>
			<br />
			<br />
			<button type="button" onClick={handleButtonClick}>
				Proceed
			</button>
		</div>
	);
};

export default AcknowledgeWebUse;
