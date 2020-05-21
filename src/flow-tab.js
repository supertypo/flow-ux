import {BaseElement, html, css} from './base-element.js';
/**
* @typedef {Object} FlowTabConfig Plain Object with following properties
* @prop {String} title text to display inside of tab
* @prop {String} id tab id
*/

/**
* @class FlowTab
* @extends BaseElement
* @export FlowTab
*
* @prop {Boolean} active is tab active?
*
* @cssvar {font-family} [--flow-tab-font-family=var(--flow-font-family, "Julius Sans One")]
* @cssvar {font-family} [--flow-tab-font-weight=var(--flow-font-weight, bold)]
* @cssvar {font-family} [--flow-tab-font-size=var(--flow-font-size, 1.5rem)]
* @cssvar {color} [--flow-primary-color=rgba(0,151,115,1)]
* @cssvar {stroke} [--flow-tab-border-color=var(--flow-border-color, --flow-primary-color)]
* @cssvar {css-unit} [--flow-tab-wrapper-max-width=150px]
* @cssvar {max-width} [--flow-tab-wrapper-max-width=150px]
*
* @example
*   <flow-tab id="tab1">TAB 1</flow-tab>
*
*/

export class FlowTab extends BaseElement {
	static get properties() {
		return {
			active : { type : Boolean, reflect:true },
			//handler : { type : Object }
			//caption : { type : String }
		}
	}

	static get styles(){
		return css`
		:host{
			display:flex;
			align-items:center;
			position:relative;
			pointer-events:none;
			color: var(--flow-primary-color, rgba(0,151,115,1.0));
			font-family: var(--flow-tab-font-family, var(--flow-font-family, "Julius Sans One"));
			font-weight: var(--flow-tab-font-weight, var(--flow-font-weight, bold));
			font-size: var(--flow-tab-font-size, var(--flow-font-size, 1.5rem));
		}
		:host(:not([disabled])){
			cursor:pointer;
		}
		.wrapper {
			padding:0px 40px;
			position: relative;
			pointer-events:none;
			display:flex;
			flex-direction:column;
			align-items:center;
			white-space: nowrap;
		    max-width: var(--flow-tab-wrapper-max-width, 150px);
		    overflow: hidden;
		    text-overflow: ellipsis;
		}
		.text{
			max-width:100%;box-sizing:border-box;overflow: hidden;
		    text-overflow: ellipsis;
		}
		.background {
			position:absolute;
			left: 0px;
			top: 0px;
			width:100%;
			height:100%;
			pointer-events:none;
		}

		svg {
			position: absolute;
			left: 0px;
			top: 0px;
			z-index:0;
			pointer-events:none;
			overflow:visible;
		}

		path {
			pointer-events:auto;
			-webkit-app-region:no-drag;
			stroke: var(--flow-tab-border-color, var(--flow-border-color, --flow-primary-color));
		}
		`;
	}

	constructor() {
		super();
		this.caption = this.firstChild ? this.firstChild.cloneNode(true) : '';
		this.ident = Math.round((Math.random()*1e16)).toString(16);
		this.template = document.createElement('template');

		new ResizeObserver(()=>{
			this.requestUpdate();
		}).observe(this);
	}

	generate() {
		this.rect = this.getBoundingClientRect();
		if(!this.rect.width)
			return;

		let width = this.rect.width;
		let height = this.rect.height;

		let margin = 50;

		let path = `<path id="path-${this.ident}"
   			style="fill:url(#gradient-${this.ident});stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
   			d="`; //"// 0,${height} `;

   		if(window.flowConfig && window.flowConfig.flowTab){
			let atanRange = 20;
			let atanMax = Math.atan(atanRange*0.5);
			let minY = ( 1.0 - (Math.atan(atanRange * 0.5) + atanMax) / (atanMax*2)) * (height-1);
			for(let x = 0; x < width; x++) {
				let y = 0;
				if(x < margin * 1) {
					let v = (x / margin - 0.5) * atanRange;
					y = ( 1.0 - (Math.atan(v) + atanMax) / (atanMax*2)) * (height-1);// * 1.05 - 5;// - 0.75;
				}
				else
				if(x > width-margin*1) {
					let v = ((width - x) / margin - 0.5) * atanRange;
					y = ( 1.0 - (Math.atan(v) + atanMax) / (atanMax*2)) * (height-1);// * 1.05 - 5;// - 0.75;
				}
				else {
					y = minY;
				}

				if(x == 0) {
					path += `M -3480,${height+1} -3480,${y} `;
				}else if(x > width-2) {
					path += `L 3480 ${y} L 3480 ${height+1} `;
				}else{
					path += `L ${x} ${y} `;
				}
			}
		}else{
			//margin = 20;//margin*0.1;
			let y = height;
			let halfM = margin/2;
			path += `M -3480,${y+40}`;
			path += `L -3480 ${y}`;
			path += `L 0,${y}`;
			path += `C ${halfM},${y} 0,0 ${halfM},0`;
			path += `L ${width-halfM},0`;
			path += `C ${width},0 ${width-halfM},${y} ${width},${y}`;
			path += `L 3480 ${y} L 3480 ${y+40}`;
		}

		//path += `z`;
		path += `" />`;//"

		let color = {
			top : 'var(--flow-tab-bg-top, #fefefe)',
			bottom : 'var(--flow-tab-bg-bottom, #EEE)'
		}

		if(this.active) {
			color.top = 'var(--flow-tab-active-bg-top, #fefefe)';
			color.bottom = 'var(--flow-tab-active-bg-bottom, #fff)';
		}

		//html = html.trim(); // Never return a text node of whitespace as the result
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
		<linearGradient id="gradient-${this.ident}"  x1="0" x2="0" y1="0" y2="1">
			<stop class="stop1-${this.ident}" offset="0%" style="stop-color: ${color.top}"/>
			<stop class="stop3-${this.ident}" offset="100%" style="stop-color: ${color.bottom}"/>
		</linearGradient>
		${path}
		</svg>`;

		this.template.innerHTML = svg;

		this.svg = this.template.content.firstChild.cloneNode(true);

		//this.svgViewBox = this.svg.getAttribute("viewBox");
		//this.svgPath = this.svg.querySelector("path");
		//this.svgPathLength = this.svgPath.getTotalLength();
	}

	render() {
		this.generate();

		return html`
		<div class='background' @click=${this.click}>${this.svg}</div>
		<div class="wrapper"><div class="text"><slot></slot></div></div>
		`;
	}

	click() {
		let event = new CustomEvent('flow-tab-select', {
			detail : this,
			bubbles : true
		});
		this.dispatchEvent(event);
	}
}

FlowTab.define('flow-tab');