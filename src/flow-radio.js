import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowRadio
 * @extends {BaseElement}
 * @prop {Boolean} checked is ckecbox checked?
 * 
 * @example
 * <flow-radio></flow-radio>
 *
 * @cssvar {color} [--flow-radio-color=var(--flow-border-color, rgba(0,0,0,.54))]
 * @cssvar {background-color} [--flow-radio-bg=var(--flow-input-bg, inherit))]
 * @cssvar {background|border-color} [--flow-radio-checked-color=var(--flow-border-color, var(--flow-primary-color, #3f51b5))]
 * @cssvar {background-color} [--flow-radio-bg=var(--flow-input-bg, inherit)]
 * @cssvar {width} [--flow-radio-outer-width=24px]
 * @cssvar {height} [--flow-radio-outer-height=24px]
 * @cssvar {margin} [--flow-radio-outer-margin=0px 10px 0px 0px]
 * @cssvar {border} [--flow-radio-outer-border=2px solid rgba(0,0,0,.54)]
 * @cssvar {border-color} [--flow-radio-color=var(--flow-border-color, rgba(0,0,0,.54))]
 * @cssvar {background-color} [--flow-radio-bg=var(--flow-input-bg, inherit)]
 * @cssvar {height} [--flow-radio-outline-height=100%]
 * @cssvar {width} [--flow-radio-outline-width=100%]
 * @cssvar {border-color} [--flow-radio-checked-color=var(--flow-border-color, var(--flow-primary-color, #3f51b5))]
 * @cssvar {background-color} [--flow-radio-checked-bg=var(--flow-input-bg, inherit)]		 
 *  
 */
export class FlowRadio extends BaseElement {
	static get properties() {
		return {
			checked:{type:Boolean, reflect: true},
			readonly:{type:Boolean, reflect: true},
			name:{type:String},
			inputValue:{type:String}
		}
	}
	static get styles() {
        return css`
			:host{
				display:inline-block;
				margin-right: var(--flow-radio-margin-right, 10px);
			}
			:host(.block){
				display: block;
				width: max-content;
				margin-bottom: var(--flow-radio-margin-bottom);
			}
			:host(:not([disabled]):not([readonly])) .radio{
				cursor:pointer;
			}
			.radio{
				display:flex;align-items:center;
			    user-select:none;position:relative;
			}
			.radio-input{
			    position:absolute;
			    opacity:0;
			    z-index:0;
				top:0px;
			}
			.radio-outer{
				position:relative;
			    top:0px;
			    left:0;
			    display:inline-block;
			    box-sizing:border-box;
			    width: var(--flow-radio-outer-width,24px);
			    height: var(--flow-radio-outer-height,24px);
			    margin: var(--flow-radio-outer-margin, 0px 10px 0px 0px);
			    cursor:pointer;
			    overflow:hidden;
			    border: var(--flow-radio-outer-border, 2px solid rgba(0,0,0,.54));
			    border-color:var(--flow-radio-color, var(--flow-border-color, rgba(0,0,0,.54)));
			    border-radius:50%;
			    z-index:2;
			    background-color:var(--flow-radio-bg, var(--flow-input-bg, inherit));
			    transition-duration: .28s;
			    transition-timing-function: cubic-bezier(.4,0,.2,1);
			    transition-property: background;
			}
			.outline{
				position: absolute;
			    top: 15%;
			    left: 15%;
			    height: var(--flow-radio-outline-height, 70%);
			    width: var(--flow-radio-outline-width, 70%);
                border-radius:50%;
                background: 0 0;
			    transition-duration: .28s;
			    transition-timing-function: cubic-bezier(.4,0,.2,1);
			    transition-property: background;
			}
			.radio-input:checked+.radio-outer{
				border: 2px solid #3f51b5;
				border-color:var(--flow-radio-checked-color, var(--flow-border-color, var(--flow-primary-color, #3f51b5)));
			}
			.radio-input:checked+.radio-outer .outline{
				background:var(--flow-radio-checked-color, var(--flow-border-color, var(--flow-primary-color, #3f51b5)));
			}
			.radio-input:checked+.radio-outer{
				background-color:var(--flow-radio-checked-bg, var(--flow-input-bg, inherit));
			}

		`;
	}
	constructor(){
		super();
		this.checked = false;
		this.name = this.name||"radio-"+Date.now();
	}
	render(){
        let {name} = this;
		return html`
		<label class="radio">
			<input class="radio-input" type="radio" @change="${this.onChange}" 
				?disabled=${this.readonly} .checked="${this.checked}"
				.name="${name}" .value="${this.inputValue||'ON'}">
			<div class="radio-outer"><div class="outline"></div></div>
			<slot></slot>
		</label>
		`;
	}
	get value(){
		return !!this.checked;
	}
	set value(checked){
		this.setChecked(checked)
	}
	onChange(e){
		this.setChecked(e.target.checked);
	}
	toggle(){
		this.setChecked(!this.checked)
	}
	setChecked(checked){
		let lastChecked = this.checked;
		this.checked = !!checked;
		if(lastChecked != this.checked)
			this.fireChangeEvent();
	}
	fireChangeEvent(){
		this.fire("changed", {
			checked: this.checked,
			name:this.name,
			value:this.inputValue||'ON'
		}, {bubbles:true});

		if(this.checked)
			this.fire("flow-radio-checked", {
				name: this.name,
				el:this
			}, {}, window);
	}
	firstUpdated(...args){
		super.firstUpdated(...args);
		this.registerListener("flow-radio-checked", (e)=>{
			let {name, el} = e.detail||{};
			if(name == this.name && el!=this){
				//console.log("el, name", el, name)
				this.setChecked(false);
			}
		});
	}
}

FlowRadio.define('flow-radio');