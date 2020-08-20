import {BaseElement, html, css, baseUrl} from './base-element.js';

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
			skipTrimming : { type : Boolean }
		}
	}

	static get styles() {
		return css`
			:host{display:block;}
			.md{display:none;}
		`;
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
    }

	render() {
		return html`<div class="md"><slot></slot></div><div id="output"></div>`;
	}
}


let defined = false;
let registerComponent =()=>{
	if(defined)
		return
	defined = true;
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
