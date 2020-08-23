import { BaseElement, html, css, baseUrl } from './base-element.js';
if (!window.PR) {
	let prettify = document.createElement("script");
	prettify.src = baseUrl + 'resources/extern/google-prettify/prettify.js';
	document.head.appendChild(prettify);
}

export class FlowCode extends BaseElement {
	static get properties() {
		return {
			lang : {type:String}
		}
	}
	static get styles() {
		return css`

			.pln{color:#000}@media screen{.str{color:#080}.kwd{color:#008}
			.com{color:#800}.typ{color:#606}.lit{color:#066}.clo,.opn,
			.pun{color:#660}.tag{color:#008}.atn{color:#606}.atv{color:#080}.dec,
			.var{color:#606}.fun{color:red}}@media print,projection{.kwd,.tag,
			.typ{font-weight:700}.str{color:#060}.kwd{color:#006}.com{color:#600;
			font-style:italic}.typ{color:#404}.lit{color:#044}.clo,.opn,
			.pun{color:#440}.tag{color:#006}.atn{color:#404}.atv{color:#060}}
			pre.prettyprint{padding:2px;}
			ol.linenums{margin-top:0;margin-bottom:0}
			li.L0,li.L1,li.L2,li.L3,li.L5,li.L6,li.L7,li.L8{list-style-type:none}
			li.L1,li.L3,li.L5,li.L7,li.L9{background:#eee}

			pre{
				margin:0px;
				white-space:var(--flow-code-white-space, nowrap);
				font-family:var(--flow-code-font-family, monospace);
				font-size:var(--flow-code-font-size, 1rem);
			}

			:host{
				display:inline-block;
				padding:var(--flow-code-padding, 5px);
				margin:var(--flow-code-margin, 1px);
				border:var(--flow-code-border, none);
			}

			:host(.block),
			:host([block]){display:block}
			:host(.hide){display:none}

			/*:host(:not(.no-border):not([no-border])){*/
			:host(.border, [border]){
				border:2px solid var(--flow-primary-color);
			}
		`;
	}
	constructor() {
		super();
		this.lang = 'html';
	}
	render() {
		//let indent = this.clcIndent();
		if (!this.innerHTML_) {
			
			let ta = this.querySelector("textarea"); 
			let v = ta ? ta.value : this.innerHTML;
			// let v = this.innerHTML; //querySelector("textarea").value;
			v = v.split("\n").map(v => {
				//console.log("v1", v)
				// why was this here? this [\t ]* is breaking code...
//				v = v.replace(/^[\t ]*/, "")
				//console.log("v2", v)
				return v;
			}).join("\n");
			this.innerHTML_ = v;
		}

		return html`<pre class="lang-${this.lang}">${this.innerHTML_}</pre>`
	}
	htmlEscape(s) {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	updated() {
		this.updateStyle();
	}

	updateStyle() {
		if (!window.PR) {
			if (!this.count)
				this.count = 0;
			this.count++;
			if (this.count > 1000)
				return
			return setTimeout(() => this.updateStyle(), 100);
		}

		let pre = this.renderRoot.querySelector("pre");
		//console.log("window.PR ready", pre)
		//window.PR.prettyPrint(null, this.renderRoot.querySelector("pre"))
		let code = PR.prettyPrintOne(this.htmlEscape(this.innerHTML_))
		if (this.code != code) {
			this.code = code;
			console.log("updating....")
			//this.update()
			pre.innerHTML = code;
		}

	}
}

FlowCode.define("flow-code");
