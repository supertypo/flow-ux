import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowReference
* @extends BaseElement
* @property {String} [for]
* @property {String} [type]
* @example
*   <flow-tooltip>Button 1</flow-tooltip>
*
*
*/

export class FlowReference extends BaseElement {
	static get properties() {
		return {
			for : { type : String },
            type : { type : String },
            icon : {type : String},
            visible : { type : Boolean },
            'right-align-tooltip':{type:Boolean}
		}
	}

	static get styles() {
		return css`
			:host {
		
            }
			.icon-box{
				display:inline-block;
				width:20px;
				max-width:20px;
				text-align:center;
				/*border: 1px solid red;*/
			}
	
			.icon-box svg{
				width:15px;
				height:15px;
				margin-right: 8px;
				margin-bottom: 8px;
				/*margin-left: 8px;*/
				/*fill:var(--flow-primary-color, rgba(0,151,115,1.0));*/
				fill: #666;
			}
			.tooltip-content{display:none}			
		`;
	}
	constructor() {
        super();
    }

	render() {
		let iconSrc = "";
		if(this.icon != "-")
			iconSrc = this.iconPath(this.icon || "fal:info-circle");
		// const iconSrc = this.iconPath(this.icon || "info-circle");

		return html`
			<slot></slot>
			<span class="tooltip" @mouseenter="${this.onTooltipMouseEnter}">
				<div class="icon-box"><svg><use href="${iconSrc}"></use></svg></div>
				<slot class="tooltip-content" name="tooltip"></slot>
			</span>
		`;
	}

	firstUpdated(){
		super.firstUpdated();
		this.tooltipEl = this.renderRoot.querySelector(".tooltip");
		this.tooltipTextEl = document.createElement("div");
		this.tooltipTextEl.classList.add("flow-tooltip-text")
		this.tooltipSlot = this.renderRoot.querySelector(".tooltip-content");
		this.tooltipSlot.addEventListener('slotchange', e=>{
			this.updateTooltipContent();
		});
		document.body.append(this.tooltipTextEl);
		this.updateTooltipContent();

		this.tooltipTextEl.addEventListener("mouseenter", ()=>{
			this.mouseInTooltipContent = true;
		})

		this.tooltipTextEl.addEventListener("mouseleave", ()=>{
			this.mouseInTooltipContent = false;
			this.tooltipTextEl.classList.remove("active")
			if(this.timeoutId){
				clearTimeout(this.timeoutId)
				delete this.timeoutId;
			}
		})
	}

	updateTooltipContent(){
		let nodes = this.tooltipSlot.assignedNodes();
		this.tooltipTextEl.innerHTML = "";
		nodes.forEach(n=>{
			this.tooltipTextEl.append(n.cloneNode(true));
		})
	}

	onTooltipMouseEnter(e){
		let box = this.tooltipEl.getBoundingClientRect();
		//console.log("box", box)
		let cX = box.left + box.width/2;
		let cY = box.top + box.height/2;
		let winWidth = window.innerWidth;
		let winHWidth = winWidth/2;
		let winHeight = window.innerHeight;
		let winHHeight = winHeight/2;

		let style = this.tooltipTextEl.style;
		if(this['top-align-tooltip'] || cY > winHHeight){
			style.top = 'initial';
			style.bottom = (winHeight-box.top)+"px";
		}else{
			style.bottom = 'initial';
			style.top = box.bottom+"px";
		}
		
		if(this['right-align-tooltip'] || cX > winHWidth){
			style.left = 'initial';
			style.right = (winWidth - box.right)+"px";
		}else{
			style.right = 'initial';
			style.left = box.left+"px";
		}

		this.tooltipTextEl.classList.add("active")
		this.checkAndCloseTooltipIfAway();
	}
	checkAndCloseTooltipIfAway(e){
		this.timeoutId = setTimeout(()=>{
			if(this.mouseInTooltipContent)
				return this.checkAndCloseTooltipIfAway();
			this.tooltipTextEl.classList.remove("active")
		}, 1000)
	}
}

FlowReference.define('flow-reference');
