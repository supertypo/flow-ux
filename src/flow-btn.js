import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowBtn
* @extends BaseElement
* @example
*   <flow-btn>Button 1</flow-btn>
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {color} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {color} [--flow-border-hover-color=var(--flow-primary-color, rgba(0,151,115,1))]
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
				padding:5px;
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
				font-family:var(--flow-font-family, initial);
				font-weight:var(--flow-font-weight, bold);
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
			}
			:host(:not([disabled]):hover){
				border-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)))
			}
			:host([primary]),
			:host(.primary){
				background-color:var(--flow-btn-primary-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-primary-invert-color, var(--flow-primary-invert-color, #FFF));
			}
			:host([primary]:not([disabled]):hover),
			:host(.primary:not([disabled]):hover){
				background-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)));
			}

			:host(.success){
				background-color:var(--flow-btn-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-success-color, var(--flow-btn-success-color, #FFF));
			}

			:host(.success:not([disabled]):hover){
				background-color:var(--flow-btn-hover-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-success-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-success-color, var(--flow-btn-success-color, #FFF));
			}

			:host(.warning){
				background-color:var(--flow-btn-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-warning-color, var(--flow-btn-warning-color, #FFF));
			}

			:host(.warning:not([disabled]):hover){
				background-color:var(--flow-btn-hover-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-warning-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-warning-color, var(--flow-btn-warning-color, #FFF));
			}

			:host(.danger){
				background-color:var(--flow-btn-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-danger-color, var(--flow-btn-danger-color, #FFF));
			}

			:host(.danger:not([disabled]):hover){
				background-color:var(--flow-btn-hover-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-danger-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-danger-color, var(--flow-btn-danger-color, #FFF));
			}

			:host(.info){
				background-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-info-color, var(--flow-btn-info-color, #FFF));
			}

			:host(.info:not([disabled]):hover){
				background-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-info-color, var(--flow-btn-info-color, #FFF));
			}

			:host(.info){
				background-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-info-color, var(--flow-btn-info-color, #FFF));
			}

			:host(.info:not([disabled]):hover){
				background-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-hover-info-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-hover-info-color, var(--flow-btn-info-color, #FFF));
			}

			.wrapper{
				display:flex;
				align-items:center;
				margin:5px;
				min-width:50px;
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
