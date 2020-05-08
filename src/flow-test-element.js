import {BaseElement, html, css} from './base-element.js';

export class FlowTestElement extends BaseElement {

	static get properties() {
		return {
			mood: {type: String}
		}
	}

	static get styles() {
		return css`.mood { color: green; }`;
	}

	constructor() {
		super();

		this.content = "123";

		// let slots = this.shadowRoot.querySelectorAll("slot");
		// slots[1].addEventListener('slotchange', function(e) {
		//   let nodes = slots[1].assignedNodes();
		//   console.log('Element in Slot "' + slots[1].name + '" changed to "' + nodes[0].outerHTML + '".');
		// });		
	}

	createRenderRoot() {
		// console.log("S1",this.querySelector("slot"));
		// console.log(this.innerHTML);

		this.tpl_ = this.innerHTML;

		// this.display_ = this.style.display;

		// this.style.display = "none";

		return this;

		let root;

		// can't use querySelector because it would break with nesting because we don't
		// have shadow DOM boundaries anymore. We don't know what's the content
		// of this element, vs the content of child elements. 🤷‍♂️

		// for (const child of this.childElements) {
		// 	if (child.matches('div.content') {
		// 		root = child;
		// 		break;
		// 	}
		// }

		if (root === undefined) {
			//root = document.createTextNode('');
			root = document.createElement('template');
			//root.className = 'i18n';
			this.appendChild(root);

			// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
			/*let observer = new MutationObserver((mutationList, observer) => {
				console.log('A child node has been added or removed.',root.innerHTML);


				let slots = this.querySelectorAll("slot");
				observer.observe(slots[0],{childList: true});


			})

			observer.observe(root, { childList : true })
			*/

			/*
				let slots = this.querySelectorAll("slot");
				//let nodes = slot[0].assignedNodes();
				//console.log("slot nodes",nodes)
				slots[0].addEventListener('slotchange', function(e) {
				  let nodes = slots[1].assignedNodes();
				  console.log('Element in Slot "' + slots[1].name + '" changed to "' + nodes[0].outerHTML + '".');
				});		
			*/
		}

		return root;
	}

	htmlToElement(html) {
		let template = document.createElement('template');
		html = html.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = `<span>${html}</span>`;
		//return template.content.childNodes;//firstChild.cloneNode(true);
		return template.content.firstChild.cloneNode(true);
	}


	render() {
		//return html`YAY`;
		//console.log("THIS:",this);
		//return html`Web Components are <span class="mood">${this.mood}</span>!`;
		//return html`${this.tpl_}`;//<slot></slot>`;
		//let H = this._T(this.tpl_);//<slot></slot>`;
		//console.log("RETURNING:",H)
		let H = this._T(this.tpl_);
		//console.log("H:",H);
		return html`${H}`;
		//return H;//html`${H}`;
	}  

	afterRender() {
		//console.log("AFTER RENDER")
	}

	updated() {
		//console.log("UPDATED!", this.innerHTML);
		//this.style.display = this.display_;
		//this.innerHTML = this.innerHTML.replace("WORKED","HELLO")
	}

	_T(html) {
		//console.log("replacing",html);
		html = html.replace("WORKED","W_O_R_K_E_D");
		return this.htmlToElement(html);
		//return this.htmlToElement("HELLO <i>WORLD</i> W<b>W</b>WW");
	}
}

FlowTestElement.define('flow-test-element');
