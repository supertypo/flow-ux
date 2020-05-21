import {BaseElement, html, css} from './base-element.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';

/**
 * @export
 * @class FlowTextArea
 * @extends {BaseElement}
 * 
 * @property {Number} [height] height in number
 * @property {Boolean} [autocomplete=false] textarea attribute autocomplete
 * @property {Boolean} [autofocus=false] set true to autofocus textarea
 * @property {Boolean} [autosize=false] set true to autosize textarea
 * @property {Boolean} [disabled=false] set true to disable textarea
 * @property {String} [placeholder=''] textarea placeholder text
 * @property {Boolean} [readonly=false] set true to make textarea as readonly
 * @property {Number} [maxlength] set maxlength of textarea
 * 
 * @example
 * <flow-textarea></flow-textarea>
 *
 * @cssvar {border} [--flow-border-color=var(--flow-primary-color, #3f51b5)]
 * @cssvar {background} [--flow-textarea-bg=var(--flow-input-bg, #fafafa)]
 * @cssvar {color} [--flow-textarea-color=var(--flow-input-color, inherit)]
 */
export class FlowTextArea extends BaseElement {
	static get properties() {
		return {
			height : { type : Number },
			autosize : { type : Boolean },
			autocomplete : { type : Boolean },
			autofocus : { type : Boolean },
			disabled : { type : Boolean, reflect : true },
			placeholder : { type : String },
			readonly : { type : Boolean },
			maxlength : { type : Number }
		}
	}

	static get styles() {
		return css`
		:host {
			min-height: 32px;
			min-width: 200px;
			display: block;
		}
		`;
	}

	constructor() {
		super();

		this.ident = Math.round((Math.random()*1e16)).toString(16);

		this.height = 0;
		this.autosize = true;
		this.autocomplete = false;
		this.autofocus = false;
		this.disabled = false;
		this.placeholder = '';
		this.readonly = false;
		this.maxlength = undefined;
		this.value = this.innerHTML;
		this.innerHTML = "";
	}

	get textarea() {
		return this.shadowRoot && this.shadowRoot.getElementById(`textarea-${this.ident}`);
	}

	render() {
		//this.log("RENDERING TEXTAREA");
		return html`
			<style>
				#textarea-${this.ident} {
					xheight : ${this.height};
					border: 2px solid var(--flow-border-color, var(--flow-primary-color, #3f51b5));
					border-radius: 12px;
					min-width: 200px;
					width:100%;
					box-sizing:border-box;
					min-height: 32px;
					overflow-y:hidden;
					font-family: "Open Sans";
					overflow: hidden;
					padding: 8px 16px 16px 16px;
					outline: none;
					resize: none;
					background-color: var(--flow-textarea-bg, var(--flow-input-bg, #fafafa));
					color: var(--flow-textarea-color, var(--flow-input-color, inherit));
				}
			</style>
			TEXTAREA:<br/>
			<textarea id="textarea-${this.ident}"
				@input="${this.change}" 
				autocomplete="${this.autocomplete}"
				?autofocus="${this.autofocus}"
				placeholder="${this.placeholder}"
				?readonly="${this.readonly}"
				?disabled="${this.disabled}"
				maxlength="${ifDefined(this.maxlength)}"
				.value="${this.value}"
			></textarea>
		`;

	}

	change() {
		//this.log("TEXT AREA CHANGE");
		let textarea = this.textarea; // this.shadowRoot.querySelector("textarea");
		
		textarea.style.height = 'auto';
		let style = window.getComputedStyle(textarea);
		let padding = 0;//-4;//parseFloat(style.getPropertyValue('padding-top')) + parseFloat(style.getPropertyValue('padding-bottom'));
		let border = parseFloat(style.getPropertyValue('border-width')) * 2;// + parseFloat(style.getPropertyValue('padding-bottom'));
		textarea.style.height = (textarea.scrollHeight+border)+'px';
		//let height = 
		//this.height = (textarea.scrollHeight-padding)+'px';
		//console.log(textarea.scrollHeight, height);
	}
}

FlowTextArea.define('flow-textarea');