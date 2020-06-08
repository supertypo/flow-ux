import {BaseElement, html, css, dpc} from './base-element.js';
import {Flowd3Element} from './flow-d3.js';
import {FlowSampler} from './flow-sampler.js';

/**
* @class FlowDataBadgeGraph
* @extends Flowd3Element
* @example
*   <flow-data-badge-canvas title="text">value</flow-data-badge-canvas>
*
*/
export class FlowDataBadgeGraph extends Flowd3Element {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect:true},
			title:{type:String},
			prefix : { type : String },
			suffix:{type:String},
			align:{type:String},
			//lineColor:{type:String},
			//fillColor:{type:String},	
			value:{type:Number},
			sampler:{type:String},  // sampler: 'kaspad.kd0.info.
			type:{type:String},
			
			//strokeColor:{type:String},
			//fill:{type:String},
			range:{type:Number},
		}
	}

	static get styles(){
		return [Flowd3Element.styles, css`
			:host{
				display:inline-flex;
				font-weight:bold;
				font-size:13px;
				text-transform:uppercase;
				cursor:pointer;
				font-family:var(--flow-data-badge-font-family, "Julius Sans One");
				font-weight:var(--flow-data-badge-font-weight, bold);
				border-radius: 10px;
				overflow: hidden;

				/*width:300px;height:300px;*/
			}
			:host([disabled]){opacity:0.5;cursor:default;pointer-events:none;}
			.colon{display:none}
			:host(.has-colon) .colon{display:inline;}

			:host([.large]) { 
			}

			.container{
				white-space: nowrap;
				xdisplay:flex;xflex-firection:column;xalign-items:center;
				padding:2px 6px;
				/*min-height: inherit;*/
			}
			.container>div{padding:2px;}
			.title{flex:1; text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-badge-caption); xtext-shadow: 0px 0px 0px var(--flow-data-badge-caption-shadow, #fff); }
			.value{text-align:right; opacity:1;font-size:14px;font-family:"Exo 2";font-weight:normal;}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left;  }
			.row { display: flex; flex-direction: row; flex:0; color: var(--flow-data-field-value,#333); }


			.wrapper {
				/*width:100%;height:100%;*/
				position:relative;
				flex:1;
				margin:6px;overflow:hidden;
				border: 2px solid var(--flow-primary-color,#333);
				box-shadow: 2px 2px 1px rgba(1, 123, 104, 0.1);
				border-radius: 10px;
				/*
				min-width: var(--flow-data-badge-graph-with,240px);
				min-height: var(--flow-data-badge-graph-height,80px);				
				*/				
			}
			.wrapper > div {
				width:100%;height:100%;
				position:relative;left:0px;top:0px;bottom:0px;right:0px;
				/*display: flex;
				flex-direction: column;*/
				/*min-height: inherit;*/
			}

			.d3-holder{
				min-height:10px;
				min-width:10px;
				opacity:1;
				border-radius:10px;
				/*border: 1px solid red;*/
				/*margin: 0px -5px 0px -1px;
				z-index: 100;*/
			}

			.wrapper>div.d3-holder{position:absolute;}

		`];
	}

	constructor() {
		super();
		this.range = 60 * 5;
		this.refresh = 1e3;
		//this.svgViewBox = [-1, 0, 100, 50]
		//this.svgPreserveAspectRatio = 'xMidYMid meet';
		this.svgPreserveAspectRatio = 'xMaxYMax meet';
	}

	connectedCallback() {
		super.connectedCallback();
		if(this.sampler)
			this.interval = setInterval(this.draw.bind(this), this.refresh);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if(this.interval)
			clearInterval(this.interval);
		if(this._draw){
			let sampler = FlowSampler.get(this.sampler || 'test-sampler');
			sampler.off('data', this._draw);
			this._draw = null;
		}
	}

	onElementResize(){
		super.onElementResize();
		dpc(()=>{
			this.draw();
		})
	}

	render() {

		dpc(()=>{
			this.draw();
		})

		return html
		`
		<div class='wrapper'>
			<div class="d3-holder">${super.render()}</div>
			<div>
				<div class="container col">
					<div class="title">${this.title}<span class="colon">:</span></div>
					<div class="row">
						${ (!this.align || this.align == 'right') ? html`<div style="flex:1;"></div>` : '' }
						<div class="prefix">${this.prefix}</div>
						<div class="value"><slot></slot></div>
						<div class="suffix">${this.suffix}</div>
						${ (this.align == 'left') ? html`<div style="flex:1;"></div>` : '' }
					</div>
				</div>
			</div>
		</div>
		`;	
	}

	getMargin(){
		return {
			bottom:0,
			top:0,
			left:0,
			right:0
		}
	}


	draw(){
		let margin = this.getMargin();
		let {height, width} = this.el_d3.getBoundingClientRect();

        if(!this.sampler)
			return;

        let sampler = FlowSampler.get(this.sampler || 'test-sampler');
		if(!this._draw){
			this._draw = this.draw.bind(this);
			sampler.on('data', this._draw);
		}

        const { data } = sampler;
		let [min,max] = d3.extent(data, d => d.date);
		//console.log("processing min-max[1]",min,max);
		min = max - 1000*this.range;//@anton why we are extending this min?


		const x = d3.scaleUtc()
		.domain([min,max])
		//.domain(d3.extent(data, d => d.date))//.nice()
		.range([margin.left, width - margin.right])
		


		const y = d3.scaleLinear()
//		.domain([min,max])//.nice()
		.domain(d3.extent(data, d => d.value))//.nice()
//		.domain([0, d3.max(data, d => d.value)]).nice()
		.range([height - margin.bottom, margin.top]);
		/*
		const xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		//.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

		const yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y))
		.call(g => g.select(".domain").remove())
		// .call(g => g.select(".tick:last-of-type text").clone()
		// 	.attr("x", 3)
		// 	.attr("text-anchor", "start")
		// 	.attr("font-weight", "bold")
		// 	.text(this.title));
		*/

		const area = d3.area()
			.curve(d3.curveLinear)
			.x(d => x(d.date))
			.y0(y(0))
			.y1(d => y(d.value));

		const { el } = this;

		if(!this.path)
			this.path = el.append('path')
				.attr("transform", `translate(${margin.left},0)`)
				.attr('stroke-opacity', 'var(--flow-data-badge-graph-stroke-opacity, 1.0)')
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 'var(--flow-data-badge-graph-stroke-width, 0)')
				.attr('fill','var(--flow-data-badge-graph-fill, steelblue)')
                .attr('stroke','var(--flow-data-badge-graph-stroke, #000)')
                
				
		this.path.datum(data)
			.attr('d',area);

		/*
		el.append("g")
			.call(xAxis);
  
		el.append("g")
			.call(yAxis);
		*/

	}
}

//FlowDataBadgeGraph.define('flow-data-badge-graph');
FlowDataBadgeGraph.define('flow-data-badge-graph');
