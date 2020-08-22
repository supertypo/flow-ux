import {BaseElement, html, css, baseUrl, dpc} from './base-element.js';

export const markerdRenderer = {
	heading(text, level) {
		const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
			.replace(/\-code\-/g, "")

		return `
			<h${level} class="h-anchor">
			<a name="${escapedText}" class="anchor" href="#${escapedText}">
				<span class="anchor-icon" part="anchor-icon"></span>
			</a>
			${text}
			</h${level}>`;
	}
}

/**
* @class FlowMarkdown
* @extends BaseElement
* @property {String} [type]
* @example
*   <flow-markdown>fn()</flow-markdown>
*
*
*/

export class FlowMarkdown extends BaseElement {
	static get properties() {
		return {
			skipTrimming:{type:Boolean},
			anchorScroll:{type:Boolean}
		}
	}

	static get styles() {
		return css`
			:host{display:block;}
			.md{display:none;}
			.anchor{
				font-size:0px;
			}
			.anchor-icon{
				font-size:var(--flow-markdown-anchor-icon-font-size, 1rem);
				display:var(--flow-markdown-anchor-icon-display, inline-block);
				width:var(--flow-markdown-anchor-icon-width, 15px);
				height:var(--flow-markdown-anchor-icon-height, 15px);
				margin:var(--flow-markdown-anchor-icon-margin, 0px 2px);
				opacity:var(--flow-markdown-anchor-icon-opacity, 0);
				border:0px solid #F00;cursor:pointer;
				background: center / contain;
				background-image:var(--flow-markdown-icon);
			}
			.h-anchor:hover>a.anchor .anchor-icon{
				opacity:var(--flow-markdown-anchor-icon-opacity-hover, 1);
            }
            
            code, table tr td code {
                font-family: var(--flow-markdown-code-font-family, monospace);
                font-size: var(--flow-markdown-code-font-family, 1rem);
            }
		`;
	}
	render() {
		return html`<div class="md"><slot></slot></div><div 
			id="output" @click="${this.onOutputClick}"></div>`;
	}

	constructor() {
		super();
    }
    
    firstUpdated() {
    	// TODO https://github.com/markedjs/marked
        const slot = this.renderRoot.querySelector('slot');
        this.outputEl = this.renderRoot.querySelector('#output');
       	this.slotEl = slot;
       	this.updateHtml();
		slot.addEventListener('slotchange', e=>{
			this.updateHtml();
		});
    }

    updateHtml(text=""){
    	if(!text.length){
	    	let nodes = this.slotEl.assignedNodes();
	    	let texts = [];
	    	nodes.forEach(el=>{
	    		if(el.nodeType==3){
	    			texts.push(el.textContent)
	    			return;
	    		}
	    		texts.push(el.innerText);
	    	})
	    	text = texts.join("\n\n");
	    	let line2 = text.trim().split("\n")[1];
	    	this.log("line2line2", line2)
	    	if(!this.skipTrimming && line2){
	    		let num = 0;
	    		let i = 0;
	    		let c = line2[i];
	    		let regExp = null;
	    		this.log("cccc:"+c, c=="\t")
	    		if(c == "\t"){
	    			while(c == "\t"){
	    				num++;
	    				c = line2[i++];
	    			}
	    			regExp = `^[\t]{1,${num}}`;
    			}else if(c == " "){
    				while(c == " "){
	    				num++;
	    				c = line2[i++];
	    			}
	    			regExp = `^[ ]{1,${num}}`;
    			}

    			if(regExp){
    				//this.log("regExp:"+regExp)
	    			regExp = new RegExp(regExp, "g");
	    			
	    			text = text.split("\n").map(line=>{
	    				//this.log("first:"+line[0]+"::::", line)
	    				return line.replace(regExp, "")
	    			}).join("\n");

	    			//this.log("tabs", regExp, tabs, text)
    			}
	    	}
	    	
	    }
    	let html = window.marked(text);
    	this.outputEl.innerHTML =  DOMPurify.sanitize(html);
    	if(this.anchorScroll){
    		dpc(100, ()=>{
    			this.scrollToLocationHash();
    		})
    	}

    }
    scrollToLocationHash(){
    	let hash = window.location.hash.replace("#", "");
    	this.scrollToElement(hash)
    }
    scrollToElement(id){
    	let ele = id.scrollIntoView?id:this.outputEl.querySelector(`a[name="${id}"]`);
    	if(ele)
    		ele.scrollIntoView(Object.assign(this.scrollIntoViewConfig || {}, {
    			behavior: "smooth",
    			block: "start",
    			inline: "nearest"
    		}));
    }

    onOutputClick(e){
    	let anchor = e.target.closest("a.anchor,a.scroll-to");
    	if(!anchor)
    		return
    	let href = (anchor.getAttribute("href")+"")
    	if(href.startsWith("#"))
    		anchor = href.replace("#", "")

    	this.scrollToElement(anchor);
    }
}


let defined = false;
let registerComponent =()=>{
	if(defined)
		return
	defined = true;

	marked.use({renderer: markerdRenderer})

	FlowMarkdown.define('flow-markdown');
}

let check = ()=>{
	loaded++;
	if(loaded == 2)
		registerComponent();
}

let loaded = 0;

[
	'extern/marked/marked.min.js',
	'extern/dom-purify/purify.min.js'
].forEach(file=>{
	if(file.indexOf("marked/") > -1 && window.marked)
		return check();

	let s = document.createElement("script");
	s.src = `${baseUrl}resources/${file}`;
	document.head.appendChild(s);
	s.onload = ()=>{
		check();
	}
});
