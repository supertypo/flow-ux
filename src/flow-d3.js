import {BaseElement, html, css} from './base-element.js';

export class Flowd3Element extends BaseElement {
	static get properties() {
		return {
		};
	}

	static get styles(){
		return css `
			:host {
				min-height:100px;
				min-width:100px;
				display:flex;
				flex-direction:column;
				box-sizing:border-box;
				position:relative;
				user-select: none;        
			}
			:host([hidden]) { display: none;}
            
            #d3 {
				flex:1;
				height:100%;
			}
		`;
	}
	constructor() {
		super();
	}

    render() {
		return html`<div id="d3"></div>`;
	}

    firstUpdated() {
		this.el_d3 = this.renderRoot.getElementById('d3');
		let getBoundingClientRect = this.el_d3.getBoundingClientRect;
		let el_d3Rect = getBoundingClientRect.call(this.el_d3);
		this.el_d3.getBoundingClientRect = ()=>{
			return el_d3Rect;
		}
	
		window.addEventListener("resize", ()=>{
			el_d3Rect = getBoundingClientRect.call(this.el_d3);
		})
    
        this.init_d3();
    }
   
    
    init_d3() {
		this.svg = d3.select(this.el_d3).append("svg");
    	this.el = this.svg.append("g")
    	this.el.transform = d3.zoomIdentity.translate(0, 0).scale(1);
		this.updateSVGSize();

		window.addEventListener("resize", this.updateSVGSize.bind(this))
		this.fire("ready", {})
    }

	updateSVGSize(){
		const { width, height } = this.el_d3.getBoundingClientRect();
		this.svg.attr("viewBox", [
			-width / 2,
			-height / 2, 
			width,
			height
		]);
	}

}