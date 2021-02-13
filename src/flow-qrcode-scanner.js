import {BaseElement, html, css, baseUrl} from './base-element.js';
import { dpc } from './helpers.js';

export class FlowQRCodeScanner extends BaseElement {
	static get properties() {
		return {
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
				/*
				min-width: 32px;
				min-height: 32px;
				*/
			}

		`;
	}

	constructor() {
		super();

	}

	render() {
		return html``;
	}

}

FlowQRCodeScanner.define('flow-qrcode-scanner', [baseUrl+'resources/extern/html5-qrcode/html5-qrcode.min.js']);