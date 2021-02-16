import {BaseElement, svg, html, css, baseUrl} from './base-element.js';
import { dpc } from './helpers.js';


/**
* @class FlowQRCode
* @extends BaseElement
* @property {String} [for]
* @property {String} [type]
* @example
*   <flow-qrcode></flow-qrcode>
*
*/

export class FlowQRCode extends BaseElement {
	static get properties() {
		return {
			for : { type : String },
			ntype : { type : Number },
			data : { type : String },
			ecl : { type : String },
			mode : { type : String },
			multibyte : { type : String },	
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
			}

			svg {
				width: 100%;
				height: 100%;
			}
			
			:host(.left-img) img{
				object-position:left;
			}
		`;
	}

	constructor() {
		super();

		this.ntype = 0;
		this.ecl = 'M';
		this.mode = 'Byte';
		this.multibyte = 'UTF-8';
		this.data = '';
	}

	render() {
		if(!window.qrcode) {
			dpc(128, () => {
				this.requestUpdate();
			});
			return 'QR';
		}
		if(!this.qr || this.data != this.data_last_) {
			this.data_last_ = this.data;
			this.qr = this.createQRCode(this.data, this.ntype, this.ecl, this.mode, this.multibyte);
		}
		return this.qr;
	}

	createQRCode(text, typeNumber,
		errorCorrectionLevel, mode, mb) {

		window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs[mb];

		var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
		qr.addData(text, mode);
		qr.make();
		let cellSize = 2;
		let margin = cellSize * 4;

		let el = document.createElement('div');
		el.innerHTML = qr.createSvgTag(cellSize, margin);
		return el;
	}

}

FlowQRCode.define('flow-qrcode', [baseUrl+'resources/extern/qrcode/qrcode.js']);