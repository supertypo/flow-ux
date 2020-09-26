import {BaseElement, html, css} from './base-element.js';
import {FlowContextGroup, FlowContext} from './flow-context.js';
import {FlowMenu} from './flow-menu.js';
import {humanize} from './helpers.js';



export class FlowContextGroupA extends FlowContextGroup{
	static get properties(){
		return {
			name:{type:String, value:"Context group A"},
			group:{type:String, value:"group1"}
		}
	}
}
FlowContextGroupA.init();

export class FlowContextA extends FlowContext{
	static get properties(){
		return {
			name:{type:String, value:"Context A"},
			type:{type:String, value:"example"},
			group:{type:String, value:"group1"},
			code:{type:String, value:"ctxa"}
		}
	}
}
FlowContextA.init();

export class FlowContextB extends FlowContext{
	static get properties(){
		return {
			name:{type:String, value:"Context B"},
			type:{type:String, value:"example"},
			group:{type:String, value:"group1"},
			code:{type:String, value:"ctxb"}
		}
	}
}
FlowContextB.init();


/*
export class FlowContextSelectorImpl extends FlowContextSelectorMixin(BaseElement){
}
export class FlowColorContextSelector extends FlowContextSelectorMixin(FlowMenu){
	static get styles(){
		return [FlowMenu.styles, css`
			:host{
				display:block;overflow:auto;
				height:100px;width:300px;
			}
		`]
	}
	render(){
		let contexts = this.parseConexts();
		return html`
			${contexts.map(c=>{
				return html`<div class="context menu-item" value="${c.type}">${c.name}</div>`
			})}
		`
	}
	parseConexts(){
		return (this.contexts||[]).map(c=>{
			return {name:humanize(c), type:c}
		})
	}
	get list(){
		return this.renderRoot.querySelectorAll('.menu-item');
	}
}
FlowColorContextSelector.define('flow-color-context-selector');
*/