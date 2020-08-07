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
			icon:{type: String},
			expandIcon:{type: String},
			expandable:{type:Boolean},
			expanded:{type:Boolean, reflect:true}
		}
	}

	static get styles() {
		return css`
		:host{
			display:flex;
			align-items:flex-start;
			margin:10px 0px;
		}
		.icon-box,
		.expandable-icon-box{
			width:30px;
			max-width:30px;
			text-align:center;
		}
		.expandable-icon-box svg{cursor:pointer}
		:host([icon="none"]) .icon-box{display:none}
		:host(.no-icon]) .icon-box{display:none}
		:host([no-icon]) .icon-box{display:none}

		.icon-box svg,
		.expandable-icon-box svg{
			width:var(--flow-form-control-icon-box-width,24px);
			height:var(--flow-form-control-icon-box-height,24px);
			margin-right:var(--flow-form-control-icon-box-margin,8px);
			fill:var(--flow-primary-color, rgba(0,151,115,1.0));
		}
		.title-box{
			user-select:none;line-height:24px;cursor:pointer;
		}
		.input-box{
			width: var(--flow-form-control-input-box-width,100px);
			flex:1;
		}
		.input{margin:5px 5px 5px 0px;}
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
		:host([expandable]:not([expanded])) .input,
		:host([expandable]:not([expanded])) .info-box ::slotted(*){
			display:none;
		}
		:host([expanded]:not([static-icon])) .expandable-icon-box svg{
			transform:rotate(90deg)
		}
		`;
	}
	render() {
		let iconSrc = "";
		if(this.icon != "-")
			iconSrc = this.iconPath(this.icon || "info-circle");
		let icon2Src = "";
		if(this.expandIcon != "-")
			icon2Src = this.iconPath(this.expandIcon || "caret-right");
		return html`
			<div class="icon-box" @click="${this.click}"><svg><use href="${iconSrc}"></use></svg></div>
			${
				this.expandable?
				html`<div class="expandable-icon-box" 
					data-flow-expandable="toggle" @click="${this.click}"><svg>
				<use href="${icon2Src}"></use>
				</svg></div>`: ''
			}
			<div class="input-box">
				<label @click="${this.click}" class="title-box" 
					data-flow-expandable="toggle"><slot name="title"></slot></label>
				<div class="input"><slot></slot><slot name="input"></slot></div>
			</div>
			<div class="info-box"><slot name="info"></slot></div>
		`;

	}

	click(){
		// let target = e.target.closest("[data-flow-expandable]")
		// if(!target)
		// 	return
		let action = this.getAttribute("data-flow-expandable") || 'toggle';

		if(["toggle", "open", "close"].includes(action))
			this[action]();
	}

/*	
	firstUpdated(){
		this.renderRoot.addEventListener("click", this._onClick.bind(this));
	}

	_onClick(e){
		let target = e.target.closest("[data-flow-expandable]")
		if(!target)
			return
		let action = target.getAttribute("data-flow-expandable") || 'toggle';

		if(["toggle", "open", "close"].includes(action))
			this[action]();
	}
*/

	open(){
		this.expanded = true;
	}
	close(){
		this.expanded = false;
	}
	toggle(){
		this.expanded = !this.expanded;
	}
}

FlowFormControl.define('flow-form-control');