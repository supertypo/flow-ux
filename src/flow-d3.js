import {BaseElement, html, css} from './base-element.js';

export class Flowd3Element extends BaseElement {
	static get properties() {
		return {
		};
	}

	static get styles(){
		return css `
			
			:host([hidden]){display:none;}
			.d3-holder{
				min-height:100px;
				min-width:100px;
				display:flex;
				flex-direction:column;
				box-sizing:border-box;
				position:relative;
				user-select: none;      
			}
            
            #d3 {flex:1;overflow:hidden}
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
		this.el_d3Rect = this.getBoundingClientRect.call(this.el_d3);
		this.el_d3.getBoundingClientRect = ()=>{
			if(this.el_d3Rect.width==0 && this.el_d3Rect.height==0)
				this.el_d3Rect = this.getBoundingClientRect.call(this.el_d3);
			return this.el_d3Rect;
		}
	
    
        this.init_d3();
    }
   
    
    init_d3() {
		this.svg = d3.select(this.el_d3).append("svg");
		//this.svg.attr("viewBox", this.svgViewBox || [0,0,1,1]);
		this.svg.attr("width", this.svgWidth || '100%');
		this.svg.attr("height", this.svgHeight || '100%');
		this.svg.attr('preserveAspectRatio', this.svgPreserveAspectRatio || 'xMidYMid meet');
    	this.el = this.svg.append("g")
    	this.el.transform = d3.zoomIdentity.translate(0, 0).scale(1);
		this.updateSVGSize();
		//setTimeout(()=>{
		//	this.updateSVGSize();
		//}, 100)

		this.fire("ready", {})
    }

    onElementResize(){
    	if(this.el_d3)
    		this.el_d3Rect = this.getBoundingClientRect.call(this.el_d3);
		this.updateSVGSize();
    }

    connectedCallback(){
    	super.connectedCallback();
    	//this._onWindowResize = this._onWindowResize || this.onWindowResize.bind(this);
		//window.addEventListener("resize", this._onWindowResize)
		if(!this.__resizeObserver){
    		this.__resizeObserver = new ResizeObserver(()=>{
	    		this.onElementResize();
			});
			this.__resizeObserver.observe(this);
	    }
    }

    disconnectedCallback() {
		super.disconnectedCallback();
		//if(this._onWindowResize)
		//	window.removeEventListener("resize", this._onWindowResize)
		if(this.__resizeObserver){
			this.__resizeObserver.unobserve(this);
			this.__resizeObserver.disconnect();
			delete this.__resizeObserver;
		}
	}

    updateSVGSize(){
    	if(!this.el_d3)
    		return
    	let {width, height} = this.el_d3.getBoundingClientRect();
    	this.svg.attr("viewBox", this.svgViewBox || [0,0, width, height]);
    	this.draw();
    }

    draw(){
    	//
    }
}