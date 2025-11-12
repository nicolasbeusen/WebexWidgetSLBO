import { Desktop } from '@wxcc-desktop/sdk';
//import { Notifications } from "@uuip/unified-ui-platform-sdk";

const logger = Desktop.logger.createLogger('pause-recording');

class pauseRecording extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({mode: "open"});
	}
	
	connectedCallback() {
		this.init();
	}

	disconnectedCallback() {
		Desktop.agentContact.removeAllEventListeners();
	}

	async init() {
		await Desktop.config.init({widgetName: "pause-recording", widgetProvider: "Aashish (aaberry)"});
		this.agentInteractionEvents();
	}

	async pauseRecording(interactionId) {
		try {
			const result = await Desktop.agentContact.pauseRecording({ interactionId });
			logger.info(result);
		}
		catch (error) {
			logger.error (error);
		}
    }

	async agentInteractionEvents() {
		Desktop.agentContact.addEventListener("eAgentContactAssigned", (e => {
			// Identify Inbound calls and pause recording when call is answered
			if (e.data.interaction.mediaType === 'telephony' && e.data.interaction.contactDirection.type === 'INBOUND') {
				logger.info(`interactionId: ${e.data.interactionId}`);
				this.pauseRecording(e.data.interactionId);
			}
		}));

		Desktop.agentContact.addEventListener("ePauseRecording", (e => {
			logger.info("Recording Paused!");
		}));

		Desktop.agentContact.addEventListener("eResumeRecording", (e => {
			logger.info("Recording Resumed!");
		}));
	}

}

window.customElements.define("pause-recording", pauseRecording);
