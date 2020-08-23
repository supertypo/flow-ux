import {BaseElement, html, css, baseUrl, dpc} from './base-element.js';
import { FlowCode } from './flow-code.js';

const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/&amp;lt;/g, "&lt;")
         .replace(/&amp;gt;/g, "&gt;")
 }

export const markerdRenderer = {
    buildAnchorHref(text){
        return text.toLowerCase().replace(/[^\w]+/g, '-')
            .replace(/\-code\-/g, "")
    },
	heading(text, level) {
		const href = this.buildAnchorHref(text);

		return `
			<h${level} class="h-anchor">
			<a name="${href}" class="anchor" href="#${href}">
				<span class="anchor-icon" part="anchor-icon"></span>
			</a>
			${text}
			</h${level}>`;
    },
    
    code(text, info, escaped) {
        console.log('code:',text);
        return `<flow-code lang="${info}"><textarea>${text.replace(/\t/g,'    ')}</textarea></flow-code>`;
    },

    html(text) {
        console.log('html:',text);
        return escapeHtml(text);
    },

    codespan(text) {
        console.log('codespan:',text);
        text = text.replace(/&amp;lt;/g, "&lt;").replace(/&amp;gt;/g, "&gt;");
        return `<code>${text}</code>`;
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
            anchorScroll:{type:Boolean},
            sanitize : {type:Boolean},
            toc :{type:Boolean},
            'full-height-toc':{type:Boolean, reflect:true}
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
            
            #output > * {
                margin-left: 19px;
            }

            #output > h1, #output > h2, #output > h3, #output > h4, #output > h5 {
                margin-left: 0px;
            }

            td { vertical-align: top; }

            code, table tbody tr td code {
                display: inline-block;
                font-family: var(--flow-markdown-code-font-family, monospace);
                font-size: var(--flow-markdown-code-font-size, 1rem);
                background-color: var(--flow-markdown-code-background-color, #f3f3f3);
                padding: var(--flow-markdown-code-padding, 1px 3px);
                margin: var(--flow-markdown-code-margin, 1px 1px);
                border:var(--flow-markdown-code-border, 1px solid #ddd);
            }

            flow-code {

                --flow-code-white-space: pre;
                --flow-code-font-family: var(--flow-markdown-code-font-family);
                --flow-code-font-size: var(--flow-markdown-code-font-size);
                --flow-code-border: 1px solid #ddd;
                background-color: var(--flow-markdown-code-background-color, #f3f3f3);
                padding: 16px;
            }

            a, a:visited { 
                text-decoration: none; 
                color: var(--flow-link-color, #202169);
            }

            a:hover { 
                text-decoration: underline; 
                color: var(--flow-link-hover-color, #161649);
            }
            #wrapper {
                position:relative;
                display: flex;
                flex-direction:row;
            }
            :host([full-height-toc]) #wrapper{
                height:100%;
            }
            :host([full-height-toc]) .toc-outer,
            :host([full-height-toc]) #output{
                height:100%;
                overflow:auto;
            }
            :host([full-height-toc]) .toc-outer{
                min-width:var(--flow-markdown-toc-width, 200px);
            }
            #toc {
                border:0px solid red;
                width:var(--flow-markdown-toc-width, 200px);
                position: -webkit-sticky;
                position: sticky;
                top:var(--flow-markdown-toc-top, 0);
                list-style:none;
                padding:var(--flow-markdown-toc-padding, 10px);
                margin:0px;
            }
            :host([full-height-toc]) #toc{
                position:relative;
            }
            #toc li{cursor:pointer}
            #toc li:hover{
                background-color:var(--flow-markdown-toc-li-hover-bg, var(--flow-menu-item-hover-bg, #DDD));
                color:var(--flow-markdown-toc-li-hover-color, var(--flow-menu-item-hover-color, #000));
            }
            #toc [level="0"]{
                padding-left:var(--flow-markdown-toc-level0-padding, 0px);
                font-size:var(--flow-markdown-toc-level0-font-size, 0.96rem);
                font-weight:var(--flow-markdown-toc-level0-font-weight, bold);
            }
            #toc [level="1"]{
                padding-left:var(--flow-markdown-toc-level1-padding, 0px);
                font-size:var(--flow-markdown-toc-level1-font-size, 0.92rem);
            }
            #toc [level="2"]{
                padding-left:var(--flow-markdown-toc-level2-padding, 15px);
                font-size:var(--flow-markdown-toc-level2-font-size, 0.86rem);
            }
            #toc [level="3"]{
                padding-left:var(--flow-markdown-toc-level3-padding, 30px);
                font-size:var(--flow-markdown-toc-level3-font-size, 0.5rem);
            }
            #toc [level="4"]{
                padding-left:var(--flow-markdown-toc-level4-padding, 45px);
                font-size:var(--flow-markdown-toc-level4-font-size, 0.4rem);
            }
            #toc [level="5"]{
                padding-left:var(--flow-markdown-toc-level5-padding, 60px);
                font-size:var(--flow-markdown-toc-level5-font-size, 0.3rem);
            }
            #toc [level="6"]{
                padding-left:var(--flow-markdown-toc-level6-padding, 75px);
                font-size:var(--flow-markdown-toc-level6-font-size, 0.2rem);
            }
            #toc [level="7"]{
                padding-left:var(--flow-markdown-toc-level7-padding, 90px);
                font-size:var(--flow-markdown-toc-level7-font-size, 0.625rem);
            }
		`;
	}
	render() {
        let i = 1;
        let {level:firstLevel=0} = (this.toc_||[])[0]||{};
        let length = 10, num;
        (this.toc_||[]).forEach(o=>{
            if(length<o.level)
                length = o.level;
        })
        length = (length+"").length;

		return html`<div id="wrapper">
        ${
            this.toc ? 
            html`<div class="toc-outer"><ul id='toc' @click="${this.onTOCClick}">${
                this.toc_.map(t=> {
                    /*if(firstLevel == t.level){
                        num = (i++)+").";
                    }else{
                        num = "";
                    }*/
                    /*<span>${num.padStart(length, " ")}</span>*/
                    return html`<li level="${t.level}" 
                        data-scroll-to="${t.href}">${t.caption}</li>`;
                })
            }</ul></div>`:''
        }
        <div class="md"><slot></slot></div>
        <div id="output" @click="${this.onOutputClick}"></div>
        </div>`;
	}

	constructor() {
        super();
        this.sanitize = false;
        this.toc = false;
        this.toc_ = [];
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
	    		texts.push(el.innerHTML);
	    		//texts.push(el.innerText);
	    	})
            text = texts.join("\n\n");
            /*
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
	    	*/
        }

        const tokens = window.marked.lexer(text);
        this.log("tokens", tokens);

        if(this.toc) {
            /*
            text.split('\n').forEach((line) => {
                if(/^#+/.test(line)) {
                    let level = -1;
                    while(line.charAt(0) == '#') {
                        level++;
                        line = line.substring(1);
                    }
                    let caption = line.trim().replace("")
                    this.toc_.push({
                        caption, level, 
                        href: markerdRenderer.buildAnchorHref(caption)
                    });
                }
            })
            */
        
            let tocList = tokens.filter(t=>t.type=="heading").map(t=>{
                let caption = t.tokens[0].text;
                return {
                    caption,
                    level:t.depth-1,
                    href: markerdRenderer.buildAnchorHref(caption)
                }
            });

            this.toc_ = tocList;

            this.log("tocList", tocList);

            this.requestUpdate();
        }

        const html = window.marked.parser(tokens);
        this.log("html", html);

    	//let html = window.marked(text);
        //this.log("this.toc_", this.toc, this.toc_, html)
    	//let html = window.marked(text);
    	this.outputEl.innerHTML =  this.sanitize ? DOMPurify.sanitize(html) : html;
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
    	if(ele){
            let eleP = ele.parentNode?.matches(".h-anchor")?ele.parentNode:ele;
            //this.log("eleP", eleP)
    		eleP.scrollIntoView(Object.assign(this.scrollIntoViewConfig || {}, {
    			behavior: "smooth",
    			block: "start",
    			inline: "nearest"
    		}));
        }

    }

    onTOCClick(e){
        let el = e.target.closest("li[data-scroll-to]");
        if(!el)
            return

        let id = el.getAttribute("data-scroll-to");
        this.scrollToElement(id);
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
