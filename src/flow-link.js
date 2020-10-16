

import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowLink
* Wraps content in a clickable element, simulating behavior of the `a` element.
* Intended for opening a new browser tab regardless of whether the element is
* instantiated inside of a browser environment or inside of NWJS.
* @extends BaseElement
*
* @property {Boolean} [disabled] 
* @property {Boolean} [icon]
* @property {String} [href]
* @property {String} [target]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {font-size} [--flow-link-font-size=1rem]
* @cssvar {color} [--flow-link-color=#017b68]
* @cssvar {color} [--flow-link-hover-color=#017b68]
* @cssvar {fill} [--flow-primary-color=017b68]
*
* @example
*   <flow-link href="href" target="_blank">text</flow-link>
*
*/
export class FlowLink extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			icon:{type:Boolean, reflect: true},
			href : { type : String },
			target : { type : String }
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-link-font-family, var(--flow-font-family, "Julius Sans One"));
				font-weight:var(--flow-link-font-weight, var(--flow-font-weight, bold));
				font-size:var(--flow-link-font-size, 1rem);
			}
			:host([disabled]){
				opacity:0.5;
				cursor:default;
				pointer-events:none;
			}
			:host(:not([disabled])){
				cursor:pointer;
			}

			.link-wrapper {
				color: var(--flow-link-color, #017b68);
				display: flex;
			}

			.link-wrapper:hover {
				color: var(--flow-link-hover-color, #017b68);
			}

			.icon-box {
				display: block;
				width: 16px;
				height: 16px;
				margin-bottom: -4px;
				opacity: 0.65;
			}

			.icon-box svg {
				fill: var(--flow-primary-color, #017b68);
				width: 100%;
				height: 100%;
			}

			.content {
				display: block;
			}
		`;
	}

	constructor(){
		super();
	}

	render() {
		let iconSrc = this.iconPath(`external-link-square-alt`);
		return html`
		<div class="link-wrapper" @click=${this.click}>
			<div class="content"><slot></slot></div>
			${ this.icon ? html`<div class="icon-box"><svg><use href="${iconSrc}"></use></svg></div>` : '' }
		</div>
		`;
	}

	click() {
		// console.log("opening href:",this.href,"target:",this.target);
		this.fire("flow-link-click", {el:this})
		if(!this.href)
			return
		if(typeof nw == 'undefined') {
			let a = document.createElement('a');
			a.href = this.href;
			if(this.target)
				a.target = this.target;
			a.click();
		} else {
			require('nw.gui').Shell.openExternal(this.href);	
		}
	}

}

FlowLink.define('flow-link');