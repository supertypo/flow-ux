import {BaseElement, html, css} from './base-element.js';

/**
 *
 * @export
 * @class FaIcon
 * @extends {BaseElement}
 * @property {String} [style] inner svg tag style text
 * @example
 * <fa-icon icon="fal:chart-network"></fa-icon>
 * <fa-icon icon="icons:chart-network"></fa-icon>
 */
export class FaIcon extends BaseElement {
	static get properties() {
		return {
			color:String,
			src: String,
			style: String,
			css: String,
			size:Number,
			w:Number,
			h:Number,
			icon:String
		};
	}
	static get styles() {
		return css`
		:host {
			display: inline-block;
			padding: var(--fa-icon-padding, 0px);
			margin: var(--fa-icon-margin, 0px);
			width: var(--fa-icon-size, 19px);
			height: var(--fa-icon-size, 19px);
		}
		svg,img{
			width: var(--fa-icon-size, 19px);
			height: var(--fa-icon-size, 19px);
			fill: var(--fa-icon-color);
		}
		img{object-fit:contain;}
		`;
	}
	constructor() {
		super();
		this.src = '';
		this.style = '';
		this.css = '';
		//this.size = 19;
		this.color = '';
	}
	firstUpdated() {
		//this.src = this.getSources(this.class_);
	}
	render() {
		this.src = this.iconPath(this.icon);
		//let size1 = this.style.getPropertyValue("--fa-icon-size");
		//console.log("size1size1", size1)
		let {size, color, w, h} = this;
		w = (w||size)?`width:${w||size}px;`:'';
		h = (h||size)?`height:${h||size}px;`:'';
		color = color?`fill:${color};`:'';
		let ext = this.src.split(/\?#/)[0].split(".").pop().toLowerCase();
		if(['png', 'jpeg', 'jpg'].includes(ext)){
			return html`<img style="${w}${h}${color}${this.css||''}" src="${this.src}" />`;
		}
		return html`
		<svg style="${w}${h}${color}${this.style}"><use href="${this.src}"></use></svg>
		`;
	}
}
FaIcon.define('fa-icon');