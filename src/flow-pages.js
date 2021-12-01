import {BaseElement, html, css} from './base-element.js';

let flowPagesStyle = css`
	flow-pages>h1,
	flow-pages>.title{
	    padding:10px;
	    font-size:2rem;
	}
	flow-pages .buttons{margin:10px;display:flex;justify-content:flex-end;z-index:10}
	flow-pages .buttons .flex{flex:1;}
	flow-pages .buttons flow-btn{margin:0px 5px;padding:5px 5px;user-select:none;}
	flow-pages .buttons flow-btn svg{
	    width:20px;
	    height:20px;
	    margin-right:10px;
	    fill:var(--flow-primary-color, rgba(0,151,115,1.0));
	    pointer-events:none;
	}
	flow-pages .buttons flow-btn span+svg{
	    margin-left:10px;
	    margin-right:0px;
	}
`

let style = document.head.querySelector('style.flow-pages-style') || document.createElement("style");
style.innerHTML = flowPagesStyle.toString();
style.classList.add("flow-pages-style");
if(!style.parentNode)
	document.head.insertBefore(style, document.head.querySelector('link[href*="flow-ux.css"], :last-child').nextSibling);
export {flowPagesStyle};

/**
 * @export
 * @class FlowPages
 * @extends {BaseElement}
 * 
 * @property {Array} pages
 * @property {Number} index 
 * 
 * @cssvar {fill|background-color} [--flow-primary-color=rgba(0,151,115,1)]
 * @cssvar {background-color} [--flow-background-color=#FFF]
 * @cssvar {box-shadow} [--flow-pages-dots-box-shadow=var(--flow-box-shadow)]
 * @cssvar {border} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
 * @cssvar {border-color} [--flow-active-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
 * 
 * @example
 * <flow-pages>
 * 	<flow-page>Page 1</flow-page>
 *  <flow-page>Page 2</flow-page>
 * </flow-pages>
 *
 */

export class FlowPages extends BaseElement {
	static get properties() {
		return {
			pages:{type:Array},
			index:{type:Number},
			dotoffset:{type:Number}
		}
	}
	static get styles() {
		return css`
			:host{
				display:flex;
				flex-direction:column;
			}

			.wrapper{
				flex:1;
				position:relative;
			}

			.wrapper ::slotted(flow-page){
				background-color:var(--flow-background-color, #FFF);
				position:absolute;
				left:0px;
				top:0px;
				width:100%;
				height:100%;
				z-index:1;
				opacity:0;
				transition:opacity 1s ease;
			}
			.wrapper ::slotted(flow-page.back),
			.wrapper ::slotted(flow-page.active){
				z-index:3;
				opacity:1;
			}

			.dots{
				pointer-events: none;
				z-index:5;
				position:absolute;bottom:10px;
				display:none;
				justify-content:center;
				width:100%;
			}
			:host(.has-dots) .dots{
				display:flex;
			}
			.dots i{
				display:block;width:10px;height:10px;background-color:#FFF;
				box-shadow:var(--flow-pages-dots-box-shadow, var(--flow-box-shadow));
				margin:4px;
				border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:50%;
			}

			.dots i.active{
				background-color:var(--flow-primary-color, rgba(0,151,115,1));
				border-color:var(--flow-active-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
			}

			.dots i:not(.active){cursor:pointer;}


			.buttons flow-btn {
				align-items:center;
				display:flex;
			}


		`;
	}
	render(){
		let prevIcon = this.iconPath('arrow-alt-left');
		let nextIcon = this.iconPath('arrow-alt-right');
		let dots = new Array((this.pages || []).length).fill(0);
		if(dots.length)
			dots[this.index||0] = 1;

		let css = '';
		if(this.dotoffset)
			css = `bottom: -${this.dotoffset}px`;

		return html`
		<slot name="title"></slot>
		<div class="wrapper">
			<slot></slot>
			<div class="dots" style="${css}" @click="${this.onDotsClick}">${dots.map((active,i)=>{
				return html`<i data-index="${i}" class="${active?'active':''}"></i>`
			})}</div>
		</div>
		
		<div @click="${this.onButtonClick}">
			<slot name="buttons"></slot>
		</div>
		`;
	}
	firstUpdated(){
		this.wrapper = this.renderRoot.querySelector(".wrapper");
		this.buttons = this.renderRoot.querySelector(".buttons");
		let slot = this.shadowRoot.querySelector('slot[name="buttons"]');
		this.btns = {};
		slot.addEventListener('slotchange', e=>{
			this.updateBtns(slot.assignedNodes());
			
		});
		this.updateBtns(slot.assignedNodes());

		let pages = this.querySelectorAll("flow-page");
		this.initiPages(pages);
	}
	updateBtns(nodes){
		[...nodes].forEach(p=>{
			p.querySelectorAll("[data-btn]").forEach(btn=>{
				let name = btn.getAttribute("data-btn");
				if(name)
					this.btns[name] = btn;
			})
		})
	}
	get nextBtn(){
		return this.btns.next;
	}
	get prevBtn(){
		return this.btns.prev;
	}
	get skipBtn(){
		return this.btns.skip;
	}
	initiPages(pages){
		this.pages = [...pages];
		this.maxIndex = this.pages.length-1;
		let index = this.pages.findIndex(p=>p.classList.contains("active"))
		this.setActive(index)
	}
	onDotsClick(e){
		let target = e.target;
		let index = parseInt(target.getAttribute("data-index"));
		if(isNaN(index))
			return

		this.setActive(index);
	}
	onButtonClick(e){
		let btnTypeToAction ={
			'next': 'showNext',
			'prev': 'showPrevious'
		}
		let target = e.target.closest('flow-btn');
		if(!target)
			return
		let action = target.getAttribute("data-action");
		if(!action){
			let btnType = target.getAttribute("data-btn");
			action = btnType && btnTypeToAction[btnType];
		}
		if(!action || !this[action])
			return

		this[action]();
	}
	showPrevious(){
		this.setActive(this.index-1)
	}
	showNext(){
		this.setActive(this.index+1)
	}
	closePages(){
		this.fire("close-pages");
	}
	setActive(index){
		if(index<0)
			index = 0
		else if(index > this.maxIndex){
			this.closePages();
			return
		}
		
		let newPage = this.getPage(index)
		if(!newPage)
			return
		this.lastIndex = this.index;
		this.index = index;
		if(this.index === this.lastIndex)
			return
		let lastPage = this.getPage(this.lastIndex)
		if(lastPage){
			lastPage.classList.remove("active");
			lastPage.style.zIndex = 2
		}

		newPage.classList.add("active");
		newPage.style.zIndex = 3

		//console.log("index", index, this.maxIndex)
		let prevBtn = this.prevBtn;
		let nextBtn = this.nextBtn;
		let skipBtn = this.skipBtn;
		let nextBtnSpan = nextBtn?.querySelector("span");
		if(prevBtn){
			if(index<=0)
				prevBtn.setAttribute("disabled", true);
			else
				prevBtn.removeAttribute("disabled");

			if(nextBtnSpan)
				nextBtnSpan.innerText = 'NEXT';				
			skipBtn.style.display = "block";
		}
		if(nextBtn){
			if(index>=this.maxIndex) {
				skipBtn.style.display = "none";
				if(nextBtnSpan)
					nextBtnSpan.innerText = 'FINISH';
			}
			else
				nextBtn.removeAttribute("disabled");
		}
		this.fireChangeEvent();
	}
	getPage(index){
		return this.pages[index];
	}
	fireChangeEvent(){
		this.fire("change", {index: this.index})
	}
}

FlowPages.define('flow-pages');


