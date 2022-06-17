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
			value:{type:String},
			height : { type : Number },
			autosize : { type : Boolean },
			autocomplete : { type : Boolean },
			autofocus : { type : Boolean },
			disabled : { type : Boolean, reflect : true },
			placeholder : { type : String },
			readonly : { type : Boolean },
			label:{type:String},
			maxlength : { type : Number }
		}
	}

	static get styles() {
		return css`
		:host {
			display:var(--flow-input-display, inline-block);
			vertical-align:middle;
			font-family:var(--flow-font-family, "Julius Sans One");
			font-weight:var(--flow-font-weight, bold);
			width:var(--flow-input-width, 100%);
			min-width:var(--flow-input-min-width, 100px);
			max-width:var(--flow-input-max-width, 500px);
			margin:var(--flow-input-margin, 5px 0px);
			font-size:0px;
		}
		label{
			font-size:var(--flow-input-label-font-size, 0.7rem);
			padding:var(--flow-input-label-padding,2px 5px);
			border: var(--flow-input-label-border, 2px) solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
			border-radius:var(--flow-input-label-border-radius, 8px);
			margin-left: var(--flow-input-label-margin-left,10px);
			z-index: var(--flow-input-label-z-index, 1);
			position: var(--flow-input-label-position, relative);
			background-color:var(--flow-input-bg, inherit);
		}
		textarea{

			width:var(--flow-input-input-width, 100%);
			box-sizing:border-box;
			height:var(--flow-input-height);
			border: var(--flow-input-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
			border-radius:var(--flow-input-border-radius, 8px);
			margin:0px;
			padding:var(--flow-input-padding, 10px);
			font-size:var(--flow-input-font-size, 1rem);
			font-weight:var(--flow-input-font-weight, 400);
			font-family:var(--flow-input-font-family);
			line-height:var(--flow-input-line-height, 1.2);
			box-shadow:var(--flow-input-box-shadow);
			text-align:var(--flow-input-text-align);
			min-width:var(--flow-input-input-min-width, 10px);
			letter-spacing:var(--flow-input-letter-spacing, inherit);

			min-width: 200px;
			min-height: 32px;
			overflow: hidden;
			overflow-y:hidden;
			outline: none;
			resize: none;
			background-color: var(--flow-textarea-bg, var(--flow-input-bg, #fafafa));
			color: var(--flow-textarea-color, var(--flow-input-color, inherit));
			margin-top: var(--flow-input-wrapper-margin-top,-0.5rem);
		}
		textarea[has-label]{
			padding-top:var(--flow-input-with-label-input-padding-top, 15px)
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
		return this.renderRoot && this.renderRoot.querySelector('textarea');
	}

	get() {
		return this.textarea.value;
	}

	set(value) {
		this.textarea.value = value;
		this.change();
	}

	render() {
		//this.log("RENDERING TEXTAREA");
		let isLabel = !!this.label;
		return html`
			<label ?hidden=${!isLabel}>${this.label||""}</label>
			<textarea id="textarea-${this.ident}"
				@input="${this.change}" 
				autocomplete="${this.autocomplete}"
				?autofocus="${this.autofocus}"
				placeholder="${this.placeholder}"
				?readonly="${this.readonly}"
				?disabled="${this.disabled}"
				?has-label="${isLabel}"
				maxlength="${ifDefined(this.maxlength)}"
				.value="${this.value}"
			></textarea>
		`;

	}

	change() {
		let textarea = this.textarea;
		textarea.style.height = 'auto';
		let style = window.getComputedStyle(textarea);
		let border = parseFloat(style.getPropertyValue('border-width')) * 2;
		textarea.style.height = (textarea.scrollHeight+border)+'px';
		this.value = this.textarea.value;
		this.fire("changed", {el:this, value:this.textarea.value});
	}
}

FlowTextArea.define('flow-textarea');