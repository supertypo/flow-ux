

import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowShellLink
* @extends BaseElement
* @example
*   <flow-shell-link href="url">text</flow-btn>
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {color} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {color} [--flow-border-hover-color=var(--flow-primary-color, rgba(0,151,115,1))]
*/
export class FlowShellLink extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			icon:{type:Boolean, reflect: true},
			href : { type : String }
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-font-family, "Julius Sans One");
				font-weight:var(--flow-font-weight, bold);
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
		super()
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
		this.fire("flow-shell-link-click", {el:this})
		console.log("opening href:",this.href);
		require('nw.gui').Shell.openExternal( this.href );

	}
}

FlowShellLink.define('flow-shell-link');