
import {BaseElement, BaseCanvasElement, html, css} from './base-element.js';

/**
* @class FlowColorSlider
* @extends BaseElement
* @example
*   <flow-color-slider></flow-color-slider>
*/

export class FlowColorSlider extends BaseCanvasElement {
	static get properties() {
		return {
			min : { type:Number },
			max : { type:Number },
			vertical:{ type:Boolean },
			color:{ type: Object, reflect: true },
			channel : { type:String }
		}
	}

	static get styles(){
		return css`
			:host{
				display:block;
			}
			:host([disabled]){
				opacity:0.5;
				cursor:default;
				pointer-events:none;
			}
			:host(:not([disabled])){
				cursor:pointer;
			}
		`;
	}

	constructor(){
		super();

		this.min = 0;
		this.max = 255;
		this.vertical = false;
		this.color = { };
		this.channel = '?';

		this.mixer = new ColorMixer();
	}

	render() {
		let box = this.getBoundingClientRect();
		return html`
		<canvas id="canvas" style="height:100%;width:100%;" width="${box.width*this.scale}" height="${box.height*this.scale}">Your browser does not support the HTML5 canvas tag</canvas>
		`;
	}

	click(e) {
		console.log('flow-color-slider click:',e);
		this.fire("flow-color-slider-click", {el:this, e})
	}

	firstUpdated(){
		if(window.ResizeObserver){
			this.resizeObserver = new ResizeObserver(e => {
				this.fire('flow-resize', {}, {bubbles:true})
			});
			this.resizeObserver.observe(this);
		}

		['mousedown','mouseup','mousemove','click', 'pointerdown', 'pointerup', 'pointermove','mouseenter','mouseleave'].forEach((event) => {
			this.addEventListener(event, (e) => { this.onMouseEvent(event,e); });
		})

		this.addEventListener('flow-resize', (e)=>{
			this.debounce("flow-resize", this._onResize.bind(this), 100);
		})

		this.canvas = this.renderRoot.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.globalAlpha = 0;
		this.updateCanvas();

		this.color.registerSink(()=>{
			this.redraw();
		})
	}

	_onResize() {
		console.log('_onResize!');
		this.updateCanvas();
		// this.verbose && console.log('resize:', this.getBoundingClientRect());
	}

	registerSink(sink) {
		this.sink = sink;
	}

	onMouseEvent(event,e) {
		//console.log('onMouseEvent',event,e,this);

		let update = false;
		if(event == 'click')
			update = true;
		else
		if(event == 'mousedown') {
			this.drag = true;
			this.setCapture();
		}
		else
		if(event == 'mouseup')
			this.drag = false;
		else
		if(event == 'mousemove' && this.drag)
			update = true;

		if(update) {
			let x = e.offsetX;
			let v = x / this.size.width * (this.max - this.min) + this.min;
			this.color.change(v, this.channel);
			this.color.notify();
		}
	}

	redraw(){
		let parentBox = this.getBoundingClientRect();
		let canvasBox = this.canvas.getBoundingClientRect();
//		this.verbose && console.log('parentBox:',parentBox);
//		this.verbose && console.log('canvasBox:',canvasBox);
		this.canvasBox = canvasBox;
		let { width, height } = canvasBox;
		this.size = { width, height };

		width *= this.scale;
		height *= this.scale;
		let absolute = this.value / this.max;

		const { ctx } = this;
		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = 1;

		for(let v = 0; v < width; v++) {
			const c = (v * this.max / width);
			this.mixer.assign(this.color);
			this.mixer.change(c, this.channel);

			ctx.strokeStyle = `rgba(${this.mixer.r},${this.mixer.g},${this.mixer.b},1.0)`;
			ctx.beginPath();
			ctx.moveTo(v, 0);
			ctx.lineTo(v, height);
			ctx.stroke();
		}

		let v = this.color[this.channel] / this.max * width;
		ctx.strokeStyle = `rgba(0,0,0,1.0)`;
		ctx.beginPath();
		ctx.moveTo(v, 0);
		ctx.lineTo(v, height);
		ctx.stroke();
	}
}

FlowColorSlider.define('flow-color-slider');


class ColorMixer {
	constructor(v = { r : 0, g : 0, b : 0, h : 0, s : 0, v : 0, a : 1, }) {
		this.sinks = [ ];
		Object.assign(this,v);
	}

	registerSink(sink) {
		this.sinks.push(sink);
	}

	notify() {
		this.sinks.forEach(fn=>fn(this));
		// this.sinks.forEach(fn=>fn(this));
	}

	assign(src) {
		const { r, g, b, h, s, v, a } = src;
		Object.assign(this, { r, g, b, h, s, v, a });
	}

	change(value, channel) {

		if(channel == 'h' || channel == 's' || channel == 'v') {
			this[channel] = value;
			Object.assign(this, HSVtoRGB(this));
		}
		else {
			this[channel] = Math.round(value);
			Object.assign(this, RGBtoHSV(this));
		}
	}
}

export class FlowColorSolid extends BaseElement {
	static get properties() {
		return {
			color : { type : Object, reflect : true }
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
				border: 1px solid #ccc;
			}

			.solid {
				min-width: 32px;
				min-height: 32px;
				width: 100%;
				height: 100%;
			}
		`;
	}

	constructor() {
		super();
	}


	firstUpdated() {
		this.color.registerSink(()=>{
			this.requestUpdate();
		});
	}

	render() {
		let clr = `rgba(${this.color.r},${this.color.g},${this.color.b}, 1.0)`;
		return html`
			<div class='solid' style="background-color: ${clr}">
			</div>			
		`;
	}
}

FlowColorSolid.define('flow-color-solid');



export class FlowColorSelector extends BaseElement {
	static get properties() {
		return {
			caption : { type : String },
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
				border: 1px solid #ccc;
				padding: 6px;
				margin: 6px;
			}
			
			#wrapper {
				display: flex;
				flex-direction: column;
			}

			#caption {
				text-align: left;
			}

			#ctl {
				display: flex;
				flex-direction: row;
			}

			.sliders {
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			flow-color-slider {
				min-height: 24px;
				margin: 4px;
				border: 1px solid #000;
			}

			flow-color-solid {
				width: 96px;
				height: 96px;
			}
		`;
	}

	constructor() {
		super();

		this.color = new ColorMixer();
		this.color.registerSink(()=>{

		})
	}

	firstUpdated() {
		this.addEventListener('flow-color-slider-click', (e)=>{
			console.log("color selector receiving flow-color-slider-click!");
			//this.debounce("flow-resize", this._onResize.bind(this), 100);
		})

	}

	render() {
		return html`
			<div id="wrapper">
				<div id="caption">${this.caption}</div>
				<div id="ctl">
					<div class='sliders'>
						<flow-color-slider .color=${this.color} channel="r"></flow-color-slider>
						<flow-color-slider .color=${this.color} channel="g"></flow-color-slider>
						<flow-color-slider .color=${this.color} channel="b"></flow-color-slider>
						<flow-color-slider .color=${this.color} channel="h" max="1"></flow-color-slider>
						<flow-color-slider .color=${this.color} channel="s" max="1"></flow-color-slider>
						<flow-color-slider .color=${this.color} channel="v" max="1"></flow-color-slider>
					</div>
					<div>
						<flow-color-solid .color=${this.color}></flow-color-solid>
					</div>			
				</div>
			</div>
		`;
	}
}

FlowColorSelector.define('flow-color-selector');


/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

