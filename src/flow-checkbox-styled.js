import {BaseElement, html, css} from './base-element.js';

export class FlowCheckboxStyled extends BaseElement {
	static get styles() {
		return css`
		.ext-cross:before, .checkbox__checker:before, .checkbox__cross:before, .checkbox__ok:before, .ext-cross:after, .checkbox__checker:after, .checkbox__cross:after, .checkbox__ok:after {
			content: "";
			display: block;
			position: absolute;
			width: 14px;
			height: 2px;
			margin: 0 auto;
			top: 20px;
			left: 0;
			right: 0;
			background-color: #bf1e1e;
			border-radius: 5px;
			transition-duration: .3s;
		}
		.ext-cross:before, .checkbox__checker:before, .checkbox__cross:before, .checkbox__ok:before {
			-webkit-transform: rotateZ(45deg);
			transform: rotateZ(45deg);
		}
		.ext-cross:after, .checkbox__checker:after, .checkbox__cross:after, .checkbox__ok:after {
			-webkit-transform: rotateZ(-45deg);
			transform: rotateZ(-45deg);
		}

		.ext-ok:before, .checkbox__toggle:checked + .checkbox__checker:before, .checkbox__ok:before, .ext-ok:after, .checkbox__toggle:checked + .checkbox__checker:after, .checkbox__ok:after {
			background-color: #0cb018;
		}
		.ext-ok:before, .checkbox__toggle:checked + .checkbox__checker:before, .checkbox__ok:before {
			width: 6px;
			top: 23px;
			left: -7px;
		}
		.ext-ok:after, .checkbox__toggle:checked + .checkbox__checker:after, .checkbox__ok:after {
			width: 12px;
			left: 5px;
		}

		.checkbox {
			width: 100px;
			margin: 0 auto 30px auto;
		}
		:host([slot="input"]) .checkbox{
			margin:0px;
		}
		.checkbox__container {
			display: block;
			position: relative;
			height: 42px;
			cursor: pointer;
		}
		.checkbox__toggle {
			display: none;
		}
		:host(:not(.size-animate)) .checkbox__toggle:checked + .checkbox__checker {
			left: calc(100% - 43px);
			-webkit-transform: rotateZ(360deg);
			transform: rotateZ(360deg);
		}
		:host(.size-animate) .checkbox__toggle+.checkbox__checker{
			animation:animate1 .3s;
		}
		:host(.size-animate) .checkbox__toggle:checked + .checkbox__checker {
			left: calc(100% - 43px);
			/*-webkit-transform: rotateZ(360deg);
			transform: rotateZ(360deg);*/
			animation:animate .3s;
		}
		
		@keyframes animate1{
			0%{-webkit-transform:scale(1) rotateZ(360deg);transform:scale(1) rotateZ(360deg)}
			50%{-webkit-transform:scale(0.3) rotateZ(180deg);transform:scale(0.3) rotateZ(180deg)}
			100%{-webkit-transform:scale(1) rotateZ(0deg);transform:scale(1) rotateZ(0deg)}
		}
		@keyframes animate{
			0%{-webkit-transform:scale(1) rotateZ(0deg);transform:scale(1) rotateZ(0deg)}
			50%{-webkit-transform:scale(0.3) rotateZ(180deg);transform:scale(0.3) rotateZ(180deg)}
			100%{-webkit-transform:scale(1) rotateZ(360deg);transform:scale(1) rotateZ(360deg)}
		}

		.checkbox__checker, .checkbox__cross, .checkbox__ok {
			display: block;
			position: absolute;
			height: 43px;
			width: 43px;
			top: -1px;
			left: 0px;
			z-index: 1;
		}
		.checkbox__checker {
			border-radius: 50%;
			background-color: #fff;
			box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
			transition: .3s;
			z-index: 2;
		}
		.checkbox__checker:before, .checkbox__checker:after {
			transition-duration: .3s;
		}
		.checkbox__cross:before, .checkbox__cross:after, .checkbox__ok:before, .checkbox__ok:after {
			background-color: #ddd;
		}
		.checkbox__ok {
			left: calc(100% - 43px);
		}
		.checkbox__txt-left, .checkbox__txt-right {
			display: block;
			position: absolute;
			width: 42px;
			top: 15px;
			text-align: center;
			color: #fff;
			font-size: 12px;
			z-index: 1;
		}
		.checkbox__txt-right {
			right: 0px;
		}
		.checkbox__bg {
			position: absolute;
			top: 0;
			left: 0;
			fill: #aaa;
			width: 100%;
			height: 100%;
		}
		`;
	}
	render(){
		return html`
		<div class="checkbox">
			<label class="checkbox__container">
				<input class="checkbox__toggle" type="checkbox" @change="${this.onChange}">
				<span class="checkbox__checker"></span>
				<span class="checkbox__cross"></span>
				<span class="checkbox__ok"></span>
				<svg class="checkbox__bg" space="preserve" __style="enable-background:new 0 0 110 43.76;" version="1.1" viewBox="0 0 110 43.76">
					<path class="shape" d="M88.256,43.76c12.188,0,21.88-9.796,21.88-21.88S100.247,0,88.256,0c-15.745,0-20.67,12.281-33.257,12.281,S38.16,0,21.731,0C9.622,0-0.149,9.796-0.149,21.88s9.672,21.88,21.88,21.88c17.519,0,20.67-13.384,33.263-13.384,S72.784,43.76,88.256,43.76z"></path>
				</svg>
			</label>
		</div>
		`;
	}
	onChange(e){
		this.fire("changed", {checked: e.target.checked})
	}
}

FlowCheckboxStyled.define('flow-checkbox-styled');