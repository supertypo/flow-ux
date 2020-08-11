import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowGroupBtns
* @extends BaseElement
* @example
*   <flow-group-btns>
*		<flow-btn>Button 1</flow-btn>
*		<flow-btn>Button 2</flow-btn>
*	</flow-group-btns>
* @property {Boolean} [disabled] 
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {border-radius} [--flow-btn-radius=8px]
*/
export class FlowGroupBtns extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			selected:{type:String},
			valueAttr:{type:String}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				margin: var(--flow-group-btns-margin);
				padding:0px	;
				border:1px solid var(--flow-group-btns-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-group-btns-radius, 8px);
				border-width:var(--flow-group-btns-border-width, 1px);
				font-family:var(--flow-group-btns-font-family, var(--flow-font-family, initial));
				font-weight:var(--flow-group-btns-font-weight, var(--flow-font-weight, bold));
				font-size:var(--flow-group-btns-font-size, initial);
				line-height:var(--flow-group-btns-line-height, inherit);
				user-select: none;
				overflow:hidden;
			}
			:host([disabled]){
				opacity:0.5;
				cursor:default;
				pointer-events:none;
			}

			:host ::slotted(flow-btn){
				--flow-btn-margin:0px;
				--flow-btn-border-width:0px;
				--flow-btn-radius:0px;
				--flow-btn-wrapper-margin:5px;
				--flow-btn-hover-color:var(--flow-group-btns-active-color, var(--flow-primary-invert-color));
				border-right:var(--flow-group-btns-border-width, 1px) solid var(--flow-group-btns-border-color, var(--flow-primary-color, rgba(0,151,115,1)))
			}

			:host ::slotted(flow-btn.active){
				--flow-btn-bg-color:var(--flow-group-btns-active-bg-color, var(--flow-primary-color));
				--flow-btn-color:var(--flow-group-btns-active-color, var(--flow-primary-invert-color));
				--flow-btn-hover-color:var(--flow-group-btns-active-color, var(--flow-primary-invert-color));
			}

			:host ::slotted(flow-btn:last-child){
				border-right:0px;
			}

			.wrapper{
				display:flex;flex-direction:row;
				align-items:var(--flow-group-btns-align-items, stretch);
				min-width: var(--flow-group-btns-wrapper-min-width, 50px);
				text-align:center;
				justify-content:var(--flow-group-btns-wrapper-justify, initial);
			}
		`;
	}
	constructor(){
		super()
		this.valueAttr = "data-value";
		this.setAttribute('role', 'buttons');
	}
	render() {
		return html`
		<div class="wrapper" @click=${this.click}>
			<slot></slot>
		</div>
		`;
	}
	firstUpdated(){
		this.listSlot = this.renderRoot.querySelector('slot');
		this.updateList();
	}

	click(e) {
		let target = e.target;
		this.selected = target.getAttribute(this.valueAttr);
		this.fire("flow-group-btns-click", {el:this, selected:this.selected})
		this.updateList();
	}
	updateList(){
		if(!this.listSlot)
			return
		this.listSlot.assignedElements()
			.map(btn=>{
				let selected = this.selected == btn.getAttribute(this.valueAttr);
				btn.classList.toggle("active", selected);
			})
	}
}

FlowGroupBtns.define('flow-group-btns');
