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

		Desktop.agentContact.addEventListener("eAgentContactEnded", (e => {
			logger.info('EndCall triggered!')
			this.navigateToTabBySelector('[aria-label="RealTime Dashboard"]');
			this.listAvailableTabs()
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

	navigateToTabBySelector(selector) {
		try {
		  const tab = document.querySelector(selector);
		  
		  if (tab) {
			logger.info(`[change-rona] Found tab with selector: ${selector}`);
			tab.click();
			return true;
		  } else {
			logger.warn(`[change-rona] Tab not found with selector: ${selector}`);
			return false;
		  }
		} catch (error) {
		  logger.error(`[change-rona] Navigation error: ${error}`);
		  return false;
		}
	  }

	  // Navigate to a specific tab using DOM manipulation
  navigateToTabByLabel(tabLabel) {
    try {
      // Method 1: Find tab by aria-label or title
      const tabs = document.querySelectorAll('[role="tab"]');
      
      for (let tab of tabs) {
        const label = tab.getAttribute('aria-label') || 
                     tab.getAttribute('title') || 
                     tab.textContent.trim();
        
        if (label.toLowerCase().includes(tabLabel.toLowerCase())) {
          logger.info(`[change-rona] Found tab: ${label}`);
          tab.click();
          return true;
        }
      }

      // Method 2: Try finding by data attributes or classes
      const navLinks = document.querySelectorAll('a[href*="nav"], .nav-item, .tab-item');
      for (let link of navLinks) {
        if (link.textContent.toLowerCase().includes(tabLabel.toLowerCase())) {
          logger.info(`[change-rona] Found nav link: ${link.textContent}`);
          link.click();
          return true;
        }
      }

      logger.warn(`[change-rona] Tab not found: ${tabLabel}`);
      return false;
    } catch (error) {
      logger.error(`[change-rona] Navigation error: ${error}`);
      return false;
    }
  }

    // Navigate to tab by index (0-based)
	navigateToTabByIndex(index) {
		try {
		  const tabs = document.querySelectorAll('[role="tab"]');
		  
		  if (tabs.length > index) {
			logger.info(`[change-rona] Navigating to tab index: ${index}`);
			tabs[index].click();
			return true;
		  } else {
			logger.warn(`[change-rona] Tab index ${index} not found. Available tabs: ${tabs.length}`);
			return false;
		  }
		} catch (error) {
		  logger.error(`[change-rona] Navigation error: ${error}`);
		  return false;
		}
	  }
	
	listAvailableTabs() {
		try {
		  const tabs = document.querySelectorAll('[role="tab"]');
		  logger.info(`[change-rona] Available tabs (${tabs.length}):`);
		  
		  tabs.forEach((tab, index) => {
			const label = tab.getAttribute('aria-label') || 
						 tab.getAttribute('title') || 
						 tab.textContent.trim();
			logger.info(`  ${index}: ${label}`);
		  });
		} catch (error) {
		  logger.error(`[change-rona] Error listing tabs: ${error}`);
		}
	  }

}

window.customElements.define("change-rona", changeRona);
