import {BaseElement, html, css} from './base-element.js';
if(!window.marked){
	const marked = document.createElement("script");
	marked.src = baseUrl+'resources/extern/marked/marked.min.js';
	document.head.appendChild(marked);
}

/**
* @class FlowMarkdown
* @extends BaseElement
* @property {String} [type]
* @example
*   <flow-markdown>fn()</flow-markdown>
*
*
*/

export class FlowMarkdown extends BaseElement {
	static get properties() {
		return {
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
    }
    
    firstUpdated() {
        const slot = this.shadowRoot.querySelector('slot');
        // TODO https://github.com/markedjs/marked
    }

	render() {
		return html`<slot></slot><div></div>`;
	}
}

FlowMarkdown.define('flow-markdown');