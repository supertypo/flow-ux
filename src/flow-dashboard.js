import {BaseElement, html, css} from './base-element.js';
import {FlowDashboardPanel} from './flow-dashboard-panel.js';

/**
* @class FlowDashboard
* @extends BaseElement
* @property {Number} [cols]
* @property {Number} [rows]
* @example
*   <flow-dashboard></flow-dashboard>
*
*/

export class FlowDashboard extends BaseElement {
	static get properties() {
		return {
			cols:{type:Number, value:10},
			rows:{type:Number, value:10}
		}
	}

	static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
				grid-auto-rows: minmax(100px, auto);
				gap: 5px;
			}
		`;
	}

	constructor() {
		super();
	}

	render() {
		return html`<slot></slot>`;
	}
}

FlowDashboard.define('flow-dashboard');
