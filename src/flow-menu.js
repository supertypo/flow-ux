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
			selected:{type:String},
			selector:{type:String},
			valueAttr:{type:String},
			multiple:{type:Boolean}
		}
	}

	static get styles() {
		return css`
		:host{
			display:block;padding:5px 0px;
			--flow-menu-item-margin-internal: var(--flow-menu-item-margin, 1px);
			--flow-menu-item-margin-internal2x:calc(var(--flow-menu-item-margin-internal) * 2);
		}

		::slotted(flow-menu-item){
			display:flex;align-items:center;
		}
		
		::slotted(flow-menu-item),
		::slotted(.menu-item){
			box-sizing:border-box;
			cursor:pointer;user-select:none;
			padding:var(--flow-menu-item-padding, 10px);
			margin:var(--flow-menu-item-margin-internal);
			background-color:var(--flow-menu-item-bg, var(--flow-background-color));
			color:var(--flow-menu-item-color, var(--flow-color));
		}
		::slotted(flow-menu-item:hover),
		::slotted(.menu-item:hover){
			background-color:var(--flow-menu-item-hover-bg, #DDD);
			color:var(--flow-menu-item-hover-color, #000);
		}
		::slotted(flow-menu-item.selected),
		::slotted(.menu-item.selected){
			background-color:var(--flow-menu-item-selected-bg, var(--flow-primary-color));
			color:var(--flow-menu-item-selected-color, var(--flow-primary-invert-color));
		}
		:host(.grid){
			display:flex;
			flex-wrap:wrap;
			width:var(--flow-menu-grid-width, 500px);
		}
		:host(.grid.full){
			width:var(--flow-menu-gridfull-width, 1000px);
		}
		:host(.grid:not(.full)) ::slotted(flow-menu-item),
		:host(.grid:not(.full)) ::slotted(.menu-item){
			min-width:calc(20% - var(--flow-menu-item-margin-internal2x));
			max-width:calc(20% - var(--flow-menu-item-margin-internal2x));
		}
		:host(.grid.full) ::slotted(flow-menu-item),
		:host(.grid.full) ::slotted(.menu-item){
			min-width:var(--flow-menu-gridfull-item-min-width, 100px);
			max-width:var(--flow-menu-gridfull-item-max-width, initial);
			flex:var(--flow-menu-gridfull-item-flex, 1);
		}
		`;
	}
	constructor(){
		super();
		this.selected = "";
		this.selector = "flow-menu-item, .menu-item";
		this.valueAttr = "value";
		this._selected = []
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
		this.listSlot = slot;
		slot.addEventListener('slotchange', (e)=>{
			//let items = slot.assignedElements();
			//this.items = items
			//TODO update selection 
			this.updateList();
		});
	}
	updated(changes){
		if(changes.has("selected"))
			this.parseSelected();

		this.updateList(changes)
	}

	parseSelected(){
		let {selected} = this;
		//this.log("changes", changes, "selected:"+JSON.stringify(selected))
		if(this.multiple){
			if(!Array.isArray(selected)){
				selected = JSON.parse(selected);
				if(selected !== undefined)
					selected = [selected];
				else
					selected = [];
			}
		}else{
			if(Array.isArray(selected))
				selected = selected[0];
			if(selected !== undefined)
				selected = [selected];
			else
				selected = []
		}
		selected = selected.filter(s=>s!==undefined).map(s=>s+"");
		//this.log("updated:selected", selected)
		this._selected = selected;
	}

	get list(){
		if(!this.listSlot)
			return [];
		return this.listSlot
			.assignedElements()
			.filter(item=>item.matches(this.selector))
	}

	updateList(){
		this.list.forEach(item=>{
			let value = item.getAttribute(this.valueAttr)
			item.classList.toggle("selected", this.isSelected(value));
		});
	}

	isSelected(value){
		return this._selected.includes(value);
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
		this._selected = [value];
		this.selectionChanged();
	}
	toggle(value){
		let index = this._selected.indexOf(value);
		if(index<0)
			this._selected.push(value);
		else
			this._selected.splice(index, 1);
		this.selectionChanged();
	}
	selectionChanged(){
		this.updateList()
		let selected = this._selected.slice(0)
		if(!this.multiple)
			selected = selected[0];
		this.fire("select", {selected})
	}
	get value(){
		if(!this.multiple)
			return this._selected[0]
		return this._selected
	}
}

FlowMenu.define('flow-menu');
