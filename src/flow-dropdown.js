import {BaseElement, html, css, dpc, ScrollbarStyle} from './base-element.js';

/**
 * @export
 * @class FlowDropdown
 * @extends {BaseElement}

 * @prop {Boolean} opened 
 * @prop {Boolean} disabled
 * 
 * @cssvar {color} [--flow-color, #000);
 * @cssvar {color}[--flow-dropdown-trigger-color=#FFF]
 * @cssvar {color} [--flow-dropdown-trigger-hover-color=#FFF]
 * @cssvar {color} [--flow-dropdown-color=var(--flow-color, #000)]
 * @cssvar {font-size} [--flow-dropdown-trigger-font-size=var(--flow-input-font-size, 1rem)]
 * @cssvar {font-weight} [--flow-dropdown-trigger-font-weight=var(--flow-input-font-weight, 400)]
 * @cssvar {line-height} [--flow-dropdown-trigger-line-height=var(--flow-input-line-height, 1.2)]
 * @cssvar {background-color} [--flow-dropdown-trigger-hover-bg=var(--flow-primary-color, #3498DB)]
 * @cssvar {background-color} [--flow-dropdown-trigger-bg=var(--flow-primary-color, #3498DB)]
 * @cssvar {background-color} [--flow-dropdown-bg=var(--flow-background-color, #FFF)]
 * @cssvar {box-shadow} [--flow-box-shadow]
 * @cssvar {box-shadow} [--flow-box-shadow]
 * @cssvar {min-width} [--flow-dropdown-trigger-width=80px]
 * @cssvar {min-width} [--flow-dropdown-content-min-width=160px]
 * @cssvar {min-width} [--flow-dropdown-trigger-width=80px]
 * @cssvar {top} [--flow-dropdown-top=0px]
 * @cssvar {padding} [--flow-dropdown-trigger-padding, 21px 20px 20px);
 * @cssvar {padding} [--flow-dropdown-content-padding=5px]
 * @cssvar {padding} [--flow-dropdown-trigger-padding=21px 20px 20px]
 * @cssvar {border} [--flow-dropdown-border=none]
 * 
 * @example
 * <flow-dropdown>
 *   <div slot="trigger">Menu</div>
 *   <ul>
 *		<li>Menu Item 1</li>
 *	 	<li>Menu Item 2</li>
 *   </ul>
 * </flow-dropdown>
 */
export class FlowDropdown extends BaseElement {
	static get properties() {
		return {
			opened:{type:Boolean, reflect:true},
			disabled:{type:Boolean, reflect:true}
		}
	}

	static get styles() {
		return [ScrollbarStyle, css`
		:host{
			display:inline-block;margin:5px 0px;
			vertical-align:middle;
			color:var(--flow-color, #000);
		}
		.trigger{
			background-color:var(--flow-dropdown-trigger-bg, var(--flow-primary-color, #3498DB));
			color:var(--flow-dropdown-trigger-color, #FFF);
			border-radius:var(--flow-dropdown-trigger-border-radius, 3px);
			border:none;
			user-select:none;
			padding:var(--flow-dropdown-trigger-padding, 21px 20px 20px);
			min-width:var(--flow-dropdown-trigger-width, 80px);
			font-size:var(--flow-dropdown-trigger-font-size, var(--flow-input-font-size, 1rem));
			font-weight:var(--flow-dropdown-trigger-font-weight, var(--flow-input-font-weight, 400));
			line-height:var(--flow-dropdown-trigger-line-height, var(--flow-input-line-height, 1.2));
		}
		:host(:not([disabled])) .trigger{cursor:pointer;}

		.trigger:hover, .trigger:focus {
			background-color:var(--flow-dropdown-trigger-hover-bg, var(--flow-primary-color, #3498DB));
			color:var(--flow-dropdown-trigger-hover-color, #FFF);
		}
		.dropdown{position:relative;display:block;}
		.dropdown-content{
			display:none;
			position:absolute;
			background-color:var(--flow-dropdown-bg, var(--flow-background-color, #FFF));
			color:var(--flow-dropdown-color, var(--flow-color, #000));
			min-width:var(--flow-dropdown-content-min-width, 160px);
			overflow:auto;border-radius:3px;
			box-shadow:var(--flow-box-shadow);
			z-index:1000;
			top:var(--flow-dropdown-content-top, var(--flow-dropdown-top, 0px));
			left:var(--flow-dropdown-content-left, 0px);
			right:var(--flow-dropdown-content-right, initial);
			padding:var(--flow-dropdown-content-padding, 5px);
			border:var(--flow-dropdown-border, none);
		}
		:host([opened]) .dropdown-content{display:block;}
		:host(.right-align) .dropdown-content,
		:host([right-align]) .dropdown-content{
			left:var(--flow-dropdown-content-left, initial);
			right:var(--flow-dropdown-content-right, 0px);
		}
		:host([no-trigger]) .trigger{display:none}
		:host([no-trigger]){margin:0px;}
		`];
	}
	render() {
		return html`
			<div class="trigger"><slot name="trigger"></slot></div><div class="dropdown">
				<div class="dropdown-content">
					<slot></slot>
				</div>
			</div>
		`;
	}
	firstUpdated(){
		this.renderRoot
			.querySelector(".trigger")
			.addEventListener("click", this._onClick.bind(this));
		this.dropdownEl = this.renderRoot.querySelector(".dropdown");
		this.dropdownContentEl = this.renderRoot.querySelector(".dropdown-content");
	}
	updated(){
		this.updateDropdownSize();
	}

	_onClick(e){
		if(this.disabled)
			return
		this.toggle();
	}

	open(){
		this.opened = true;
	}
	close(){
		this.opened = false;
	}
	toggle(){
		this.opened = !this.opened;
	}
	onWindowClick(e){
		if(!this.opened)
			return
		let dropdown = false;
		let target = e.target;
		if(!target){
			this.opened = false;
			return
		}
		dropdown = target.flowDropdown || target.closest?.('flow-dropdown');
		if(!dropdown){
			let p = e.path?.[0] || target;
			while(p){
				if(p.flowDropdown){
					dropdown = p.flowDropdown;
					break;
				}
				if(p.matches?.("flow-dropdown")){
					dropdown = p;
					break;
				}
				if(p instanceof ShadowRoot){
					p = p.host;
					continue;
				}
				p = p.parentNode;
			}
		}
		if(!dropdown || dropdown!=this)
			this.opened = false;
	}
	onWindowResize(){
		this.updateDropdownSize();
	}
	onParentScroll(){
		this.updateDropdownSize();
	}
	updateDropdownSize(){
		let {dropdownContentEl, dropdownEl, scrollParants} = this;

		if(!dropdownContentEl||!dropdownEl||!scrollParants||!scrollParants.length)
			return

		//let box = dropdownContentEl.getBoundingClientRect();
		let firstScrollParent = scrollParants[0];
		//console.log("firstScrollParent", firstScrollParent)
		let firstScrollParentBox = firstScrollParent.getBoundingClientRect();
		let parentBox = dropdownEl.getBoundingClientRect();

		let topMargin = Math.max(parentBox.top - firstScrollParentBox.top, 0);
		let top = Math.max(firstScrollParentBox.top - parentBox.top, 0);
		let height = firstScrollParentBox.height - topMargin - 20

		let leftMargin = Math.max(parentBox.left - firstScrollParentBox.left, 0);
		let left = Math.max(firstScrollParentBox.left - parentBox.left, 0);
		let width = firstScrollParentBox.width - leftMargin - 20

		/*this.log("width, height",
			top,
			topMargin,
			firstScrollParent.scrollTop,
			firstScrollParentBox,
			parentBox,
			width,
			height
		)*/
		dropdownContentEl.style.transform = `translate(${left}px, ${top}px)`;
		dropdownContentEl.style.maxWidth = width+"px";
		dropdownContentEl.style.maxHeight = height+"px";

	}
	connectedCallback(){
    	super.connectedCallback();
    	this._onWindowClick = this._onWindowClick||this.onWindowClick.bind(this);
    	this._onWindowResize = this._onWindowResize||this.onWindowResize.bind(this);
    	this._onParentScroll = this._onParentScroll||this.onParentScroll.bind(this);
    	window.addEventListener("click", this._onWindowClick, {capture:true})
    	window.addEventListener("resize", this._onWindowResize, {capture:true});
    	let buildScrollEvents = ()=>{
	    	this.scrollParants = this.findScrollParents();
	    	this.scrollParants.forEach(p=>{
	    		p.addEventListener("scroll", this._onParentScroll);
	    	});
	    }
	    buildScrollEvents();
    	if(!this.scrollParants.length){//Safari/FF issue
    		dpc(1000, ()=>{
    			buildScrollEvents();
    			//this.log("this.scrollParants", this.scrollParants)
    		});
    	}
    }
	disconnectedCallback(){
    	super.disconnectedCallback();
    	window.removeEventListener("click", this._onWindowClick);
    	window.removeEventListener("resize", this._onWindowResize);
    	this.scrollParants.forEach(p=>{
    		p.removeEventListener("scroll", this._onParentScroll);
    	});
    	this.scrollParants = [];
    }
    findScrollParents(){
    	let list = [];
    	let p = this.parentNode;
    	while(p){
    		if(p instanceof ShadowRoot){
    			p = p.host;
    			continue;
    		}
    		if(!(p instanceof HTMLElement))
    			break;
    		if(p.nodeName=="BODY"){
    			list.push(p);
    			break;
    		}
    		if(this.isScrollEl(p))
    			list.push(p);
    		p = p.parentNode;
    	}

    	return list;
    }

    isScrollEl(element){
    	const { overflow, overflowX, overflowY } = getComputedStyle(element);
    	//this.log("overflow:::", element, overflow, overflowX, overflowY)
  		return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
}

FlowDropdown.define('flow-dropdown');
