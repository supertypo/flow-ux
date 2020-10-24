import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowRSS
* @extends BaseElement

* @property {String} [href]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]

* @example
*   <flow-rss href=""></flow-app-drawer>
*
*/
export class FlowRSS extends BaseElement {
	static get properties() {
		return {
			href:{type:String},
			enablePictures:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{display:block;}
			img{max-width:100%;height:auto;}
			a{
				color: var(--flow-link-color, #017b68);
			}

			a:hover {
				color: var(--flow-link-hover-color, #017b68);
			}
		`;
    }
	render() {
		return html`${this.href} ${this.body}`;
	}
	updated(changes){
		if((changes.has("href") || changes.has("enablePictures")) && this.href)
			this.fetch(this.href);
	}
	fetch(href){
		let opts = {method:"GET", mode:"cors", referrerPolicy: 'no-referrer'};
		return fetch(href, Object.assign(opts, this.feedOpt||{}))
	}
	
	setFeedData(data){
		//this.feedData = data;
		data = new window.DOMParser().parseFromString(data, "text/xml")
		this.buildBody(data);
		this.requestUpdate("body", null);
	}
	buildBody(xmlEl){
		let items = [...xmlEl.querySelectorAll("item")]
		this.body = html`
		${items.map(el=>{
			let link = el.querySelector("link");
			let dsc = el.querySelector("description")||"";
			if(dsc){
				if(dsc.childNodes[0]?.nodeName=="#cdata-section"){
					//console.log("dsc", dsc, dsc.childNodes[0].nodeValue)
					dsc = dsc.childNodes[0].nodeValue;
				}
				else
					dsc = dsc.innerHTML
			}
			return html`
			<article>
	          <img src="${link.innerHTML}/image/large.png" alt="">
	          <h2>
	            <flow-link href="${link.innerHTML}" target="_blank" rel="noopener">
	              ${el.querySelector("title").innerHTML}
	            </flow-link>
	          </h2>
	          ${this.buildNode(dsc)}
	        </article>`
        })}
		`
	}
	buildNode(htmlContent){
		this._tpl = this._tpl || document.createElement("template");
		this._tpl.innerHTML = `<div>${htmlContent}</div>`;
		let node = this._tpl.content.firstChild;
		//console.log("htmlContent", htmlContent, this._tpl.innerHTML, node)
		node.querySelectorAll("script"+(this.enablePictures?"":",img")).forEach(el=>{
			console.log("fetchFeed:script,img:el", el)
			el.remove();
		})
		return node;
	}
}

FlowRSS.define('flow-rss');
