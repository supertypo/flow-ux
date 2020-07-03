import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowMenu
 * @extends {BaseElement}


 * 
 * @example
 * <flow-menu selected="one">
 * 	<flow-menu-item value="one">One</flow-menu-item>
 * 	<flow-menu-item value="two">Two</flow-menu-item>
 * </flow-menu>
 */
export class FlowMenu extends BaseElement {
	static get properties() {
		return {
			selected:{type:Array}
		}
	}

	static get styles() {
		return css`
		:host{
			display:block;padding:5px 0px;
		}
		::slotted(flow-menu-item){
			padding:10px;cursor:pointer;
			display:block;user-select:none;
			background-color:var(--flow-menu-item-bg, #FFF);
			color:var(--flow-menu-item-color, #000);
		}
		::slotted(flow-menu-item:hover){
			background-color:var(--flow-menu-item-hover-bg, #DDD);
			color:var(--flow-menu-item-hover-color, #000);
		}
		::slotted(flow-menu-item.selected){
			background-color:var(--flow-menu-item-selected-bg, var(--flow-primary-color));
			color:var(--flow-menu-item-selected-color, #FFF);
		}
		`;
	}
	constructor(){
		super();
		this.selected = [];
	}
	render(){
		return html`
		<slot></slot>
		`;
	}
	firstUpdated(){
		this.renderRoot
			.addEventListener("click", this._onClick.bind(this));
		/*
		let slot = this.renderRoot.querySelector('slot');
		slot.addEventListener('slotchange', (e)=>{
			let items = slot.assignedElements();
			this.items = items
			//TODO update selection 
		});
		*/
	}
	updated(){
		let list = this.renderRoot.querySelector('slot').assignedElements();
		list.forEach(item=>{
			if(item.nodeName != 'FLOW-MENU-ITEM')
				return
			item.classList.toggle("selected", this.isSelected(item.getAttribute("value")));
		});
	}

	isSelected(value){
		return this.selected.includes(value);
	}

	_onClick(e){
		let target = e.target.closest("flow-menu-item");
		if(!target)
			return
		let value = target.getAttribute("value");
		this.toggle(value);
	}
	toggle(value){
		let index = this.selected.indexOf(value);
		if(index<0)
			this.selected.push(value);
		else
			this.selected.splice(index, 1);
		this.requestUpdate("selected", this.selected.slice(0))
		this.fire("select", {selected:this.selected.slice(0)})
	}
}

FlowMenu.define('flow-menu');
