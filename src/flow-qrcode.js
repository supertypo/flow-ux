import {BaseElement, html, css, baseUrl} from './base-element.js';
import { dpc } from './helpers.js';

if(!window.__FLOW__QRCODE__){
	let qrcode = document.createElement("script");
	qrcode.src = baseUrl+'resources/extern/qrcode/qrcode.js';
	document.head.appendChild(qrcode);
}


/**
* @class FlowQRCode
* @extends BaseElement
* @property {String} [for]
* @property {String} [type]
* @example
*   <flow-qrcode></flow-qrcode>
*
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
				/*
				min-width: 32px;
				min-height: 32px;
				*/
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				image-rendering: pixelated;
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
			//this.qrdata = this.qrcode.createDataURL(width,height,getPixel)
			//this.qr = this.create_qrcode(this.data);
			
			this.data_last_ = this.data;

			this.qr = this.createQRCode(this.data, this.ntype, this.ecl, this.mode, this.multibyte);


			// let template = document.createElement('template');
			// template.innerHTML = qr.trim();
			// this.qr = template.content.firstChild.cloneNode(true);
			//this.svg = template.content.firstChild.cloneNode(true);
		}
		return this.qr; //html`${this.qr}`;
	}

	createQRCode(text, typeNumber,
		errorCorrectionLevel, mode, mb) {

		window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs[mb];

		var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
		qr.addData(text, mode);
		qr.make();
		let cellSize = 2;
		let margin = cellSize * 4;


		return html`<img src="${qr.createDataURL(cellSize, margin)}">`;
	}
	

/*



var draw_qrcode = function(text, typeNumber, errorCorrectionLevel) {
  document.write(create_qrcode(text, typeNumber, errorCorrectionLevel) );
};


var update_qrcode = function() {
  var form = document.forms['qrForm'];
  var text = form.elements['msg'].value.
    replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  var t = form.elements['t'].value;
  var e = form.elements['e'].value;
  var m = form.elements['m'].value;
  var mb = form.elements['mb'].value;
  document.getElementById('qr').innerHTML =
    create_qrcode(text, t, e, m, mb);
};

*/



}

FlowQRCode.define('flow-qrcode');