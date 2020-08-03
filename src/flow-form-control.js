import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowFormControl
 * @extends {BaseElement}
 * 
 * @property {String} [icon=light-info] icon to show in left
 * @cssvar {fill} [--flow-primary-color=rgba(0,151,115,1)]
 * @example
 * <flow-form-control>
 *   Is Active: 
 *   <flow-checkbox-test slot="input"></flow-checkbox-test>
 * </flow-form-control>
 */
export class FlowFormControl extends BaseElement {
	static get properties() {
		return {
			icon:{type: String}
		}
	}

	static get styles() {
		return css`
		:host{
			display:flex;
			align-items:flex-start;
			margin:10px 0px;
		}
		.icon-box{
			width:30px;
			max-width:30px;
			text-align:center;
		}
		:host([icon="none"]) .icon-box{display:none}
		:host(.no-icon]) .icon-box{display:none}
		:host([no-icon]) .icon-box{display:none}

		.icon-box svg{
			width:24px;
			height:24px;
			margin-right: 8px;
			fill:var(--flow-primary-color, rgba(0,151,115,1.0));
		}
		.input-box{
			width: var(--flow-form-control-input-box-width,100px);
			flex:1;
		}
		.input{margin:5px 5px 5px 10px;}
		:host([no-help]) .info-box,
		:host([no-info]) .info-box{
			display:none;
		}
		.info-box{
			flex:1;
			max-width:300px;
			padding:0px 10px;
		}
		.info-box ::slotted(*){
			margin:unset;
		}
		.info-box ::slotted(h4.title){
			border-bottom: 1px solid #ddd;
		    margin:0px 0px 10px 0px;
		    font-weight: bold;
		    font-size: 1.1em;
		}
		.info-box ::slotted(p){
			font-size:0.8em;
		}
		/*
		.input-box ::slotted(flow-folder-input){
			--flow-folder-input-width:100%;
			--flow-folder-input-min-width:100px;
			--flow-folder-input-max-width:500px;
		}
		*/
		`;
	}
	render() {
		let iconSrc = "";
		if(this.icon != "-")
			iconSrc = this.iconPath(this.icon || "info-circle");
		return html`
			<div class="icon-box"><svg><use href="${iconSrc}"></use></svg></div>
			<div class="input-box">
				<label class="title-box"><slot name="title"></slot></label>
				<div class="input"><slot></slot><slot name="input"></slot></div>
			</div>
			<div class="info-box"><slot name="info"></slot></div>
		`;

	}
}

FlowFormControl.define('flow-form-control');