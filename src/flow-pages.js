import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowPages
 * @extends {BaseElement}
 * @@prop {Boolean} checked is ckecbox checked?
 * 
 * @example
 * <flow-pages>
 * 	<flow-page>Page 1</flow-page>
 *  <flow-page>Page 2</flow-page>
 * </flow-pages>
 *
 * @cssvar {color} [--flow-checkbox-color=var(--flow-border-color, rgba(0,0,0,.54))]
 * @cssvar {color} [--flow-checkbox-checked-color=var(--flow-border-color, var(--flow-primary-color, #3f51b5))]
 * @cssvar {color} [--flow-checkbox-bg=var(--flow-input-bg, inherit)]
 */

export class FlowPages extends BaseElement {
	static get properties() {
		return {
			pages:{type:Array},
			index:{type:Number}
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

		`;
	}
	render(){
		let prevIcon = this.iconPath('arrow-alt-left');
		let nextIcon = this.iconPath('arrow-alt-right');
		let dots = new Array((this.pages || []).length).fill(0);
		if(dots.length)
			dots[this.index||0] = 1;

		return html`
		<slot name="title"></slot>
		<div class="wrapper">
			<slot></slot>
			<div class="dots" @click="${this.onDotsClick}">${dots.map((active,i)=>{
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
	setActive(index){
		if(index<0)
			index = 0
		else if(index > this.maxIndex)
			index = this.maxIndex;
		
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
		console.log("nextBtn", nextBtn)
		if(prevBtn){
			if(index<=0)
				prevBtn.setAttribute("disabled", true);
			else
				prevBtn.removeAttribute("disabled");
		}
		if(nextBtn){
			if(index>=this.maxIndex)
				nextBtn.setAttribute("disabled", true);
			else
				nextBtn.removeAttribute("disabled");
		}
		
	}
	getPage(index){
		return this.pages[index];
	}
	fireChangeEvent(){
		this.fire("changed", {checked: this.active})
	}
}

FlowPages.define('flow-pages');