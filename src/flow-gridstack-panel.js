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
				background-color:var(--flow-gridstack-panel-bg, #FFF);
				color:var(--flow-gridstack-panel-color, var(--flow-color));
				border-radius:var(--flow-gridstack-panel-border-radius, 4px);
				border:var(--flow-gridstack-panel-border, 1px solid var(--flow-primary-color));
				box-sizing:border-box;
			}
			.heading{
				text-overflow:elipsis;overflow:hidden;
				padding:var(--flow-gridstack-panel-heading-padding, 5px);
				background-color:var(--flow-gridstack-panel-heading-bg, var(--flow-primary-color));
				color:var(--flow-gridstack-panel-head-color, var(--flow-primary-invert-color));
				display:flex;flex-direction:row;
				align-items:var(--flow-gridstack-panel-heading-align-items, center);
				overflow:var(--flow-gridstack-panel-heading-overflow, hidden);
				text-overflow:var(--flow-gridstack-panel-heading-text-overflow, ellipses);
				--fa-icon-color:var(--flow-gridstack-panel-head-color, var(--flow-primary-invert-color));
			}
			.head{
				display:flex;flex-direction:row;
				flex:var(--flow-gridstack-panel-head-flex, 1);
				align-items:var(--flow-gridstack-panel-head-align-items, center);
			}
			.drag-region{cursor:move;}
			.body{overflow:auto;flex:1}
			:host(:not([opened])) .body{
				display:none;
			}
		`;
	}
	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}

	render() {
		return html` 
			<div class="heading" @click="${this.onHeadingClick}">
				${this.renderHeadPrefix()}
				<div class="head drag-region" 
					@click="${this.onHeadClick}">${this.renderHead()}</div>
				${this.renderHeadSuffix()}
			</div>
			<div class="body">${this.renderBody()}</div>`;
	}

	renderHeadPrefix(){
		return html `<fa-icon icon="window-maximize"></fa-icon>`
	}
	renderHeadSuffix(){
		return html `<fa-icon icon="times"></fa-icon>`
	}
	renderHead(){
		return this.heading || ''
	}
	renderBody(){
		return Math.random()*10000;
	}

	onHeadingClick(){
		
	}

	onHeadClick(){
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

	getGridstackDragHandle(){
		return this.renderRoot.querySelector('.heading .head')
	}
}

FlowGridStackPanel.define('flow-gridstack-panel');
