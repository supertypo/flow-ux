import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowExpandable
 * @extends {BaseElement}
 * @property {String} [icon=light-info] icon to show on the left of the expandable element
 * @property {Boolean} [opened] 
 * @prop {Boolean} no-info
 * @cssvar {fill} [--flow-primary-color=rgba(0,151,115,1)]


 * 
 * @example
 * <flow-expandable>
 *   <div slot="title">Is Active:</div>
 *   <flow-checkbox></flow-checkbox>
 * </flow-expandable>
 */
export class FlowExpandable extends BaseElement {
	static get properties() {
		return {
			icon:{type: String},
			opened:{type:Boolean, reflect:true},
			'no-info':{type:Boolean, reflect:true}
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
		.icon-box, .title-box{
			display:flex;
			align-items:center;
			min-height:30px;
			cursor:pointer;
			user-select:none;
		}
		.title-box{
			position:relative;
		}
		.title-box:after{
			position:absolute;
			left:0px;
			top:0px;
			content:"";
			z-index:1;
			width:100%;
			height:100%;
		}
		.icon-box svg{
			width:24px;
			height:24px;
			margin-right: 8px;
			fill:var(--flow-primary-color, rgba(0,151,115,1.0));
		}
		.content-box{
			width:100px;
			flex:1;
		}
		.content{margin:5px 5px 5px 10px;}

		.info-box{
			flex:1;
			max-width:300px;
			padding:0px 10px;
		}
		:host([no-help]) .info-box,
		:host([no-info]) .info-box{
			display:none
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
		:host(:not([opened])) .content{display:none}
		:host([opened]) svg{
			transform:rotate(90deg)
		}
		`;
	}
	render() {
		let iconSrc = "";
		if(this.icon != "-")
			iconSrc = this.iconPath(this.icon || "caret-right");
		return html`
			<div class="icon-box" data-flow-expandable="toggle"><svg><use href="${iconSrc}"></use></svg></div>
			<div class="content-box">
				<label class="title-box" data-flow-expandable="toggle"><slot name="title"></slot></label>
				<div class="content"><slot></slot></div>
			</div>
			<div class="info-box"><slot name="info"></slot></div>
		`;
	}
	firstUpdated(){
		this.renderRoot.addEventListener("click", this._onClick.bind(this));
	}

	_onClick(e){
		let $target = $(e.target).closest("[data-flow-expandable]")
		if(!$target.length)
			return
		let action = $target.attr("data-flow-expandable") || 'toggle';

		if(["toggle", "open", "close"].includes(action))
			this[action]();
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
}

FlowExpandable.define('flow-expandable');