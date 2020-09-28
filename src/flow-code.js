import { BaseElement, html, css, baseUrl } from './base-element.js';
if (!window.PR) {
	let prettify = document.createElement("script");
	prettify.src = baseUrl + 'resources/extern/google-prettify/prettify.js';
	document.head.appendChild(prettify);
}

/**
 * @export
 * @class FlowCode
 * @prop {Boolean} fixindent
 * @prop {String} lang
 * @extends {BaseElement}
 * @cssvar {white-space} [--flow-code-white-space=nowrap]
 * @cssvar {font-family} [--flow-code-font-family=monospace]
 * @cssvar {font-size} [--flow-code-font-size=1rem]	
 * @cssvar {padding} [--flow-code-padding=5px]
 * @cssvar {margin} [--flow-code-margin=1px]
 * @cssvar {border} [--flow-code-border=none]
 */
export class FlowCode extends BaseElement {
	static get properties() {
		return {
			lang : {type:String},
			fixindent:{type:Boolean},
			theme:{type:String}
		}
	}
	static get styles() {
		return css`

			.pln{
				color:var(--flow-code-pln, #000);
			}
			@media screen{
				.str{color:var(--flow-code-str, #080)}
				.kwd{color:var(--flow-code-kwd, #008)}
				.com{color:var(--flow-code-com, #800)}
				.typ{color:var(--flow-code-typ, #606)}
				.lit{color:var(--flow-code-lit, #066)}
				.opn{color:var(--flow-code-opn, #660)}
				.clo{color:var(--flow-code-clo, #660)}
				.pun{color:var(--flow-code-pun, #660)}
				.tag{color:var(--flow-code-tag, #008)}
				.atn{color:var(--flow-code-atn, #606)}
				.atv{color:var(--flow-code-atv, #080)}
				.dec{color:var(--flow-code-dec, #606)}
				.var{color:var(--flow-code-var, #606)}
				.fun{color:var(--flow-code-fun, red)}
			}
			@media print,projection{
				.kwd,.tag,
				.typ{font-weight:var(--flow-code-print-tag-font-weight, 700)}
				.str{color:var(--flow-code-print-str, #060)}
				.kwd{color:var(--flow-code-print-kwd, #006)}
				.com{
					color:var(--flow-code-print-com, #600);
					font-style:var(--flow-code-print-com-font-style, italic)
				}
				.typ{color:var(--flow-code-print-typ, #404)}
				.lit{color:var(--flow-code-print-lit, #044)}
				.opn{color:var(--flow-code-print-opn, #440)}
				.clo{color:var(--flow-code-print-clo, #440)}
				.pun{color:var(--flow-code-print-pun, #440)}
				.tag{color:var(--flow-code-print-tag, #006)}
				.atn{color:var(--flow-code-print-atn, #404)}
				.atv{color:var(--flow-code-print-atv, #060)}
			}
			pre{
				background:var(--flow-code-pre-bg);
			}
			pre.prettyprint{padding:2px;}
			ol.linenums{
				margin-top:var(--flow-code-linenums-margin-top, 0);
				margin-bottom:var(--flow-code-linenums-margin-bottom, 0);
				color:var(--flow-code-linenums-color, inherit);
			}
			li.L0,li.L1,li.L2,li.L3,li.L4,li.L5,li.L6,li.L7,li.L8,li.L9{
				list-style-type:none;
				padding-left:var(--flow-code-lines-padding-left, 0);
				background-color:var(--flow-code-lines-bg, initial);
			}
			li.L1,li.L3,li.L5,li.L7,li.L9{
				background:var(--flow-code-odd-line-bg, #eee)
			}

			pre{
				margin:0px;
				white-space:var(--flow-code-white-space, nowrap);
				font-family:var(--flow-code-font-family, monospace);
				font-size:var(--flow-code-font-size, 1rem);
				padding:var(--flow-code-pre-padding, 0px 0px 16px);
			}

			:host{
				display:inline-block;max-width:100%;box-sizing: border-box;
				overflow:auto;
				padding:var(--flow-code-padding, 5px);
				margin:var(--flow-code-margin, 1px);
				border:var(--flow-code-border, none);
				background:var(--flow-code-pre-bg);
			}

			:host(.block),
			:host([block]){display:block}
			:host(.hide){display:none}

			/*:host(:not(.no-border):not([no-border])){*/
			:host(.border, [border]){
				border:2px solid var(--flow-primary-color);
			}


			/* hemisu-light */
			/*
			pre.theme-hemisu-light{
				font-family:Menlo,Bitstream Vera Sans Mono,DejaVu Sans Mono,Monaco,Consolas,monospace;
				border:0!important
			}
			*/
			.theme-hemisu-light{
				--flow-code-pre-bg:#fff;
				--flow-code-lines-bg:#fff;
				--flow-code-pln:#111;
				--flow-code-linenums-color:#999;

				--flow-code-lines-padding-left:1em;
				--flow-code-linenums-margin-top:0;
				--flow-code-linenums-margin-bottom:0;

				--flow-code-str:#739200;
				--flow-code-kwd:#739200;
				--flow-code-com:#999;
				--flow-code-typ:#f05;
				--flow-code-lit:#538192;
				--flow-code-pun:#111;
				--flow-code-opn:#111;
				--flow-code-clo:#111;
				--flow-code-tag:#111;
				--flow-code-atn:#739200;
				--flow-code-atv:#f05;
				--flow-code-dec:#111;
				--flow-code-var:#111;
				--flow-code-fun:#538192;
			}


			.theme-hemisu-dark{
				--flow-code-pre-bg:#000000;
				--flow-code-lines-bg:#000000;
				--flow-code-pln:#EEEEEE;
				--flow-code-linenums-color:#777777;

				--flow-code-lines-padding-left:1em;
				--flow-code-linenums-margin-top:0;
				--flow-code-linenums-margin-bottom:0;

				--flow-code-str:#B1D631;
				--flow-code-kwd:#B1D631;
				--flow-code-com:#777777;
				--flow-code-typ:#BBFFAA;
				--flow-code-lit:#9FD3E6;
				--flow-code-pun:#EEEEEE;
				--flow-code-opn:#EEEEEE;
				--flow-code-clo:#EEEEEE;
				--flow-code-tag:#EEEEEE;
				--flow-code-atn:#B1D631;
				--flow-code-atv:#BBFFAA;
				--flow-code-dec:#EEEEEE;
				--flow-code-var:#EEEEEE;
				--flow-code-fun:#9FD3E6;
			}

			.theme-atelier-lakeside-dark{
				--flow-code-pre-bg:#161b1d;
				--flow-code-lines-bg:#161b1d;
				--flow-code-pln:#ebf8ff;
				--flow-code-linenums-color:#5a7b8c;

				--flow-code-lines-padding-left:1em;
				--flow-code-linenums-margin-top:0;
				--flow-code-linenums-margin-bottom:0;

				--flow-code-str:#568c3b;
				--flow-code-kwd:#6b6bb8;
				--flow-code-com:#6b6bb8;
				--flow-code-typ:#257fad;
				--flow-code-lit:#935c25;
				--flow-code-pun:#ebf8ff;
				--flow-code-opn:#ebf8ff;
				--flow-code-clo:#ebf8ff;
				--flow-code-tag:#d22d72;
				--flow-code-atn:#935c25;
				--flow-code-atv:#2d8f6f;
				--flow-code-dec:#935c25;
				--flow-code-var:#d22d72;
				--flow-code-fun:#257fad;
			}

			.theme-atelier-lakeside-light{
				--flow-code-pre-bg:#ebf8ff;
				--flow-code-lines-bg:#ebf8ff;
				--flow-code-pln:#161b1d;
				--flow-code-linenums-color:#7195a8;

				--flow-code-lines-padding-left:1em;
				--flow-code-linenums-margin-top:0;
				--flow-code-linenums-margin-bottom:0;

				--flow-code-str:#568c3b;
				--flow-code-kwd:#6b6bb8;
				--flow-code-com:#7195a8;
				--flow-code-typ:#257fad;
				--flow-code-lit:#935c25;
				--flow-code-pun:#161b1d;
				--flow-code-opn:#161b1d;
				--flow-code-clo:#161b1d;
				--flow-code-tag:#d22d72;
				--flow-code-atn:#935c25;
				--flow-code-atv:#2d8f6f;
				--flow-code-dec:#935c25;
				--flow-code-var:#d22d72;
				--flow-code-fun:#257fad;
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
			if(this.fixindent){
				v = v.split("\n");
				let count = 0;
				let line2 = v[0];
				let i=0;
				let c = line2[i++];
				let spaces = true;
				while(spaces) {
					if(c == "\t") {
						count++;
						i++;
						c = line2[i];
					} else if(/^    /.test(c)) {
						count++;
						i+=4;
						c = line2[i];
					} else 
						spaces = false;
				}
				// while(c == "\t"){
				// 	count++;
				// 	c = line2[i++];
				// }
				if(count>0){
					let regExp = `^[\t|    ]{1,${count}}`;
					regExp = new RegExp(regExp)
					v = v.map(v => {
						//console.log("v1", v)
						// why was this here? this [\t ]* is breaking code...
						v = v.replace(regExp, "")
						console.log("v2", v)
						return v;
					}).join("\n");
				}else{
					v = v.join("\n");
				}
			}
			this.innerHTML_ = v;
		}

		let theme = this.theme?' theme-'+this.theme:'';
		return html`<pre class="lang-${this.lang}${theme}">${this.innerHTML_}</pre>`
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
			//console.log("updating....")
			//this.update()
			pre.innerHTML = code;
		}

	}
}

FlowCode.define("flow-code");
