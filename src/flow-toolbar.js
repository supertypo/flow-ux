import {BaseElement, html, css} from './base-element.js';
import './fa-icon.js';
export * from './flow-toolbar-item.js';

/**
* @class FlowToolbar
* @extends BaseElement
* @example
*   <flow-toolbar></flow-toolbar>
*
*/

export class FlowToolbar extends BaseElement {
	static get properties() {
		return {
			items:{type:Array, value:[]}
		}
	}

	static get styles() {
		return css`
			:host{
				padding:var(--flow-toolbar-padding, 0px 5px);
				align-items:center;
			}
			:host,
			.tools{
				display:flex;
			}
			.tools{
				padding:var(--flow-toolbar-tools-padding, 5px 0px);
				min-height:var(--flow-toolbar-tools-min-height, 76px);
				box-sizing:border-box;
			}
			/*.tool{
				position:relative;
				text-align:var(--flow-toolbar-item-text-align, center);
				padding:var(--flow-toolbar-item-padding, 5px);
			}
			.tool:before{
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
			.tool:not(.disabled){
				cursor:pointer;
			}
			.tool:not(.disabled):hover:before{
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
			}
			.sub-text{
				font-size:var(--flow-toolbar-item-sub-text-font-size, 0.5rem);
			}
			*/
		`;
	}



	render() {
		let items = this.items
		return html`
		<div class="tools">
		<slot name="prefix"></slot>
		${
			items.map(o=>{
				return html`<flow-toolbar-item 
					data-code="${o.code||o.text}"
					class="${o.cls||''}"
					text="${o.text||''}"
					subText="${o.subText||''}"
					icon="${o.icon||''}"

					pressedText="${o.pressedText||''}"
					pressedSubText="${o.pressedSubText||''}"
					pressedIcon="${o.pressedIcon||''}"
					?togglable=${o.togglable||false}
					?pressed=${o.pressed||false}>
				</flow-toolbar-item>`
			})
		}
		<slot></slot>
		</div>`;
	}
	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}

	firstUpdated(){
		this.renderRoot.addEventListener("click", this.onToolClick.bind(this));

		/////////////////////////////////////////////////////////////////
		this.renderRoot.addEventListener("flow-toolbar-item-state", e=>{
			this.fire("flow-toolbar-item-state", e.detail, {bubbles:true})
		})
		/// what the hell it is ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		// bubbles event issue
		/////////////////////////////////////////////////////////////////

	}

	onToolClick(e){
		let tool = e.target.closest(".flow-toolbar-item, flow-toolbar-item");
		if(!tool)
			return
		this.fire("tool-click", {tool:tool.dataset.code, btn:tool});
	}
}

FlowToolbar.define('flow-toolbar');
