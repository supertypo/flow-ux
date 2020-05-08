import {BaseElement, html, css} from './base-element.js';

/**
 *
 * @export
 * @class FaIcon
 * @extends {BaseElement}
 * @property {String} [style] inner svg tag style text
 * @example
 * <fa-icon class="fal fa-chart-network"></fa-icon>
 */
export class FaIcon extends BaseElement {
	static get properties() {
		return {
			color: String,
			class_: { attribute: 'class' },
			src: String,
			style: String,
			size: Number
		};
	}
	static get styles() {
		return css`
		:host {
			display: inline-block;
			padding: 0;
			margin: 0;
		}
		`;
	}
	static getPrefix(cls){
		let data = cls.split(' ');
		return [this.PREFIX_TO_STYLE[data[0]], this.normalizeIconName(data[1])];
	}

	static get PREFIX_TO_STYLE(){
		return {
			fas: 'solid',
			far: 'regular',
			fal: 'light',
			fab: 'brands',
			fa: 'solid'
		};
	}

	static normalizeIconName(name){
		return name.replace('fa-', '');
	}
	/**
	 * parse className string
	 * @param {String} className i.e `fa fa-chart-network`
	 * @returns {String} url to fontawesome sprites image file
	 */
	getSources(className) {
		let data = this.constructor.getPrefix(className);
		return this.iconPath(data[1]);
	}
	constructor() {
		super();
		this.class_ = '';
		this.src = '';
		this.style = '';
		this.size = 19;
		this.color = '#000';
	}
	firstUpdated() {
		//this.src = this.getSources(this.class_);
	}
	render() {
		this.src = this.getSources(this.class_);
		return html`
		<div class="fa-icon">
		<style>
		svg {
			width: var(--fa-icon-size);
			height: var(--fa-icon-size);
			fill: var(--fa-icon-color);
		}
		</style>
		<svg style="${this.style}">
		<use href="${this.src}"></use>
		</svg>
		</div>
		`;
	}
}
FaIcon.define('fa-icon');