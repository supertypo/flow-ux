import {BaseElement, html, css, baseUrl} from './base-element.js';

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

	render() {
		if(!this.qr || this.data != this.data_last_) {
//			this.qrdata = this.qrcode.createDataURL(width,height,getPixel)
//			this.qr = this.create_qrcode(this.data);
			this.data_last_ = this.data;
		}
		return html`${this.qrdata}`;
	}


/*



var draw_qrcode = function(text, typeNumber, errorCorrectionLevel) {
  document.write(create_qrcode(text, typeNumber, errorCorrectionLevel) );
};

var create_qrcode = function(text, typeNumber,
    errorCorrectionLevel, mode, mb) {

  qrcode.stringToBytes = qrcode.stringToBytesFuncs[mb];

  var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
  qr.addData(text, mode);
  qr.make();

//  return qr.createTableTag();
//  return qr.createSvgTag();
  return qr.createImgTag();
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