import { Desktop } from '@wxcc-desktop/sdk';

const logger = Desktop.logger.createLogger('change-rona');

class changeRona extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	
	connectedCallback() {
		this.init();
	}

	disconnectedCallback() {
		Desktop.agentContact.removeAllEventListeners();
		Desktop.agentStateInfo.removeAllEventListeners();
	}

	sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

	async init() {
		logger.info('[change-rona] Init change rona plugin')
		await this.sleep (5000);

		await Desktop.config.init({widgetName: "change-rona", widgetProvider: "Aashish (aaberry)"}); 
		if (this.delaySeconds) {
			logger.info('[change-rona]Delay read from layout: ${this.delaySeconds} seconds.');
			this.delaySeconds = this.delaySeconds * 1000;
		}
		else {
			this.delaySeconds = 10000;
			logger.info('[change-rona]Delay unavailable in layout. Default 10 seconds.');
		}
		logger.info('[change-rona] Add event listeners')
		this.agentInteractionEvents();

		logger.info('[change-rona] Force agent to be available')
		this.triggerChange();
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

		Desktop.agentContact.addEventListener("eAgentOfferContactRona", (e => {
			logger.info('[change-rona]RONA triggered!')
			this.triggerChange();
		}));
	}

	async triggerChange () {
		await this.sleep(this.delaySeconds);
		try {
			await Desktop.agentStateInfo.stateChange({
				state: 'Available',
				auxCodeIdArray: '0',
			});
			logger.info('[change-rona]State changed to Available!');
		}
		catch (error) {
			logger.error(error);
		}
	}

}

window.customElements.define("change-rona", changeRona);
