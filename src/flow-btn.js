import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowBtn
* @extends BaseElement
* @example
*   <flow-btn>Button 1</flow-btn>
* @property {Boolean} [disabled] 
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {color} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {color} [--flow-border-hover-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {color} [--flow-btn-primary-invert-color=var(--flow-primary-invert-color, #FFF)]
* @cssvar {color} [--flow-btn-success-color=var(--flow-btn-success-color, #FFF)]
* @cssvar {color} [--flow-btn-hover-info-color=var(--flow-btn-info-color, #FFF))]
* @cssvar {color} [--flow-btn-hover-success-color=var(--flow-btn-success-color, #FFF))]
* @cssvar {color} [--flow-btn-hover-warning-color=var(--flow-btn-warning-color, #FFF))]
* @cssvar {color} [--flow-btn-hover-danger-color=var(--flow-btn-danger-color, #FFF))]
* @cssvar {color} [--flow-btn-warning-color=var(--flow-btn-warning-color, #FFF))]
* @cssvar {color} [--flow-btn-danger-color=var(--flow-btn-danger-color, #FFF))]
* @cssvar {color} [--flow-btn-info-color=var(--flow-btn-info-color, #FFF))]
* @cssvar {background-color} [--flow-btn-primary-bg-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background-color} [--flow-btn-success-bg-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background-color|border-color} [--flow-btn-hover-success-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-warning-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-hover-warning-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-danger-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-hover-danger-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-info-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {background-color|border-color} [--flow-btn-hover-info-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {border-color} [--flow-btn-hover-success-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {border-color} [--flow-btn-success-bg-color=var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {border-radius} [--flow-btn-radius=8px]
*/
export class FlowBtn extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				margin: var(--flow-btn-margin);
				padding:var(--flow-btn-padding, 5px);
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-btn-radius, 8px);
				border-width:var(--flow-btn-border-width, 2px);
				font-family:var(--flow-btn-font-family, var(--flow-font-family, initial));
				font-weight:var(--flow-btn-font-weight, var(--flow-font-weight, bold));
				font-size:var(--flow-btn-font-size, initial);
				line-height:var(--flow-btn-line-height, inherit);
				user-select: none;
			}
			:host([disabled]){
				opacity:0.5;
				cursor:default;
				pointer-events:none;
			}
			:host(.start-justifed){
				justify-self:flex-start;
			}
			:host(.end-justifed){
				justify-self:flex-end;
			}
			:host(:not([disabled])){
				cursor:pointer;
				background-color:var(--flow-btn-bg-color, inherit);
				border-color:var(--flow-btn-bg-color, inherit);
				color:var(--flow-btn-color, inherit);
			}
			:host(:not([disabled]):hover){
				background-color:var(--flow-btn-hover-bg-color, inherit);
				border-color:var(--flow-btn-hover-bg-color, inherit);
				color:var(--flow-btn-hover-color, inherit);
			}
			:host([primary]),
			:host(.primary){
				background-color:var(--flow-btn-primary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-primary-invert-color, var(--flow-primary-invert-color, #FFF));
			}
			:host([primary]:not([disabled]):hover),
			:host(.primary:not([disabled]):hover){
				background-color:var(--flow-btn-hover-primary-bg-color, var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1))));
			}

			:host(.secondary){
				background-color:var(--flow-btn-secondary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-secondary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-secondary-color, #FFF);
			}

			:host(.secondary:not([disabled]):hover){
				background-color:var(--flow-btn-hover-secondary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-secondary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-secondary-color, var(--flow-btn-secondary-color, #FFF));
			}

			:host(.success){
				background-color:var(--flow-btn-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-success-color, #FFF);
			}

			:host(.success:not([disabled]):hover){
				background-color:var(--flow-btn-hover-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-success-color, var(--flow-btn-success-color, #FFF));
			}

			:host(.warning){
				background-color:var(--flow-btn-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-warning-color, #FFF);
			}

			:host(.warning:not([disabled]):hover){
				background-color:var(--flow-btn-hover-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-warning-color, var(--flow-btn-warning-color, #FFF));
			}

			:host(.danger){
				background-color:var(--flow-btn-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-danger-color, #FFF);
			}

			:host(.danger:not([disabled]):hover){
				background-color:var(--flow-btn-hover-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-danger-color, var(--flow-btn-danger-color, #FFF));
			}

			:host(.info){
				background-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-info-color, #FFF);
			}

			:host(.info:not([disabled]):hover){
				background-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-info-color, var(--flow-btn-info-color, #FFF));
			}

			.wrapper{
				display:flex;
				align-items:center;
				margin:var(--flow-btn-wrapper-margin, 5px);
				/*min-width:50px;*/
				min-width: var(--flow-btn-wrapper-min-width,50px);
				text-align:center;
				justify-content:center;
			}
		`;
	}
	constructor(){
		super()
		this.setAttribute('role', 'button');
	}
	render() {
		return html`
		<div class="wrapper" @click=${this.click}>
			<slot></slot>
		</div>
		`;
	}

	click() {
		this.fire("flow-btn-click", {el:this})
		/*let form = this.form || this.getAttribute("form");

		if(typeof(form) == 'string'){
			form = document.querySelector(form);
		}

		if(form && form.submit())*/
	}
}

FlowBtn.define('flow-btn');
