import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowGroupBtns
* @extends BaseElement
* @property {Boolean} [disabled]
* @property {Boolean} [toggleable] 
* @property {String} [selected=""] 
* @property {String} [valueAttr="data-value"] 
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {border-radius} [--flow-btn-radius=8px]
* @cssvar {margin} [--flow-group-btns-margin]
* @cssvar {border-color} [--flow-group-btns-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {border-width} [--flow-group-btns-border-width=1px]
* @cssvar {font-size} [--flow-group-btns-font-size=initial]
* @cssvar {line-height} [--flow-group-btns-line-height=inherit]
* @cssvar {align-items} [--flow-group-btns-align-items=stretch]
* @cssvar {min-width} [--flow-group-btns-wrapper-min-width=50px]
* @cssvar {justify-content} [--flow-group-btns-wrapper-justify=initial]
* @example
*   <flow-group-btns selected="1">
*		<flow-btn data-value="1">Button 1</flow-btn>
*		<flow-btn data-value="2">Button 2</flow-btn>
*	</flow-group-btns>
*/

/*
... @ cssvar {--flow-btn-bg-color} [--flow-group-btns-active-bg-color=var(--flow-primary-color)]
... @ cssvar {--flow-btn-color} [--flow-group-btns-active-color=var(--flow-primary-invert-color)]
... @ cssvar {--flow-btn-hover-color} [--flow-group-btns-active-color=var(--flow-primary-invert-color)]
*/

export class FlowGroupBtns extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			selected:{type:String},
			valueAttr:{type:String},
			toggleable:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				margin: var(--flow-group-btns-margin);
				padding:0px;
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
	updated(...args){
		super.updated(...args);
		this.updateList();
	}

	click(e) {
		if(this.disabled)
			return
		let target = e.target;
		let selected = target.getAttribute(this.valueAttr);
		if(this.toggleable && this.selected == selected){
			selected = "";
		}

		this.log("selected", selected)

		this.selected = selected;
		this.fire("group-btn-select", {el:this, selected})
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
