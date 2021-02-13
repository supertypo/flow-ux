import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowT9
* @extends BaseElement

* @property {Boolean} [disabled]
* @property {String} [value]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @example
*   <flow-t9 value="123.4"></flow-t9>
*
*/
export class FlowT9 extends BaseElement {
	static get properties() {
		return {
			value:{type:String},
			disabled:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-font-family, "Julius Sans One");
				font-weight:var(--flow-font-weight, bold);
				width:var(--flow-t9-width, 100%);
			}
			.row{
				display:flex;
				align-items:stretch;
				min-width:60px;
				text-align:center;
				justify-content:space-evenly;
				margin-bottom:5px;
			}
			flow-btn{
				margin:var(--flow-t9-btn-margin, 5px);
				padding:var(--flow-t9-btn-padding, 0px);
				box-size:border-box;
				border-radius:var(--flow-t9-btn-border-radius, 50%);
				--flow-btn-wrapper-min-width:10px;
				width:var(--flow-t9-btn-width, 50px);
				height:var(--flow-t9-btn-height, 50px);
    			font-size:var(--flow-t9-btn-font-size, 1.5rem);
			}
		`;
	}
	render() {
		let {value=""} = this;
		return html`
		<div class="wrapper" @click=${this.onClick}>
			<div class="row">
				<flow-btn full-height-wrapper data-v="1">1</flow-btn>
				<flow-btn full-height-wrapper data-v="2">2</flow-btn>
				<flow-btn full-height-wrapper data-v="3">3</flow-btn>
			</div>
			<div class="row">
				<flow-btn full-height-wrapper data-v="4">4</flow-btn>
				<flow-btn full-height-wrapper data-v="5">5</flow-btn>
				<flow-btn full-height-wrapper data-v="6">6</flow-btn>
			</div>
			<div class="row">
				<flow-btn full-height-wrapper data-v="7">7</flow-btn>
				<flow-btn full-height-wrapper data-v="8">8</flow-btn>
				<flow-btn full-height-wrapper data-v="9">9</flow-btn>
			</div>
			<div class="row">
				<flow-btn full-height-wrapper data-v="." 
					?disabled="${value.includes('.')}">.</flow-btn>
				<flow-btn full-height-wrapper data-v="0">0</flow-btn>
				<flow-btn full-height-wrapper data-v="backspace"
					?disabled="${!value}">&lt;</flow-btn>
			</div>
		</div>
		`;
	}

	setClear(){
		this.setValue("");
	}

	onClick(e) {
		let btnEl = e.target.closest("flow-btn")
		if(!btnEl)
			return
		let btn = btnEl.dataset.v;
		let {value=""} = this;
		if(btn=="." && value.includes("."))
			return

		let result = this.fire("btn-click", {el:this, btn, btnEl}, {cancelable:true}, null, true)
		if(result.defaultPrevented)
			return
		
		if(btn=="backspace"){
			value = value.substring(0, value.length-1);
		}else{
			if(btn=="." && value===""){
				value = "0"
			}
			value += btn;
		}

		this.setValue(value);
	}

	setValue(value){
		this.value = value;
		this.fire("changed", {el:this, value:this.value})
	}
}

FlowT9.define('flow-t9');