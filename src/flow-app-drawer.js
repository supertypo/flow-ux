import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowAppDrawer
* @extends BaseElement

* @property {Boolean} [disabled]
* @property {String} [btnText]
* @property {String} [value]
* @property {Boolean} [opened]
* @property {String} [parentSelector]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {border-radius} [--flow-appdrawer-btn-border-radius=50%]
* @cssvar {box-shadow} [--flow-appdrawer-btn-box-shadow=0px 0px 3px 1px var(--flow-background-inverse-soft))]
* @cssvar {padding} [--flow-appdrawer-btn-padding=10px]
* @cssvar {right} [--flow-appdrawer-btn-right=-10px]
* @cssvar {top} [--flow-appdrawer-btn-right=10px]
* @cssvar {background-color} [--flow-appdrawer-btn-bg=var(--flow-background-color)]
* @cssvar {width} [-flow-appdrawer-btn-width=15px]
* @cssvar {height} [--flow-appdrawer-btn-height=15px]
* @cssvar {left} [--flow-appdrawer-btn-left=15px]
* @cssvar {top} [--flow-appdrawer-btn-top=5px]
* @cssvar {top} [--flow-appdrawer-wrapper-top=20px]
* @cssvar {border} [--flow-appdrawer-border=2px solid var(--flow-primary-color]

* @example
*   <flow-app-drawer></flow-app-drawer>
*
*/
export class FlowAppDrawer extends BaseElement {
	static get properties() {
		return {
			opened:{type:Boolean, reflect:true},
			parentSelector:{type:String}
		}
	}

	static get styles(){
		return css`
			:host{
				display:block;
				position:absolute;left:0px;top:0px;right:0px;bottom:0px;
			}
			.warpper{
				position:absolute;left:0px;top:0px;right:0px;bottom:0px;
				overflow:auto;
			}
			.toggle-btn{
				border-radius:var(--flow-appdrawer-btn-border-radius, 50%);
				box-shadow:var(--flow-appdrawer-btn-box-shadow, 0px 0px 3px 1px var(--flow-background-inverse-soft));
				padding:var(--flow-appdrawer-btn-padding, 10px);
				position:absolute;
				right:var(--flow-appdrawer-btn-right, -10px);
				top:var(--flow-appdrawer-btn-right, -10px);
				background-color:var(--flow-appdrawer-btn-bg, var(--flow-background-color));
				width:var(--flow-appdrawer-btn-width, 15px);
				height:var(--flow-appdrawer-btn-height, 15px);
				z-index:1000;box-sizing:border-box;cursor:pointer;
			}

			:host(.top-btn) .toggle-btn{
				right:initial;
				left:var(--flow-appdrawer-btn-left, 15px);
				top:var(--flow-appdrawer-btn-top, 5px);
			}
			:host(.top-btn) .warpper{
				top:var(--flow-appdrawer-wrapper-top, 20px);
			}
			.toggle-btn:after{
				content:"";
				border:var(--flow-appdrawer-border, 2px solid var(--flow-primary-color));
				border-left-color:transparent;
				border-bottom-color:transparent;
				box-sizing:border-box;
				width:50%;height:50%;
				position:absolute;
				left:15%;
				top:25%;
				transition:transform 0.2s ease;
				transform-origin:center;
				transform:rotate(45deg);
			}
			:host([opened]) .toggle-btn:after{
				transform:translateX(4px) rotate(225deg);
			}
			:host(.hide-btn) .toggle-btn{display:none}

		`;
    }
    constructor() {
        super();
    }
	render() {
		return html`<div class="warpper"><slot></slot></div>
		<span class="toggle-btn" @click="${this.toggle}"></span>`;
	}
	toggle() {
		this.opened = !this.opened;
	}
	updated(changes){
		super.updated(changes);
		if(changes.has("opened")){
			let el = document.querySelector(this.parentSelector || "body");
			el?.classList.toggle("drawer-opened", this.opened);
		}
	}
}

FlowAppDrawer.define('flow-app-drawer');
