import {BaseElement, html, css, svg} from './base-element.js';

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
			noSTicks:{type:Boolean},
			minWinSize:{type:Number}
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
				height:var(--flow-range-slider-thumb-container-height, var(--flow-range-slider-height, 50px));
				width:100%;overflow:hidden;
			}
			.thumb{
				display:inline-block;
				width:var(--flow-range-slider-thumb-width, 6px);
				height:var(--flow-range-slider-thumb-height, 20px);
				background:var(--flow-range-slider-thumb-background, #DDD);
				border:0px solid #FFF;box-sizing:border-box;
				top:5px;left:0px;position:absolute;
				transform:translateX(-50%)
			}
			.mask{
				position:absolute;top:0px;left:0px;bottom:0px;
				background:var(--flow-range-slider-mask-bg, rgba(150,150,150,0.5))
			}
			.mask.end{right:0px;}
			.thumb:not([disabled]){cursor:ew-resize;}
			.thumb.end{left:100px;}
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
		let {startX=0, endX=0} = this;
		//this.log("startX", this.id, startX, this.startX)
		return html
		`<div class="thumb-container" ?dragging="${this.windowDragInfo}"
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
			<div class="mask start" style="width:${startX+'px'}"></div>
			<div class="mask end" style="left:${endX+'px'}"></div>
			<a class="thumb start" data-thumb="start" style="left:${startX+'px'}" 
				@mousedown="${this.onThumbMouseDown}"></a>
			<a class="thumb end" data-thumb="end" style="left:${endX+'px'}"
				@mousedown="${this.onThumbMouseDown}"></a>
		</div>`
	}

	constructor(){
		super();
		this.initPropertiesDefaultValues();
		this.largeTicks = [];
		this.smallTicks = [];
		this.tickTexts = [];
		this.minWinSizeX = 20;
		this.tickFormat = (s)=>{
			let h   = Math.floor(s / 3600);
		    let m = Math.floor((s - (h * 3600)) / 60);
		    s = s - (h * 3600) - (m * 60);
		    let c = this.tickTextPadCleanUp;

			return `${c(h, "h")}${c(m, "m")}${c(s, "s")}`;
		}
	}

	tickTextPadCleanUp(str, suffix, pre=2){
		let v = str.toFixed(pre).replace(".00", "");
		return (v&&v!="0")?v+suffix:'';
	}

	firstUpdated(){
		this.thumbContainer = this.renderRoot.querySelector(".thumb-container");
		this.thumbContainerBox = this.thumbContainer.getBoundingClientRect();
		this.startEl = this.renderRoot.querySelector(".thumb.start");
		this.endEl = this.renderRoot.querySelector(".thumb.end");
		this.startMaskEl = this.renderRoot.querySelector(".mask.start");
		this.endMaskEl = this.renderRoot.querySelector(".mask.end");
		this.thumbContainer.addEventListener('wheel', (e)=>{
			this.onThumbWheel(e)
		});//, {passive:true})

		/*
		let startX = this.value2px(this.start);
		let endX = this.value2px(this.end);
		this.log("start:startX",{ 
			start:this.start,
			startX,
			boxWidth: this.thumbContainerBox.width,
			domainRange: this.valueDomain[1] - this.valueDomain[0]
		})
		*/
		this.createElementBoxes();
		this.buildTicks();
		this.requestUpdate('calc');
	}

	updated(changes){
		if(changes.has('start') || changes.has('end') || changes.has('valueDomain') ||
			changes.has('calc') ){
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

			this.start = start;
			this.end = end;
			this.startX = this.value2px(start);
			this.endX = this.value2px(end);
			//this.log("start:updated", this.id, this.startX, this.endX)
			this.requestUpdate('startX')
		}

		if(changes.has('minWinSize')){
			this.minWinSizeX = Math.max(this.minWinSize?this.value2px(this.minWinSize):0, 20);
		}

		//this.log("changes", changes)

		super.updated(changes);
	}

	value2px(value){
		let domain = this.valueDomain[1] - this.valueDomain[0];
		return (this.thumbContainerBox.width/domain) * (value - this.valueDomain[0])
	}
	px2value(px){
		let domain = this.valueDomain[1] - this.valueDomain[0];
		return (domain/this.thumbContainerBox.width)*px + this.valueDomain[0];
	}

	createThumbBox(thumb){
		let pBox = this.thumbContainerBox;
		let {top,bottom,width,height} = this[thumb+'El'].getBoundingClientRect();
		let left = this[thumb+'X'];
		return {
			left, top,
			width, height, thumb, bottom,
			get right(){
				return this.left+this.width
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
		this.endThumbBox = this.createThumbBox('end');
	}
	onResize(){
		this.createElementBoxes();
		this.buildTicks();
		this.requestUpdate('calc');
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
		if(thumb == 'start'){
			box.minLeft = 0;
			box.maxLeft = this.endX-this.minWinSizeX;
		}else{
			box.minLeft = this.startX+this.minWinSizeX;
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
		let left = e.pageX-pBox.left;
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

	setStartEndDelta(startD=0, endD=0, focusPointX=null){
		//this.log("delta", delta)
		let start = this.startX+startD;
		let end = this.endX+endD
		if( end - start < this.minWinSizeX )
			return
		//this.log("end - start", end - start, this.minWinSizeX)
		let startThumbInfo = this.getThumbInfo("start", focusPointX);
		let endThumbInfo = this.getThumbInfo("end", focusPointX);
		this.setThumbLeft(end, endThumbInfo);
		this.setThumbLeft(start, startThumbInfo);
	}

	setWindowXDelta(delta = 0){
		if(!delta)
			return

		let startThumbInfo = this.getThumbInfo("start");
		let endThumbInfo = this.getThumbInfo("end");
		if(delta>0){
			if(this.endX+delta > endThumbInfo.maxLeft)
				return
		}else{
			if(this.startX+delta < startThumbInfo.minLeft)
				return
		}

		this.setThumbLeft(this.startX+delta, startThumbInfo);
		this.setThumbLeft(this.endX+delta, endThumbInfo);
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
		let value = this.px2value(left);
		if(thumb == 'start')
			this.setStart(value)
		else
			this.setEnd(value)
	}

	setStart(start){
		this.start = start;
		this.fire("start-change", {start});
		this.fire("change", {start:this.start, end:this.end})
	}
	setEnd(end){
		this.end = end;
		this.fire("end-change", {end});
		this.fire("change", {start:this.start, end:this.end})
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