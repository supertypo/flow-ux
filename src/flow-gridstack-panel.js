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
			heading:{type:String, value:"Hello"},
			opened:{type:Boolean, value:false, reflect:true}
		}
	}

	static get styles() {
		return css`
			:host {
				display:flex;flex-direction:column;
				align-items:stretch;
				justify-content:start;
				background-color:#1EAAFC;
				color:#fff;
				border-radius:4px;
				border:1px solid #171717;
				box-sizing:border-box;
			}
			.heading{
				text-overflow:elipsis;overflow:hidden;
				padding:var(--flow-gridstack-panel-heading-padding, 5px);
				background-color:var(--flow-gridstack-panel-heading-bg, var(--flow-primary-color));
			}
			.body{overflow:auto;flex:1}
			:host(:not([opened])) .body{
				display:none;
			}
		`;
	}
	constructor(){
		super();
		//this.classList.add("grid-stack-item")
		this.initPropertiesDefaultValues();
	}

	render() {
		return html` 
			<div class="heading" @click="${this.onHeadingClick}">${this.heading}</div>
			<div class="body">${Math.random()*10000} <slot></slot></div>`;
	}

	onHeadingClick(){
		this.opened = !this.opened;
	}

	getGridstackState(){
		let {opened, heading} = this;
		return {opened, heading};
	}
	setGridstackState(state){
		let {heading, opened} = state||{};
		if(heading)
			this.heading = heading;
		this.opened = !!opened;
	}
}

FlowGridStackPanel.define('flow-gridstack-panel');
