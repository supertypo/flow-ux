import {BaseElement, html, css} from './base-element.js';

export class FlowCanvasElement extends BaseElement {
	constructor() {
		super();

		this.canvasScale = 0.75;
	}

	getPixelRatio(){
    	const ctx = this.canvas.getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    	return dpr / bsr * 2;
	}

	setHiDPICanvas(w, h, ratio) {
		const can = this.canvas;
		let w_ = w;
		let h_ = h;
		can.width = w_ * ratio;
		can.height = h_ * ratio;
		// can.style.width = w_ + "px";
		// can.style.height = h_ + "px";
		can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
	}

	updateCanvas() {
		if(!this.canvas)
			return;

		let parentBox = this.getBoundingClientRect();
		let canvasBox = this.canvas.getBoundingClientRect();
		let { width, height } = canvasBox;
		this.PIXEL_RATIO = this.getPixelRatio();
		this.setHiDPICanvas(width*this.canvasScale,height*this.canvasScale,this.PIXEL_RATIO);
		this.redraw(this.canvasContext2d, canvasBox);
	}

	get htmlCanvasElement() {
		let box = this.getBoundingClientRect();
		return html`<canvas id="canvas" style="height:100%;width:100%;" width="${box.width*this.canvasScale}" height="${box.height*this.canvasScale}">Your browser does not support the HTML5 canvas tag</canvas>`;
	}

	firstUpdated() {
		if(window.ResizeObserver){
			this.resizeObserver = new ResizeObserver(e => {
				this.fire('flow-canvas-resize', {}, {bubbles:true})
			});
			this.resizeObserver.observe(this);
		}

		[
			'mousedown','mouseup','mousemove','click', 'pointerdown',
			'pointerup', 'pointermove','mouseenter','mouseleave'
		].forEach((event) => {
			this.addEventListener(event, (e) => { this.onMouseEvent(event,e); });
		})

		this.addEventListener('flow-canvas-resize', (e)=>{
			this.debounce("flow-canvas-resize", this.handleResize.bind(this), 100);
		})

		this.canvas = this.renderRoot.getElementById('canvas');
		this.canvasContext2d = this.canvas.getContext('2d');
		this.ctx.globalAlpha = 0;
		this.updateCanvas();
	}

	handleResize() {
		this.updateCanvas();
	}

	redraw(ctx, size) {
		throw new Error('BaseCanvasElement::redraw() - missing implementation!');
	}
}


