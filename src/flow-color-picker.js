import {BaseElement, html, css} from './base-element.js';

/**
* @class FlowColorPicker
* @extends BaseElement
* @property {String} [color]
* @example
*   <flow-color-picker color="#F00"></flow-color-picker>
*
*
*/
export class FlowColorPicker extends BaseElement {
	static get properties() {
		return {
			color:{type:String}
		}
	}

	static get styles() {
		return css`
			:host{
				display:inline-block;width:20px;height:20px;
				position:relative;box-sizing:border-box;
				border:var(--flow-color-picker-border, 1px solid var(--flow-border-color, var(--flow-primary-color, #FFF)));
			}
			.box{width:100%;height:100%}
			:host(:not([disabled])) input{
				cursor:pointer;
			}
			:host([disabled]) input{display:none}
			input.color{
				opacity:0;
				position:absolute;left:0px;top:0px;width:100%;height:100%;
				right:0px;buttom:0px;
			}
		`;
	}

	render() {
		return html`<div class="box" style="background-color:${this.color}"></div><input 
		class="color" type="color" .value="${this.color||""}"
		@change="${this.onInputChange}" 
		@input="${this.onInputChange}" />`;
	}

	onInputChange(e){
		this.color = e.target.value;
		this.fire("changed", {color:this.color}, {bubbles:true})
	}
}

FlowColorPicker.define('flow-color-picker');
