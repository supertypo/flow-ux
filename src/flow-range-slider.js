import {BaseElement, html, css, svg, dpc} from './base-element.js';


class FlowRangeSlider extends BaseElement{
	static get properties(){
		return {
			windowDragInfo:{type:Boolean},
			tickFormat:{type:Function},
			valueDomain:{type:Array, value:[]},
			start:{type:Number, value:0},
			end:{type:Number, value:0},
			largeTickSpacing:{type:Number, value:70},
			lTickSize:{type:Number, value:12},
			mTickSize:{type:Number, value:5},
			sTickSize:{type:Number, value:3},
			noSTicks:{type:Boolean}
		}
	}
	static get styles(){
		return css`
			:host{
				display:inline-block;width:400px;margin:20px 200px;position:relative;
				min-height:var(--flow-range-slider-height, 50px);
			}
			.thumb-container{
				background:var(--flow-range-slider-thumb-container-bg, rgba(200,200,200,0.5));
				font-size:0px;
				height:var(--flow-range-slider-thumb-container-height, 50px);
				width:100%;overflow:hidden;
			}
			.thumb{
				display:inline-block;
				width:var(--flow-range-slider-thumb-width, 6px);
				height:var(--flow-range-slider-thumb-height, 20px);
				background:var(--flow-range-slider-thumb-background, #DDD);
				border:0px solid #FFF;box-sizing:border-box;
				top:0px;left:0px;position:absolute;
				transform:translateX(-50%)
			}
			.mask{
				position:absolute;top:0px;left:0px;bottom:0px;
				background:var(--flow-range-slider-mask-bg, rgba(150,150,150,0.5))
			}
			.mask.end{
				right:0px;
			}
			.thumb:not([disabled]){cursor:ew-resize;}
			.thumb.end{
				left:100px;
			}
			.thumb-container{cursor:grab}
			.thumb-container[dragging]:not([disabled]){cursor:grabbing}
			.ticks{font-size:0.5rem}
			.ticks .tick{
				fill:none;stroke-width:1;
				stroke:var(--flow-range-slider-tick-stroke, black);
			}
			.ticks .tick.large{
				stroke:var(--flow-range-slider-large-tick-stroke, #F00);
			}
			.tick-text{
				user-select:none;
				text-anchor:var(--flow-range-slider-text-anchor, end)
			}
		`;
	}
	render(){
		return html
		`<div class="thumb-container" ?dragging="${this.windowDragInfo}"
			@wheel="${this.onThumbWheel}"
			@mousedown="${this.onMouseDown}">
			<div class="ticks">
			<svg width="100%" height="50">
			${
				svg `
				<polyline class="tick" points="${this.smallTicks.join(' ')}" />
				<polyline class="tick large" points="${this.largeTicks.join(' ')}" />
				${this.tickTexts.map(t=>svg`
					<text class="tick-text" x="${t.x}" y="${t.y}" dx="${t.dx}">${t.text}</text>
				`)}
				`
			}
			</svg>
			</div>
			<div class="mask start"></div>
			<div class="mask end"></div>
			<a class="thumb start" data-thumb="start" 
				@mousedown="${this.onThumbMouseDown}"></a>
			<a class="thumb end" data-thumb="end"
				@mousedown="${this.onThumbMouseDown}"></a>
		</div>`
	}

	constructor(){
		super();
		this.initPropertiesDefaultValues();
		this.largeTicks = [];
		this.smallTicks = [];
		this.tickTexts = [];
		this.tickFormat = (s)=>{
			let h   = Math.floor(s / 3600);
		    let m = Math.floor((s - (h * 3600)) / 60);
		    s = s - (h * 3600) - (m * 60);

			return `${h?h+"h":''}${m?m+"m":''}${s?s+"s":''}`;
		}
	}

	firstUpdated(){
		this.thumbContainer = this.renderRoot.querySelector(".thumb-container");
		this.thumbContainerBox = this.thumbContainer.getBoundingClientRect();
		this.startEl = this.renderRoot.querySelector(".thumb.start");
		this.endEl = this.renderRoot.querySelector(".thumb.end");
		this.startMaskEl = this.renderRoot.querySelector(".mask.start");
		this.endMaskEl = this.renderRoot.querySelector(".mask.end");
		let {start, end, valueDomain:domain} = this;
		if(start > end){
			let _end = end;
			end = start;
			start = _end;
		}

		if(start < domain[0] || start > domain[1])
			start = 0;
		if(end < domain[0] || end > domain[1])
			end = domain[1];


		let startLeft = this.value2px(start);
		let endLeft = this.value2px(end);
		console.log("startLeft", startLeft)
		this.createElementBoxes();
		this.buildTicks();
		this.setThumbLeft(startLeft, this.getThumbInfo('start'));
		this.setThumbLeft(endLeft, this.getThumbInfo('end'))

	}

	value2px(value){
		let domain = this.valueDomain[1] - this.valueDomain[0];
		return (this.thumbContainerBox.width/domain) * value;
	}
	px2value(px){
		let domain = this.valueDomain[1] - this.valueDomain[0];
		return (domain/this.thumbContainerBox.width)*px;
	}

	createThumbBox(thumb){
		let pBox = this.thumbContainerBox;
		let {left,top,right,bottom,width,height} = this[thumb+'El'].getBoundingClientRect();
		left = left-pBox.left + width/2
		top = 0;//top-pBox.top;
		return {
			_left:left,
			_top:top,
			width, height, thumb, hWidth:width/2,
			maskEl:this[thumb+'MaskEl'],
			maskProp:thumb=='start'?'width':'left',
			get left(){
				return this._left
			},
			get top(){
				return this._top
			},
			set left(value){
				this._left = value;
				//this.log("XXXXX 1", thumb, this.left)
				this.updateMask();
			},
			set top(value){
				this._top = value;
			},
			get right(){
				return this.left+this.width
			},
			get bottom(){
				return this.top+this.height
			},
			get cX(){
				return this.left+this.width/2;
			},
			get cY(){
				return this.top+this.height/2;
			},
			updateMask(){
				//this.log("XXXXX 2", thumb, this.left)
				this.maskEl.style[this.maskProp] = this.left+"px";
			}
		}
	}
	buildTickMark(x, size=5){
		return `${x},-1 ${x},${size} ${x},-1`;
	}
	buildSmallTicks(x){
		let i = 0;
		let ticks = [];
		let s = Math.max(Math.floor(this.largeTickSpacing/10), 0);
		while(i++<9){
			ticks.push(this.buildTickMark(x + s*i, i==5?this.mTickSize:this.sTickSize))
		}
		//this.log("ticks", ticks)
		return ticks.join(" ");
	}
	buildTicks(){
		let {width} = this.thumbContainerBox;
		let lTickS = this.largeTickSpacing;
		let largeTickCount = Math.max(Math.floor(width/lTickS)-1, 0);
		if( (largeTickCount+1)*lTickS != width ){
			//console.log("xxxxx", width, (largeTickCount+1)*lTickS)
			lTickS = width/(largeTickCount+1);
			this.largeTickSpacing = lTickS;
		}
		let largeTicks = [];
		let smallTicks = [];
		let tickTexts = [];
		let i = 0, x = 0, lX;
		let domainStart = this.valueDomain[0]
		let domain = this.valueDomain[1] - domainStart;
		let tickScale = domain/(largeTickCount+1);
		console.log("largeTickCount", largeTickCount, width)
		let dx = -2;
		while(i++ <largeTickCount){
			lX = lTickS * i;
			if(!this.noSTicks)
				smallTicks.push(this.buildSmallTicks(x));
			largeTicks.push(this.buildTickMark(lX, this.lTickSize));
			tickTexts.push({
				x: lX,
				y:20,
				dx,
				text: this.tickFormat(domainStart+tickScale*i, i, lX)
			})
			x += lTickS;
		}
		if(!this.noSTicks)
			smallTicks.push(this.buildSmallTicks(x));
		tickTexts.push({
			x:x+lTickS,
			y:20,
			dx,
			text: this.tickFormat(domainStart+tickScale*i, i+1, lX)
		})

		this.largeTicks = largeTicks;
		this.smallTicks = smallTicks;
		this.tickTexts = tickTexts;
		this.requestUpdate("largeTicks");
	}
	createElementBoxes(){
		this.thumbContainerBox = this.thumbContainer.getBoundingClientRect();
		this.startThumbBox = this.createThumbBox('start');
		this.startThumbBox.updateMask();
		this.endThumbBox = this.createThumbBox('end');
		this.endThumbBox.updateMask();
	}
	onResize(){
		this.createElementBoxes();
	}
	setActiveThumb(info){
		this.activeThumb = info;
	}
	getEventInfo(e){
		let target = e.target.closest('[data-thumb]');
		if(!target)
			return {};
		let thumb = target.dataset.thumb;
		return {thumb, target};
	}
	getThumbInfo(thumb, focusPointX=null){
		let pBox = this.thumbContainerBox;
		//focusPointX = focusPointX!=null?focusPointX:this.focusPointX;
		//if(focusPointX)

		let box = Object.assign({}, this[thumb+'ThumbBox']);
		let margin = 5;
		if(thumb == 'start'){
			box.minLeft = 0;
			box.maxLeft = this.endThumbBox.left-box.width-margin;
		}else{
			box.minLeft = this.startThumbBox.right+margin;
			box.maxLeft = pBox.width;
		}
		return box;
	}
	onMouseDown(e){
		if(this.activeThumb)
			return
		this.windowDragInfo = {pageX:e.pageX};
	}
	onThumbMouseDown(e){
		let {thumb} = this.getEventInfo(e);
		if(!thumb)
			return

		this.setActiveThumb(this.getThumbInfo(thumb))
	}
	onThumbMouseMove(e){
		if(!this.activeThumb)
			return
		let pBox = this.thumbContainerBox;
		let thumbInfo = this.activeThumb;
		let x = e.pageX-pBox.left;
		let left = x-thumbInfo.width/2;
		this.setThumbLeft(left);
	}
	onMouseMove(e){
		if(!this.windowDragInfo)
			return
		let pBox = this.thumbContainerBox;
		let {pageX} = this.windowDragInfo;
		let delta = e.pageX-pageX;
		this.windowDragInfo.pageX = e.pageX;
		this.setWindowXDelta(delta);
	}
	onWindowMouseMove(e){
		if(this.activeThumb)
			return this.onThumbMouseMove(e);
		if(this.windowDragInfo)
			this.onMouseMove(e);
	}
	onWindowMouseUp(){
		this.setActiveThumb(null);
		this.windowDragInfo = false;
	}
	onWindowMouseLeave(){
		this.setActiveThumb(null);
		this.windowDragInfo = false;
	}

	onThumbWheel(e){
		e.preventDefault();
		//this.log("e.wheelDelta", e.deltaY, e.wheelDelta, e.detail)
		let focusPointX = e.pageX - this.thumbContainerBox.left;
		this.setWindowSizeDelta(e.deltaY, focusPointX);
	}

	increaseWindowSize(delta=1){
		this.setWindowSizeDelta(delta);
	}

	decreaseWindowSize(delta=1){
		this.setWindowSizeDelta(-delta);
	}

	setWindowSizeDelta(delta=0, focusPointX=null){
		if(delta==0)
			return
		this.setStartEndDelta(delta, -delta, focusPointX)
	}

	setStartEndDelta(start=0, end=0, focusPointX=null){
		//this.log("delta", delta)
		let startThumbInfo = this.getThumbInfo("start", focusPointX);
		this.setThumbLeft(startThumbInfo.left+start, startThumbInfo);
		let endThumbInfo = this.getThumbInfo("end", focusPointX);
		this.setThumbLeft(endThumbInfo.left+end, endThumbInfo);
	}

	setWindowXDelta(delta = 0){
		if(!delta)
			return

		let startThumbInfo = this.getThumbInfo("start");
		let endThumbInfo = this.getThumbInfo("end");
		if(delta>0){
			if(endThumbInfo.left+delta > endThumbInfo.maxLeft)
				return
		}else{
			if(startThumbInfo.left+delta < startThumbInfo.minLeft)
				return
		}

		this.setThumbLeft(startThumbInfo.left+delta, startThumbInfo);
		this.setThumbLeft(endThumbInfo.left+delta, endThumbInfo);
	}

	setThumbLeft(left, thumbInfo){
		thumbInfo = thumbInfo || this.activeThumb;
		if(!thumbInfo)
			return
		let {maxLeft, minLeft, thumb} = thumbInfo;
		//this.log("left1", left, minLeft, maxLeft)
		if(left > maxLeft)
			left = maxLeft;
		else if(left<minLeft)
			left = minLeft;
		//this.log("left2", {left, minLeft, maxLeft})
		this[thumb+'ThumbBox'].left = left;
		this[thumb+'El'].style.left = left+"px";
	}

	connectedCallback(){
		super.connectedCallback();
		this._onWindowMouseUp = this._onWindowMouseUp || this.onWindowMouseUp.bind(this);
		this._onWindowMouseMove = this._onWindowMouseMove || this.onWindowMouseMove.bind(this);
		this._onWindowMouseLeave = this._onWindowMouseLeave || this.onWindowMouseLeave.bind(this);
		window.addEventListener("mouseup", this._onWindowMouseUp);
		window.addEventListener("mouseleave", this._onWindowMouseLeave);
		window.addEventListener("mousemove", this._onWindowMouseMove);
		if(!this.resizeObserver){
			this.resizeObserver = new ResizeObserver(()=>{
				this.onResize();
			});
		}

		this.resizeObserver.observe(this);
	}

	disconnectedCallback(){
		super.disconnectedCallback();
		if(this._onWindowMouseUp)
			window.removeEventListener("mouseup", this._onWindowMouseUp);
		if(this._onWindowMouseLeave)
			window.removeEventListener("mouseleave", this._onWindowMouseLeave);
		if(this._onWindowMouseMove)
			window.removeEventListener("mousemove", this._onWindowMouseMove);

		this.resizeObserver.disconnect();
	}


}

FlowRangeSlider.define("flow-range-slider");