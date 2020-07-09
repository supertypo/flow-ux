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
			selected:{type:Array},
			selector:{type:String},
			valueAttr:{type:String},
			multiple:{type:Boolean}
		}
	}

	static get styles() {
		return css`
		:host{
			display:block;padding:5px 0px;
		}

		::slotted(flow-menu-item){
			padding:10px;display:flex;align-items:center;
		}
		
		::slotted(flow-menu-item),
		::slotted(.menu-item){
			cursor:pointer;padding:10px;margin:1px;user-select:none;
			background-color:var(--flow-menu-item-bg, #FFF);
			color:var(--flow-menu-item-color, #000);
		}
		::slotted(flow-menu-item:hover),
		::slotted(.menu-item:hover){
			background-color:var(--flow-menu-item-hover-bg, #DDD);
			color:var(--flow-menu-item-hover-color, #000);
		}
		::slotted(flow-menu-item.selected),
		::slotted(.menu-item.selected){
			background-color:var(--flow-menu-item-selected-bg, var(--flow-primary-color));
			color:var(--flow-menu-item-selected-color, #FFF);
		}
		:host(.grid){
			display:flex;
			flex-wrap:wrap;
			width:var(--flow-menu-grid-width, 500px);
		}
		:host(.grid) ::slotted(flow-menu-item),
		:host(.grid) ::slotted(.menu-item){
			flex:1;
			min-width:calc(20% - 5px);
		}
		`;
	}
	constructor(){
		super();
		this.selected = [];
		this.selector = "flow-menu-item, .menu-item";
		this.valueAttr = "value";
	}
	render(){
		return html`
		<slot></slot>
		`;
	}
	firstUpdated(){
		this.renderRoot
			.addEventListener("click", this._onClick.bind(this));

		let slot = this.renderRoot.querySelector('slot');
		slot.addEventListener('slotchange', (e)=>{
			//let items = slot.assignedElements();
			//this.items = items
			//TODO update selection 
			this.updateList();
		});
	}
	updated(){
		this.updateList()
	}

	updateList(){
		let list = this.renderRoot.querySelector('slot').assignedElements();
		list.forEach(item=>{
			if(!item.matches(this.selector))
				return
			let value = item.getAttribute(this.valueAttr)
			item.classList.toggle("selected", this.isSelected(value));
		});
	}

	isSelected(value){
		return this.selected.includes(value);
	}

	_onClick(e){
		let target = e.target.closest(this.selector);
		if(!target)
			return
		let value = target.getAttribute(this.valueAttr);
		if(this.multiple)
			this.toggle(value);
		else
			this.selectOne(value)
	}
	selectOne(value){
		this.selected = [value];
		this.selectionChanged();
	}
	toggle(value){
		let index = this.selected.indexOf(value);
		if(index<0)
			this.selected.push(value);
		else
			this.selected.splice(index, 1);
		this.selectionChanged();
	}
	selectionChanged(){
		this.requestUpdate("selected", this.selected.slice(0))
		this.fire("select", {selected:this.selected.slice(0)})
	}
}

FlowMenu.define('flow-menu');
