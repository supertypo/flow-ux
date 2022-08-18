import {css} from './base-element.js';

export const swipeableStyle = css`
.flow-swipeable-container { overflow: hidden }
.flow-swipeable-row{
	--swipeable-n: 1;
	--swipeable-f: 1;
	display: flex;
	align-items: stretch;
	overflow:hidden;
	overflow-y: hidden;
	width: 100%; /* fallback */
	width: calc(var(--swipeable-n) * 100%);
	/*max-height: 100vh;*/
	--swipeable-transform-x: calc(var(--swipeable-tx, 0px) + var(--swipeable-i, 0) / var(--swipeable-n) * -100%);
	transform: translateX(var(--swipeable-transform-x));
}
.flow-swipeable-row .flow-swipeable{
	width: 100%; /* fallback */
	height: 100%;
	_width: calc(100% / var(--swipeable-n));
	/*user-select: none;
	pointer-events: none;
	background: no-repeat;
	background-size: cover;*/
	
}

.flow-swipeable-smooth{ transition: transform  calc(var(--swipeable-f, 1) * .5s) ease }
`

export class FlowSwipeable{

	constructor(container, options={}){
		this.container = container;
		let element = container.querySelector('.flow-swipeable-row');
		this.element = element;
		let defaultOptions = {
			drag:true,
			validateEvent(e){
				return !e.target.closest('flow-dropdown,flow-select,flow-selector,flow-input,flow-checkbox,select,textarea, input,.not-swipeable')
			}
		};
		this.options = {...defaultOptions, ...options}
		this.count = element.children.length;
		this.x = null;
		this.locked = false;
		this.i = 0;
		this.onResize();
		this.updateCount();
		this.init();
	}
	updateCount(){
		let el = this.element;
		this.count = el.children.length;
		el.style.setProperty("--swipeable-n", this.count);
		this.updateFixedPositionsOffset();
	}

	init(){
		let el = this.element;
		//let onResize = this.onResize.bind(this);
		let onTouchStart = this.onTouchStart.bind(this);
		let onDrag = this.onDrag.bind(this);
		let onTouchEnd = this.onTouchEnd.bind(this);

		//el.addEventListener("resize", onResize, false);

		el.addEventListener("mousedown", onTouchStart, false);
		el.addEventListener("touchstart", onTouchStart, false);

		el.addEventListener("mousemove", onDrag, false);
		el.addEventListener("touchmove", onDrag, false);

		el.addEventListener("mouseup", onTouchEnd, false);
		el.addEventListener("touchend", onTouchEnd, false);

		if (typeof MutationObserver != 'undefined'){
			const observer = new MutationObserver(()=>{
				this.updateCount();
			});
			observer.observe(el, {childList:true});
		}

		

		this.startResizeListener();
	}
	updateFixedPositionsOffset(){
		let {width, top} = this.container.getBoundingClientRect();
		[...this.element.children].map((c, index)=>{
			c.style.setProperty('--flow-transform-translate-x', `${index * width}px`);
			c.style.setProperty('--flow-transform-translate-y', `${-top}px`)
		})
	}
	setActive(index){
		this.element.style.setProperty("--swipeable-i", index);
		this.i = index;
	}
	startResizeListener(){
		if(!this.resizeObserver){
    		this.resizeObserver = new ResizeObserver(()=>{
	    		this.onResize();
			});
			this.resizeObserver.observe(this.container);
	    }
	}
	stopResizeListener(){
		if(this.resizeObserver){
			this.resizeObserver.unobserve(this.container);
			this.resizeObserver.disconnect();
			delete this.resizeObserver;
		}
	}

	unifyEvent(e) {
		return e.changedTouches ? e.changedTouches[0] : e;
	}

	isValidEvent(e){
		return this.options.validateEvent(e);
	}

	onResize() {
		this.width = this.container.getBoundingClientRect().width;
		this.updateFixedPositionsOffset();
	}

	onTouchStart(e) {
		if(!this.isValidEvent(e))
			return
		this.x = this.unifyEvent(e).clientX;
		this.element.classList.toggle("flow-swipeable-smooth", !(this.locked = true));
	}

	onDrag(e) {
		if (!this.locked)
			return
		if(this.options.drag){
			e.preventDefault();
			this.element.style.setProperty("--swipeable-tx", 
				`${Math.round(this.unifyEvent(e).clientX - this.x)}px`);
		}
	}

	onTouchEnd(e) {
		//console.log("locked:"+this.locked)
		if (!this.locked)
			return

		let el = this.element;
		let {i, count, width, x} = this;
		let lastIndex = i;
		//console.log("i, count, width, x", {i, count, width, x})

		let dx = this.unifyEvent(e).clientX - x,
			s = Math.sign(dx),
			f = +((s * dx) / width).toFixed(2);


		//console.log("i, count, width, x", {dx, i, f, s})
		if ((i > 0 || s < 0) && (i < count - 1 || s > 0) && f > 0.1) {
			el.style.setProperty("--swipeable-i", (i -= s));
			f = 1 - f;
		}
		this.i = i;
		el.style.setProperty("--swipeable-tx", "0px");
		el.style.setProperty("--swipeable-f", f);
		el.classList.toggle("flow-swipeable-smooth", !(this.locked = false));
		this.x = null;
		if(lastIndex != i){
			this.options.onSwipe?.({index:i, element:this.element.children[i]})
		}
	}
}