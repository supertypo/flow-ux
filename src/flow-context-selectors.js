import {BaseElement, html, css} from './base-element.js';
import {FlowContextWorkspace, FlowContext} from './flow-context.js';
import {FlowContextElement} from './flow-context.js';

export class FlowContextA extends FlowContextElement{
	static get properties(){
		return {
			name:{type:String, value:"Context A"},
			type:{type:String, value:"example"},
			code:{type:String, value:"ctxa"}
		}
	}
	static get styles(){
		return [FlowContextElement.styles, css`
			:host{display:block;padding:5px}
		`]
	}
}
FlowContextA.init();

export class FlowContextB extends FlowContextElement{
	static get properties(){
		return {
			name:{type:String, value:"Context B"},
			type:{type:String, value:"example"},
			code:{type:String, value:"ctxb"}
		}
	}
}
FlowContextB.init();

export class FlowContextC extends FlowContextElement{
	static get properties(){
		return {
			name:{type:String, value:"Context C"},
			type:{type:String, value:"example"},
			code:{type:String, value:"ctxc"}
		}
	}
}
FlowContextC.init();

export class FlowContextD extends FlowContextElement{
	static get properties(){
		return {
			name:{type:String, value:"Context D"},
			type:{type:String, value:"example"},
			code:{type:String, value:"ctxd"}
		}
	}
}
FlowContextD.init();

export class FlowContextE extends FlowContextElement{
	static get properties(){
		return {
			name:{type:String, value:"Context E"},
			type:{type:String, value:"example"},
			code:{type:String, value:"ctxe"}
		}
	}
}
FlowContextE.init();

FlowContextWorkspace({
	name:"Workspace A",
	code:"group1",
	color:'#0F0',
	contexts:[{
		code:"ctxa"
	},{
		code:"ctxb"
	}]
})

