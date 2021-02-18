import {BaseElement, html, css} from './base-element.js';
import {ProgressBar} from '../resources/extern/progressbar.js/progressbar.js';
//import {colorMixer} from './colors.js';
/*
window.colorMixer = (q=0.5)=>{
	let color = colorMixer("#E0101B", "#28F003", q)
	console.log("color####", color)
	document.body.style.backgroundColor = color
}
*/



/**
* @class FlowProgressbar
* @extends BaseElement
* @property {String} [color]
* @property {String} [easing]
* @example
*   <flow-progressbar color="#red" value="0.3"></flow-progressbar>
*
*
*/
export class FlowProgressbar extends BaseElement {
	static get properties() {
		return {
			value:{type: Number},
			strokeWidth:{type: Number},
			trailWidth:{type: Number},
			trailColor:{type: String},
			color:{type: String},
			easing:{type: String},
			svgStyle:{type: String},
			shape:{type:String},
			opt:{type: Object}
		}
	}

	static get styles() {
		return css`
			:host {
				display:inline-block;
				width:var(--flow-progressbar-width, 30px);
				height:var(--flow-progressbar-height, 30px);
				/*
				--flow-progressbar-color:red;
				--flow-progressbar-trail-color:green;
				*/
			}
			.container{width:100%;height:100%;}
		`;
	}

	render() {
		return html`<div class="container"></div>`;
	}
	updated(){
		super.updated();
		let {
			value=0, opt={},
			strokeWidth, color, easing,
			duration, trailColor, trailWidth, svgStyle,
			shape="Circle"
		} = this;

		let defaultOpt = {
			strokeWidth: 6,
			easing: 'easeInOut',
			duration: 1400,
			color: 'var(--flow-progressbar-color, #FF0000)',
			trailColor: 'var(--flow-progressbar-trail-color, #efefef)',
			trailWidth: 6,
			svgStyle: null
		}
		let definedOpts = {color, easing, duration}
		let entries = Object.entries(definedOpts).filter(([k, v])=>v!==undefined)
		definedOpts = Object.fromEntries(entries)
		//console.log("definedOpts", definedOpts)

		let options = {...defaultOpt, ...opt, definedOpts};
		this.el = this.el || this.renderRoot.querySelector(".container")
		this.progress = this.progress || new ProgressBar[shape](this.el, options);
		this.progress.stop();
		this.progress.animate(value, {/*
			from: { color: options.color },
    		to: { color: options.color }
		*/}, ()=>{
			//this.progress.path.setAttribute('stroke', options.color);
		});

		//this.progress.path.setAttribute('stroke', options.color);
	}
}

FlowProgressbar.define('flow-progressbar');
