import {BaseElement, html, css} from './base-element.js';
import {FlowContextListenerMixin} from './flow-context.js';

/**
* @class FlowGridStackPanel
* @extends BaseElement
* @prop {String} heading
* @prop {Boolean} opened
*
* @cssvar {background-color} [--flow-gridstack-panel-bg=#FFF]
* @cssvar {color} [--flow-gridstack-panel-color=var(--flow-color)]
* @cssvar {border-radius} [--flow-gridstack-panel-border-radius=4px]
* @cssvar {border} [--flow-gridstack-panel-border=1px solid var(--flow-primary-color)]
* @cssvar {padding} [--flow-gridstack-panel-heading-padding=5px]
* @cssvar {background-color} [--flow-gridstack-panel-heading-bg=var(--flow-primary-color)]
* @cssvar {color} [--flow-gridstack-panel-head-color=var(--flow-primary-invert-color)]
* @cssvar {align-items} [--flow-gridstack-panel-heading-align-items=center]
* @cssvar {overflow} [-flow-gridstack-panel-heading-overflow=hidden]
* @cssvar {text-overflow} [--flow-gridstack-panel-heading-text-overflow=ellipses]
* @cssvar {flex} [--flow-gridstack-panel-head-flex=1]
* @cssvar {align-items} [--flow-gridstack-panel-head-align-items=center]
* @example
*   <flow-gridstack-panel></flow-gridstack-panel>
*
*/

/*
the following causes jsdoc to fail:
... @ cssvar {--fa-icon-color} [--flow-gridstack-panel-head-color=var(--flow-primary-invert-color)]

*/

export const FlowGridStackPanelMixin = (base)=>{
class FlowGridStackPanelKlass extends base {
	static get properties() {
		return {
			heading:{type:String, value:"Hello"},
			//opened:{type:Boolean, value:false, reflect:true}
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
				display:flex;flex-direction:row;height:100%;
				flex:var(--flow-gridstack-panel-head-flex, 1);
				align-items:var(--flow-gridstack-panel-head-align-items, center);
			}
			.drag-region{cursor:move;}
			.body{overflow:auto;flex:1}
			/*:host(:not([opened])) .body{
				display:none;
			}*/
			.heading fa-icon:not(.disabled){cursor:pointer}
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
		return html `
		<fa-icon @click="${this.openContextManager}" icon="link"></fa-icon><fa-icon icon="times"></fa-icon>`
	}
	renderHead(){
		return this.heading || ''
	}
	renderBody(){
		return html`
		<div>
			PANEL : ${Math.random()*10000}
			<div>contexts:${JSON.stringify(this.ctxworkspaces||[])}</div>
		</div>
			
		`
	}

	onHeadingClick(){
		
	}

	acceptContext(ctx){
		return super.acceptContext(ctx)
	}

	onContextsUpdate(){

	}

	onHeadClick(){
		this.opened = !this.opened;
	}

	serialize(){
		let {opened} = this;
		let data = Object.assign({}, super.serialize(), {
			opened
		});
		return data;
	}
	deserialize(data){
		super.deserialize(data);
		let {opened} = data||{};
		this.opened = !!opened;
	}

	getGridstackDragHandle(){
		return this.renderRoot.querySelector('.heading .head')
	}
}

return FlowGridStackPanelKlass
}

export const FlowGridStackPanelImpl = FlowGridStackPanelMixin(BaseElement);
export class FlowGridStackPanel extends FlowContextListenerMixin(FlowGridStackPanelImpl){};

FlowGridStackPanel.define('flow-gridstack-panel');
