import {BaseElement, html, css} from './base-element.js';
const flowAnchors = [];

/**
* @class FlowAnchor
* @extends BaseElement
* @property {String} [for]
* @property {String} [type]
* @example
*   <flow-anchor>Button 1</flow-anchor>
*
*
*/
export {flowAnchors}
export class FlowAnchor extends BaseElement {
	static get properties() {
		return {
			for : { type : String },
			type : { type : String }
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
			}
		`;
	}

	constructor() {
		super();
		flowAnchors.push(this);
	}

	render() {
		return html`<slot></slot>`;
	}
}

FlowAnchor.define('flow-anchor');