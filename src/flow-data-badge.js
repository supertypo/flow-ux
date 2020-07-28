import {BaseElement, html, css, dpc} from './base-element.js';
import {Flowd3Element} from './flow-d3.js';
import {FlowSampler} from './flow-sampler.js';

/**
* @class FlowDataBadge
* @extends BaseElement
* @example
*   <flow-data-badge title="text">value</flow-data-badge>
* @property {Boolean} [disabled] 
* @property {String} [title] 
* @property {String} [prefix] 
* @property {String} [suffix] 
* @property {String} [align] 
* @cssvar {font-family} [--flow-data-badge-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-data-badge-font-weight=bold]
* @cssvar {border} [--flow-primary-color=#333]
*/
export class FlowDataBadge extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect:true},
			title:{type:String},
			prefix : { type : String },
			suffix:{type:String},
			align:{type:String}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-weight:bold;
				font-size:13px;
				text-transform:uppercase;
				cursor:pointer;
				font-family:var(--flow-data-badge-font-family, "Julius Sans One");
				font-weight:var(--flow-data-badge-font-weight, bold);
				width:var(--flow-data-badge-width);
				min-width:var(--flow-data-badge-min-width);
				max-width:var(--flow-data-badge-max-width);
				margin:var(--flow-data-badge-margin);
			}
			:host([disabled]){opacity:0.5;cursor:default;pointer-events:none;}
			.colon{display:none}
			:host(.has-colon) .colon{display:inline;}
			.container{
				white-space: nowrap;
				border: var(--flow-data-badge-container-border, 2px) solid var(--flow-primary-color,#333);
				xdisplay:flex;xflex-firection:column;xalign-items:center;
				padding:var(--flow-data-badge-container-padding,2px 6px);
				margin: var(--flow-data-badge-container-margin, 6px);
				box-shadow: 2px 2px 1px rgba(1, 123, 104, 0.1);
				border-radius: 10px;

			}
			.container>div{padding:2px;}
			.title{text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-badge-caption); xtext-shadow: 0px 0px 0px var(--flow-data-badge-caption-shadow, #fff); }
			.value{text-align:right;opacity:1;
				font-size:var(--flow-data-badge-value-font-size,14px);
				font-family:var(--flow-data-badge-value-font-family,"Exo 2");
				font-weight:var(--flow-data-badge-value-font-weight,normal);
				
			}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left; }
			.row { display: flex; flex-direction: row; color: var(--flow-data-field-value,#333); }
		`;
	}

	render() {
		return html
		`<div class="container col">
			<div class="title">${this.title}<span class="colon">:</span></div>
			<div class="row">
				${ (!this.align || this.align == 'right') ? html`<div style="flex:1;"></div>` : '' }
				<div class="prefix">${this.prefix}</div>
				<div class="value"><slot></slot></div>
				<div class="suffix">${this.suffix}</div>
				${ (this.align == 'left') ? html`<div style="flex:1;"></div>` : '' }
			</div>
		</div>`;	
	}
}

//FlowDataBadge.define('flow-data-badge');
FlowDataBadge.define('flow-data-badge');

