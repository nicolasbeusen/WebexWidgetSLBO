import { Desktop } from '@wxcc-desktop/sdk';

const logger = Desktop.logger.createLogger('outdial-state');

class outdialState extends HTMLElement {

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
		await this.sleep (5000);
		await Desktop.config.init({widgetName: "change-outdial-state", widgetProvider: "Aashish (aaberry)"}); 
		logger.info(`Outdial Idle code from layout: ${this.outdialIdleCode}`)
		this.agentInteractionEvents();
	}

	async agentInteractionEvents() {
		Desktop.agentContact.addEventListener("eAgentContactReserved", (e => {
			if (e.data.interaction.contactDirection.type === 'OUTBOUND' && e.data.interaction.outboundType === 'OUTDIAL') {
				this.state = Desktop.agentStateInfo.latestData.subStatus;
				if (this.state !== 'Available') 
					this.code = Desktop.agentStateInfo.latestData.idleCode.id;
				else
					this.code = '';
				logger.info(`State: ${this.state}, ${this.code}`);
				Desktop.agentStateInfo.stateChange({
					state: 'Idle',
					auxCodeIdArray: this.outdialIdleCode,
				});
				logger.info(`State Changed to the Outdial Idle ${this.outdialIdleCode}`);
			}		  			
		}));
		Desktop.agentContact.addEventListener("eAgentContactWrappedUp", (e => {
			logger.info("Agent wrapped up! ");
			if (e.data.interaction.contactDirection.type === 'OUTBOUND' && e.data.interaction.outboundType === 'OUTDIAL') {
				this.changeAgentState(this.state, this.code);
			}
		}));
		Desktop.agentContact.addEventListener("eAgentOfferContactRona", (e => {
			logger.info("RONA triggered! ")
			if (e.data.interaction.contactDirection.type === 'OUTBOUND' && e.data.interaction.outboundType === 'OUTDIAL') {
				this.changeAgentState(this.state, this.code);
			}
		}));
	}

	async changeAgentState(state, code) {
		switch (state) {
		case 'Available':
			await Desktop.agentStateInfo.stateChange({
				state,
				auxCodeIdArray: '0',
			});
			logger.info('State restored to Available');
			break;
		case 'Idle':
			await Desktop.agentStateInfo.stateChange({
				state,
				auxCodeIdArray: code,
			});
			logger.info('State restored to Idle', code);
			break;
		default:
		}
		Desktop.agentStateInfo.latestData.subStatus;
	}

}

window.customElements.define("outdial-state", outdialState);
