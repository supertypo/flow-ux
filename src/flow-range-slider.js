import {BaseElement, html, css} from './base-element.js';


class FlowRangeSlider extends BaseElement{
	static get properties(){
		return {
			windowDragInfo:{type:Boolean}
		}
	}
	static get styles(){
		return css`
			:host{
				display:inline-block;width:400px;margin:200px;position:relative;
				min-height:var(--flow-range-slider-height, 50px);
			}
			.thumb-container{
				background:var(--flow-range-slider-thumb-container-bg, rgba(200,200,200,0.5));
				font-size:0px;
				height:var(--flow-range-slider-thumb-container-height, 50px);
			}
			.thumb{
				display:inline-block;
				width:var(--flow-range-slider-thumb-width, 6px);
				height:var(--flow-range-slider-thumb-height, 20px);
				background:var(--flow-range-slider-thumb-background, #DDD);
				border:0px solid #FFF;box-sizing:border-box;
				top:0px;left:0px;position:absolute;
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
		`;

	}
	render(){
		return html
		`<div class="thumb-container" ?dragging="${this.windowDragInfo}"
			@wheel="${this.onThumbWheel}"
			@mousedown="${this.onMouseDown}">
			<div class="mask start"></div>
			<div class="mask end"></div>
			<a class="thumb start" data-thumb="start" 
				@mousedown="${this.onThumbMouseDown}"></a>
			<a class="thumb end" data-thumb="end"
				@mousedown="${this.onThumbMouseDown}"></a>
		</div>`
	}
	firstUpdated(){
		this.thumbContainer = this.renderRoot.querySelector(".thumb-container");
		this.thumbContainerBox = this.thumbContainer.getBoundingClientRect();
		this.startEl = this.renderRoot.querySelector(".thumb.start");
		this.endEl = this.renderRoot.querySelector(".thumb.end");
		this.startMaskEl = this.renderRoot.querySelector(".mask.start");
		this.endMaskEl = this.renderRoot.querySelector(".mask.end");
		this.createElementBoxes();
	}

	createThumbBox(thumb){
		let pBox = this.thumbContainerBox;
		let {left,top,right,bottom,width,height} = this[thumb+'El'].getBoundingClientRect();
		left = left-pBox.left;
		top = top-pBox.top;
		return {
			_left:left,
			_top:top,
			width, height, thumb,
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
				this.maskEl.style[this.maskProp] = this.cX+"px";
			}
		}
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
			box.maxLeft = pBox.width-box.width;
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
		//this.log("left2", left, maxLeft)
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