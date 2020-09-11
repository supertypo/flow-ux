import {BaseElement, html, css} from './base-element.js';

/**
* @class FlowGridStackPanel
* @extends BaseElement
* @example
*   <flow-gridstack-panel></flow-gridstack-panel>
*
*/

export class FlowGridStackPanel extends BaseElement {
	static get properties() {
		return {
			//draggable:{type:String, value:"true", reflect:true}
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
		//this.classList.add("grid-stack-item")
		this.initPropertiesDefaultValues();
	}

	render() {
		return html`${Math.random()*10000} <slot></slot>`;
	}
}

FlowGridStackPanel.define('flow-gridstack-panel');
