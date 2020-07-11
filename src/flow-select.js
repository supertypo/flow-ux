import {BaseElement, html, css, dpc} from './base-element.js';
import {FlowMenu} from './flow-menu.js';

/**
 * @export
 * @class FlowSelect
 * @extends {FlowMenu}


 * 
 * @example
 * <flow-select>
 *   <div slot="trigger">Menu</div>
 *   <ul>
 *		<li>Menu Item 1</li>
 *	 	<li>Menu Item 2</li>
 *   </ul>
 * </flow-select>
 */
export class FlowSelect extends FlowMenu {
	static get properties() {
		return {
			label:{type:String},
			textAttr:{type:String}
		}
	}

	static get styles() {
		return [super.styles, css`
			:host{
				display:inline-block;padding:0px 5px;margin:5px 0px;vertical-align:middle;
				--flow-dropdown-trigger-bg:var(--flow-select-trigger-bg, transparent);
				--flow-dropdown-trigger-color:var(--flow-select-trigger-color, var(--flow-color, #000));
				--flow-dropdown-trigger-padding:var(--flow-select-trigger-padding, 5px 5px);
			}
			flow-dropdown{
				margin:0px;
			}
		`];
	}
	constructor(){
		super();
		this.textAttr = "data-text";
	}
	render() {
		return html
		`<flow-dropdown>
			<div slot="trigger">
				<label>${this.label}</label>
				<div class="selected">
					${this.renderSelected()}
				</div>
			</div><div>
				<slot></slot>
			</div>
		</flow-dropdown>`;
	}

	renderSelected(){
		let map = new Map();
		this.list.forEach(item=>{
			map.set(item.getAttribute(this.valueAttr), item.getAttribute(this.textAttr))
		})
		return this._selected.map(s=>html
			`<div class="item" value="${s}">${map.get(s) || s}</div>`
		)
	}

	updateList(changes){
		super.updateList();
		if(!changes)
			this.requestUpdate("_selected", this._selected.slice(0))
	}


	/*
	onWindowResize(){
		this.updateDropdownSize();
	}
	onParentScroll(){
		this.updateDropdownSize();
	}
	*/
	connectedCallback(){
    	super.connectedCallback();
    	
    }
	disconnectedCallback(){
    	super.disconnectedCallback();
    	
    }
}

FlowSelect.define('flow-select');
