import {BaseElement, html, css} from './base-element.js';

/**
* @class FlowDashboardPanel
* @extends BaseElement
* @example
*   <flow-dashboard-panel></flow-dashboard-panel>
*
*/

export class FlowDashboardPanel extends BaseElement {
	static get properties() {
		return {
			draggable:{type:String, value:"true", reflect:true}
		}
	}

	static get styles() {
		return css`
			:host {
				display:flex;align-items:center;
				justify-content:center;
				background-color:#1EAAFC;
				color:#fff;
				border-radius:4px;
				border:1px solid #171717;
				box-sizing:border-box;
				padding:20px;overflow:auto;
			}
		`;
	}
	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}

	render() {
		return html`<slot></slot>`;
	}
}

FlowDashboardPanel.define('flow-dashboard-panel');
