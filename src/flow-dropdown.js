import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowDropdown
 * @extends {BaseElement}


 * 
 * @example
 * <flow-dropdown>
 *   <div slot="trigger">Menu</div>
 *   <ul>
 *		<li>Menu Item 1</li>
 *	 	<li>Menu Item 2</li>
 *   </ul>
 * </flow-dropdown>
 */
export class FlowDropdown extends BaseElement {
	static get properties() {
		return {
			opened:{type:Boolean, reflect:true}
		}
	}

	static get styles() {
		return css`
		:host{
			display:inline-block;margin:5px 0px;
			color:var(--flow-color, #000);
		}
		.trigger{
			background-color:var(--flow-dropdown-trigger-bg, var(--flow-primary-color, #3498DB));
			color:var(--flow-dropdown-trigger-color, #FFF);
			padding:16px;border-radius:3px;
			border:none;
			cursor:pointer;user-select:none;
		}

		.trigger:hover, .trigger:focus {
			background-color:var(--flow-dropdown-trigger-hover-bg, var(--flow-primary-color, #3498DB));
			color:var(--flow-dropdown-trigger-hover-color, #FFF);
		}
		.dropdown{position:relative;display:block;}
		.dropdown-content{
			display:none;
			position:absolute;
			background-color:var(--flow-dropdown-bg, #FFF);
			min-width:160px;
			overflow:auto;border-radius:3px;
			box-shadow:var(--flow-box-shadow);
			z-index:1000;
			top:0px;left:0px;
		}
		:host([opened]) .dropdown-content{display:block;}
		`;
	}
	render() {
		return html`
			<div class="trigger">
				<slot name="trigger"></slot>
			</div><div class="dropdown">
				<div class="dropdown-content">
					<slot></slot>
				</div>
			</div>
		`;
	}
	firstUpdated(){
		this.renderRoot
			//.querySelector(".trigger")
			.addEventListener("click", this._onClick.bind(this));
	}

	_onClick(e){
		this.toggle();
	}

	open(){
		this.opened = true;
	}
	close(){
		this.opened = false;
	}
	toggle(){
		this.opened = !this.opened;
	}
	onWindowClick(e){
		if(!this.opened)
			return
		let dropdown = e.target.closest('flow-dropdown');
		//console.log("dropdown", e.target, dropdown)
		if(!dropdown || dropdown!=this)
			this.opened = false;
	}
	connectedCallback(){
    	super.connectedCallback();
    	this._onWindowClick = this._onWindowClick || this.onWindowClick.bind(this);
    	window.addEventListener("click", this._onWindowClick, {capture:true})
    }
	disconnectedCallback(){
    	super.disconnectedCallback();
    	window.removeEventListener("click", this._onWindowClick)
    }
}

FlowDropdown.define('flow-dropdown');
