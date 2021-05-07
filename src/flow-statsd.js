import {BaseElement, svg, html, css, baseUrl} from './base-element.js';
import { dpc } from './helpers.js';


// /**
// * @class FlowQRCode
// * @extends BaseElement
// * @property {String} [for]
// * @property {String} [type]
// * @example
// *   <flow-qrcode></flow-qrcode>
// *
// */

export class FlowStatsD extends BaseElement {
	static get properties(){
        return {
        
            target:{type:String},
            from:{type:String},
            prefix:{type:String}
        }
            
    }
	static get styles() {
		return css`
			:host {
				display : block;
                width:100%;
                height:100%;

			}
			
			:host(.left-img) img{
				object-position:left;
			}
            img {
                width:100%;
                height: 100%
            }
		`;
	}

	constructor() {
		super();

		
	}

    onElementResize(){
    	this.rect = this.getBoundingClientRect();
        //console.log("RECT:", this.rect);
        this.requestUpdate();
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
        this.interval = setInterval(this.requestUpdate.bind(this),1000);
    }

    disconnectedCallback(){
        super.disconnectedCallback();
        clearInterval(this.interval);
    }

	render() {
        const time = Date.now();
        this.prefix = "stats.gauges."
        const rect = this.rect || {width:64,height:64};
        const {width, height} = rect;

        const searchParams = new URLSearchParams();
        searchParams.set("width", width || 64);
        searchParams.set("height", height || 64);
        searchParams.set("areaMode", "all");
        searchParams.set("from", "-30minutes");
        searchParams.set("areaAlpha", "0.5");
        let targets = this.target.split("|");
        targets.forEach(target=>{
            target = this.prefix+target;
            searchParams.append("target",target);

        })
        //searchParams.set("target", this.target);
        searchParams.set("hideLegend", false);
        searchParams.set("salt", time);
        const url = "http://192.168.1.168/render/?"+searchParams.toString();



        // const queryString = "http://192.168.1.168/render/?
        // showTarget=stats.gauges.market.ETHBTC.orders_per_sec&
        // showTarget=stats.gauges.a.b.c&
        // showTarget=stats.gauges.statsd.timestamp_lag
        // &width=586&
        // height=308&
        // from=-1minutes&
        // areaMode=all&
        // target=stats.gauges.generic.market.sys_mem_used&
        // _salt=1620078647.885";
		return html`<img style="width:${width}px;height:${height}px" src="${url}">`
	}

	

}

FlowStatsD.define('flow-statsd');

//http://192.168.1.168/render/?showTarget=stats.gauges.market.ETHBTC.orders_per_sec&showTarget=stats.gauges.a.b.c&showTarget=stats.gauges.statsd.timestamp_lag&width=586&height=308&from=-1minutes&areaMode=all&target=stats.gauges.generic.market.sys_mem_used&_salt=1620078647.885