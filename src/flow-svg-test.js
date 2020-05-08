import {BaseElement, html, css} from './base-element.js';

export class FlowSVGTest extends BaseElement {

	static get properties() {
		return {
			checked : { type : Boolean }
		}
	}
	static get styles() {
		return css`
			:host{display:inline-block}
		`
	}

	constructor() {
		super();
		let template = document.createElement('template');

		this.ident = 'path-'+Math.round((Math.random()*1e16)).toString(16);
		//html = html.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
			<path
				style="fill:none;stroke:#000000;stroke-width:20px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
				d="M 157.04983,38.414322 H 2.3523133 V 239.82002 H 203.01068 V 84.748842"
				id="path3748"
				inkscape:connector-curvature="0" />

			<path  id="${this.ident}" 
				style="fill:none;stroke:#000000;stroke-width:20px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
				d="M 40.839859,122.86272 83.81139,165.83425 247.66371,1.9819364"
				id="path3750"
				inkscape:connector-curvature="0" />
		</svg>`;
		// <path id="${this.ident}" fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-miterlimit="10" d="M66.039,133.545c0,0-21-57,18-67s49-4,65,8
		//    s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
		//    C46.039,146.545,53.039,128.545,66.039,133.545z"/>
		//<path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/>
		//	    return template.content.childNodes;//firstChild.cloneNode(true);

		//		this.viewBox = template.content.
		// <path id="${this.ident}" xfill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-miterlimit="10" d="M43.542,8.812c-0.465-0.3-1.083-0.166-1.383,0.298L21.718,40.816L7.671,28.11c-0.41-0.372-1.042-0.339-1.413,0.07
		// 	c-0.371,0.41-0.339,1.042,0.071,1.412L21.25,43.089c0.185,0.168,0.424,0.259,0.671,0.259c0.043,0,0.087-0.003,0.131-0.009
		// 	c0.291-0.038,0.551-0.203,0.709-0.449l21.08-32.696C44.14,9.729,44.006,9.111,43.542,8.812z"/>

		this.svg = template.content.firstChild.cloneNode(true);
		this.svg.style.overflow = 'visible';

		this.viewBox = this.svg.getAttribute("viewBox");

		this.path = this.svg.querySelector("path");
		this.length = this.path.getTotalLength();
		//console.log("PATH:",this.path,this.length);

		//this.path.style.strokeDashoffset = this.length*2;

		//this.segment = new Segment(this.path);

	}

	createRenderRoot() {
		return this;
	}

	render() {
		let style = this.checked ? 
			html`
				#${this.ident} {
					stroke-dasharray: ${this.length};
					stroke-dashoffset: ${this.length};
					animation: dash 0.4s ease-in-out forwards;
					display: block;
				}

			`
			:
			html`
				#${this.ident} {
					/*transform: scale(2,2) translate(0,-5%);*/
					transform-origin:center;
					opacity : 0.0;
				}
			`;

		return html`

		<style>
		.wrapper {
			padding: 4px;
			/*border:1px solid red;*/
		}
		#${this.ident} {
			transition: all 0.2s ease;
			trantition-property: transform, opacity;
		}
		${style}
		@keyframes dash {
			to {
				stroke-dashoffset: 0;
			}
		}		
		</style>

		<span class="wrapper" @click=${this.toggle}>
		${this.svg}
		</span>`;

		//<svg viewBox="${this.viewBox}">${this.path}</svg>`;

		/*
		return html`

		<style>
			svg {
				width : auto;
				height : 100%;
				fill:red;
			}
		</style>

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/></svg>

		`;

		*/		
	}

	toggle() {
		this.checked = !this.checked;
		console.log("checked:",this.checked);
	}

	updated() {/*
		console.log("DRAWING SEGMENT",this.innerHTML);
				let path = this.querySelector("path");
				console.log("path:",path)
				 let segment = new Segment(path);

				segment.draw("25%","75% - 10", 5);
				*/
		//this.segment.draw("20%","70% - 10", 5);
	}
}

FlowSVGTest.define('flow-svg-test')