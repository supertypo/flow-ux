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
            visible : { type : Boolean }
		}
	}

	static get styles() {
		return css`
			:host {
		
            }
            
            .tooltip {
				position: relative; z-index:100000;
			}
			
			.tooltip .tooltiptext {
				visibility: hidden;
				display:flex;flex-direction:column;
				width:200px;
				font-size: 0.9rem;
				font-weight:normal;
				background-color: black;
				color: #fff;
				text-align: left;
				padding: 10px ;
				border-radius: 5px;
				position: absolute;
				z-index:100000;
				top:100%;
				left:1%;
			}
			
			.tooltip:hover .tooltiptext {
				visibility: visible;
			}
			
			.link-tooltip {color:#07b9b9;text-decoration:none;font-weight:bold;}
		
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
			<span class="tooltip">
				<div class="icon-box"><svg><use href="${iconSrc}"></use></svg></div>
				<slot name="tooltip" class="tooltiptext"></slot>
			</span>	
			
		`;

	}
}

FlowReference.define('flow-reference');
