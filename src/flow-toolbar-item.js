import {BaseElement, html, css} from './base-element.js';

/**
* @class FlowToolbarItem
* @extends BaseElement
* @example
*   <flow-toolbar-item></flow-toolbar-item>
*
*/

export class FlowToolbarItem extends BaseElement {
	static get properties() {
		return {
			text:{type:String, value:""},
			subText:{type:String, value:""},
			icon:{type:String, icon:""},
			pressedText:{type:String, value:""},
			pressedSubText:{type:String, value:""},
			pressedIcon:{type:String, icon:""},
			togglable:{type:Boolean, reflect:true},
			pressed:{type:Boolean, reflect:true}
		}
	}

	static get styles() {
		return css`
			:host{
				position:relative;display:block;
				text-align:var(--flow-toolbar-item-text-align, center);
				padding:var(--flow-toolbar-item-padding, 5px);
				max-width:var(--flow-toolbar-item-max-width, 80px);
				min-width:var(--flow-toolbar-item-min-width, 60px);
			}
			:host:before{
				position: absolute;
			    left: 0px;
			    top: -2px;
			    bottom: -2px;
			    right: 0px;
			    background:var(--flow-toolbar-item-shadow-bg, rgba(100,100,100, 0.2));
			    border-radius: 100px;
			    transform-origin: center center;
			    transform: scale(0,0);
			    transition: all 0.2s ease;
			    content:"";z-index:-1;
			}
			:host(:not(.disabled)){
				cursor:pointer;
			}
			:host(:not(.disabled):hover):before{
			    border-radius: 3px;
			    transform: scale(1,1);
			}
			.icon{
				display:block;
				width:var(--flow-toolbar-item-icon-width, 28px);
			    height:var(--flow-toolbar-item-icon-height, 28px);
			    margin:var(--flow-toolbar-item-icon-margin, 0px auto);
			    --fa-icon-size:var(--flow-toolbar-item-icon-width, 28px);
			}
			.text{
				font-size:var(--flow-toolbar-item-text-font-size, 0.6rem);
				user-select:none;
			}
			.sub-text{
				font-size:var(--flow-toolbar-item-sub-text-font-size, 0.5rem);
				user-select:none;
			}
			:host([togglable][pressed]){
				background:var(--flow-toolbar-item-pressed-bg, initial);
				color:var(--flow-toolbar-item-pressed-color, var(--flow-primary-color));
				--fa-icon-color:var(--flow-toolbar-item-pressed-icon-color, var(--flow-primary-color));
			}
		`;
	}

	constructor(){
		super();
		this.initPropertiesDefaultValues();
		this.addEventListener("click", this.onClick.bind(this));
	}

	render() {
		let {text, subText, icon, togglable, pressed} = this;
		if(togglable && pressed){
			let {pressedText, pressedSubText, pressedIcon} = this;
			if(pressedText)
				text = pressedText;
			if(pressedSubText)
				subText = pressedSubText;
			if(pressedIcon)
				icon = pressedIcon;
		}
		return html`${icon? html`<fa-icon class="icon" icon="${icon}" size="28"></fa-icon>`:''}
				${text? html`<div class="text">${text}</div>`:''}
				${subText? html`<div class="sub-text">${subText}</div>`:''}
				`
	}
	onClick(){
		if(!this.togglable)
			return
		this.pressed = !this.pressed;
		this.fire("flow-toolbar-item-state", {
			pressed:this.pressed, el:this,
			code:this.dataset.code
		}, {bubbles:true});
	}
}

FlowToolbarItem.define('flow-toolbar-item');
