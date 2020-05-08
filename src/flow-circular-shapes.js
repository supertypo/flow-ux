import {BaseElement, html, css} from './base-element.js';

export class FlowCircularShapes extends BaseElement {
	constructor() {
		super();
		this.ident = Math.round((Math.random()*1e16)).toString(16);
		this.template = document.createElement('template');
	}

	generate() {
		this.targets = [...this.querySelectorAll('.square')];

		let rects = this.targets.map(t => t.getBoundingClientRect());
		if(!rects.length)
			return;
		let rect = { left : rects[0].left, top : rects[0].top, right : rects[0].right, bottom : rects[0].bottom  };
		rects.forEach(r => {
			if(r.left < rect.left)
				rect.left = r.left;
			if(r.top < rect.top)
				rect.top = r.top;
			if(r.right > rect.right)
				rect.right = r.right;
			if(r.bottom > rect.bottom)
				rect.bottom = r.bottom;
		})

		//console.log("SHAPES RECT:",this.targets,rects,rect)

		let path = '';

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}">
			<rect x="${rect.left}" y="${rect.top}" width="${rect.right-rect.left}" height="${rect.bottom-rect.top}"
				fill="none" stroke="red" />
				<!--text x="0" y="0">
				HELLO WORLD
				</text-->
				${path}
			</svg>`;

		this.template.innerHTML = svg;
		this.svg = this.template.content.firstChild.cloneNode(true);
	}

	static get styles() {
		return css`
			.wrapper {
				position: relative;
				overflow:hidden;
			}

			.container {
				position: absolute;
				left : 0;
				top : 0;
			}

			.svg {
				position: absolute;
				left: 0;
				top: 0;
			}
		`;
	}
	render() {
		this.generate();
		return html`
			<style>
				.wrapper {
					height: ${this.height || 0};
				}
			</style>
			<div class="wrapper">
				<div class="container">
				</div>
				<div class="svg">
					${this.svg || ''}
				</div>
			</div>
		`;
	}

	firstUpdated() {
		this.generate();
		this.requestUpdate();
	}
}

FlowCircularShapes.define('flow-circular-shapes');