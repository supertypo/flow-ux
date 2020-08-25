import {BaseElement, html, css, flow, dpc} from './base-element.js';
import {Flowd3Element} from './flow-d3.js';
import {FlowSampler} from './flow-sampler.js';
import {FlowFormat} from './flow-format.js';

/**
* @class FlowGraph
* @extends Flowd3Element
* @prop {Boolean} disabled
* @prop {String} title 
* @prop {String} prefix
* @prop {String} suffix
* @prop {String} align
* @prop {Number} value
* @prop {String} data
* @prop {String} sampler
* @prop {Number} range
* @prop {Boolean} overlay
* @prop {String} format
* @prop {Number} precision 
* @prop {Boolean} axes
* @prop {Boolean} info
* @cssvar {font-family} [--flow-data-field-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-data-field-font-weight=bold]
* @cssvar {background-color} [--flow-background-color]
* @cssvar {background} [--flow-graph-info-bg=#FFF);
* @cssvar {border} [--flow-graph-info-border=1px solid #DDD]
* @example
*   <flow-graph>overlay content</flow-graph>
*
*/
export class FlowGraph extends Flowd3Element {
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
			data:{type:String},  // sampler: 'kaspad.kd0.info.
			sampler:{type:String},
			//strokeColor:{type:String},
			//fill:{type:String},
			range:{type:Number},
			overlay:{type:Boolean},
			format:{type:String},
			precision:{type:Number},
			axes:{type:Boolean},
			info:{type:Boolean},
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
				font-family:var(--flow-data-field-font-family, "Julius Sans One");
				font-weight:var(--flow-data-field-font-weight, bold);
				border-radius: 10px;
				overflow: hidden;
				position:relative;
			}
			:host([disabled]){opacity:0.5;cursor:default;pointer-events:none;}
			.colon{display:none}
			:host(.has-colon) .colon{display:inline;}
			.container{
				white-space: nowrap;
		/*		border-radius: 10px;*/
				padding:2px 6px 6px 6px;
				height: 100%;
			}
			
			.container>div{padding:2px;}
			/* --- */
			.title{flex:1; text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-badge-caption); xtext-shadow: 0px 0px 0px var(--flow-data-badge-caption-shadow, #fff); }
			.value{text-align:right; opacity:1;font-size:14px;font-family:"Exo 2";font-weight:normal;
		background-color: var(--flow-background-color:);
			}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left;  }
			.row { display: flex; flex-direction: row; flex:0; }

			.wrapper {
				/*width:100%;height:100%;*/
				position:relative;
				flex:1;
				margin:6px;overflow:hidden;
				/*
				min-width: var(--flow-data-badge-graph-with,240px);
				min-height: var(--flow-data-badge-graph-height,80px);				
				*/				
			}
			
			:host([border]) .wrapper {
				border: 2px solid var(--flow-primary-color,#333);
				box-shadow: 2px 2px 1px rgba(1, 123, 104, 0.1);
				border-radius: 10px;

			}

			.wrapper > div {
				width:100%;height:100%;
				position:relative;left:0px;top:0px;bottom:0px;right:0px;
			}

			.d3-holder{
				min-height:10px;
				min-width:10px;
				opacity:1;
				border-radius:10px;
			}
			.wrapper>div.d3-holder{position:absolute;}
			.overlay{pointer-events:none}
			.info{
				position:absolute;pointer-events:none;
				background:var(--flow-graph-info-bg, #FFF);
				border:var(--flow-graph-info-border, 1px solid #DDD);
				padding:3px;font-size:0.7rem;left:10px;top:10px;
				opacity:0;max-width:48%;
			}
			.info-dot{opacity:0}
			[flex] {
				flex: 1;
			}


			.axis {
				font-size:12px;
				font-family: "Consolas", "Source Sans Pro";
				font-weight: 300;
				strokeColor: #333;
			}

			.axis text {
				fill:var(--flow-background-inverse-soft, #aaa);
			}
			.axis path {
				stroke:var(--flow-background-inverse-soft, #aaa);
			}
			.axis line {
				stroke:var(--flow-background-inverse-soft, #aaa);
			}

			.value-container {
				/*background-color: var(--flow-background-color, rgba(0,0,0,0));*/
				display:flex;
				flex-direction:row;
			}

			.title-bottom { display: none; }
			.host([bottom])	.title-bottom { display: block; }
			.host([bottom])	.title-top { display: none; }
			.host([top])	.title-bottom { display: none; }
			.host([top])	.title-top { display: block; }
		`];
	}

	constructor() {
		super();
		this.sampler = '';
		this.range = 60 * 5;
		this.refresh = 1e3;
		this.precision = 0;
		this.axes = false;
		this.info = false;

		this.svgPreserveAspectRatio = 'xMaxYMax meet';
	}

	onElementResize(){
		super.onElementResize();
		dpc(()=>{
			this.requestUpdate();
		})
	}

	connectedCallback() {
		super.connectedCallback();
		if(this.sampler)
			this.interval = setInterval(this.requestUpdate.bind(this), this.refresh);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if(this.interval)
			clearInterval(this.interval);
	}

	render() {

		dpc(()=>{
			this.draw();
		})

		let value = '';
		//this.log("render flow-graph");
		if(this.sampler) {
			let idents = this.sampler.split(':');
			let ident = idents.shift(); 
			let sampler =  FlowSampler.get(ident);
			value = sampler.last() || '';
			if(value !== undefined) { 
				value = FlowFormat[this.format || 'default'](value || 0, this);
			}
		}
		else {
			console.log("no sampler", this);
		}


		if(this.overlay) {
			return html`
			<div class='wrapper'>
				<div class="d3-holder">${super.render()}</div>
				<div class="overlay">
					<div class="container col">
						<!-- div class="title title-top">${this.title}<span class="colon">:</span></div -->
						<div class="row">
							<div class="title title-top">${this.title}<span class="colon">:</span></div>
							${ (!this.align || this.align == 'right') ? html`<div style="flex:1;"></div>` : '' }
							<div class="value-container">
								<div class="prefix">${this.prefix}</div>
								<div class="value">${value}</div>
								<div class="suffix">${this.suffix}</div>
							</div>
							${ (this.align == 'left') ? html`<div style="flex:1;"></div>` : '' }
						</div>
						<div flex></div>
						<!-- div class="row">
							<div class="title title-bottom">${this.title}<span class="colon">:</span></div>
							${ (!this.align || this.align == 'right') ? html`<div style="flex:1;"></div>` : '' }
							<div class="value-container">
								<div class="prefix">${this.prefix}</div>
								<div class="value">${value}</div>
								<div class="suffix">${this.suffix}</div>
							</div>
							${ (this.align == 'left') ? html`<div style="flex:1;"></div>` : '' }
						</div -->
					</div>
				</div>
			</div>
			<div class="info"></div>
			`;	
		} else {

			return html`
			<div class='wrapper'>
				<div class="d3-holder">${super.render()}</div>
				<div>
					<div class="container col">
						<slot></slot>
					</div>
				</div>
			</div>
			<div class="info"></div>
			`;	
		}
	}

	getMargin(){
		if(this.axes){
			return {
				bottom:40,
				top:30,
				left:20,
				right:20
			}
		}
		return {
			bottom:0,
			top:10,
			left:0,
			right:0
		}
	}
	draw(){
		let margin = this.getMargin();
		let {height:fullHeight, width:fullWidth} = this.el_d3.getBoundingClientRect();
		let width = fullWidth - margin.left - margin.right;
    	let height = fullHeight - margin.top - margin.bottom;

		if(!this.sampler)
			return;
		let samplerIdents = this.sampler.split(':');
		
		let samplers = samplerIdents.map((ident) => {
			let sampler =  FlowSampler.get(ident);
			if(!this._draw){
				this._draw = this.draw.bind(this);
				sampler.on('data', this._draw);
			}
			return sampler;
		})
		
		let data = samplers[0].data;

		//console.log(JSON.stringify(data, null))
		let [min,max] = d3.extent(data, d => d.date);
		//console.log("processing min-max[1]",min,max);
		if(!this.axes)
			min = max - 1000*this.range;
		let maxTextLength = 0;
		data.forEach(d=>{
			if(d.value.toFixed(this.precision).length>maxTextLength)
				maxTextLength = d.value.toFixed(this.precision).length;
		})

		if(this.axes && margin.left < maxTextLength * 10){
			let oldLeft = margin.left
			margin.left = maxTextLength * 10;
			width += oldLeft - margin.left;
		}


		const x = d3.scaleUtc()
		.domain([min, max])
		.range([0, width])

		const y = d3.scaleLinear()
		.domain(d3.extent(data, d => d.value)).nice()
		.range([height, 0]);

		let xAxis, yAxis;
		if(this.axes){
			xAxis = g => g
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

			yAxis = g => g
			//.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(height / 20).tickSizeOuter(0))
			//.call(g => g.select(".domain").remove())
		}
		
		// .call(g => g.select(".tick:last-of-type text").clone()
		// 	.attr("x", 3)
		// 	.attr("text-anchor", "start")
		// 	.attr("font-weight", "bold")
		// 	.text(this.title));

		const area = d3.area()
			.curve(d3.curveLinear)
			.x(d => x(d.date))
			.y0(height)
			.y1(d => y(d.value));

		const { el } = this;
		// el.append('path')
		// 	.datum(data)
		// 	.attr('fill','var(--flow-graph-fill, steelblue)')
		// 	.attr('stroke','var(--flow-graph-stroke, steelblue)')
		// 	.attr('d',area);
		let t = `translate(${margin.left},${margin.top})`;
		if(el.__t != t){
			el.__t = t
			el.attr("transform", t)
		}

		if(this.svg.__w != fullWidth){
			this.svg.__w = fullWidth;
			this.svg
				.attr("width", fullWidth)
		}
		if(this.svg.__h != fullHeight){
			this.svg.__h = fullHeight;
			this.svg
				.attr("height", fullHeight)
		}
			

		if(!this.path)
			this.path = el.append('path')
				.attr('stroke-opacity', 'var(--flow-graph-stroke-opacity, 1.0)')
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 'var(--flow-graph-stroke-width, 0)')
				.attr('fill','var(--flow-graph-fill, steelblue)')
				.attr('stroke','var(--flow-graph-stroke, "#000)')

		try {				
			this.path.datum(data)
				.attr('d', area);
		} catch(ex) {
			if(this.sampler)
				console.log('error while processing sampler:',this.sampler);
			console.log(ex);

		}

		if(this.info){
			let me = this;
			let bisect = d3.bisector(d=>d.date).left;
			//let _data = data.map(d=>d.date.getTime());
			let timeFormat = d3.timeFormat("%x %X");
			this.getDataByPoint = (p)=>{
				let x0 = x.invert(p-margin.left);
				/*let t = x0.getTime();
				let dif = -1, _dif, index=-1;
				_data.forEach((ts, i)=>{
					_dif = Math.abs(ts-t)
					if(dif<0 || dif>_dif){
						index = i;
						dif = _dif
					}
				})
				//console.log("index", index, x0, p)*/
				let index = bisect(data, x0);
				let d = data[index];
				if(!d)
					return
				let cx = x(d.date);
				let cy = y(d.value);
				let l = null;
				let r = null;
				if(cx>width*0.5){
					r = width-cx+margin.right+12;
				}else{
					l = cx+12+margin.left
				}
				return {cx, cy, d, l, r, t:cy+12+margin.top};
			}
			if(!this.infoEl){
				this._infoEl = this._infoEl||this.renderRoot.querySelector('.info')
				this.infoEl = d3.select(this._infoEl);
				this.infoDot = el.append("circle")
					.attr("class", "info-dot")
			        .attr("fill", "var(--flow-graph-info-dot-fill, red)")
			        .attr("stroke", "var(--flow-graph-info-dot-stroke, none)")
			        .attr("r", 3)
				this.svg 
					.on('mousemove', function(_d){
						let p = d3.mouse(this)[0];
					    let data = me.getDataByPoint(p);
						//console.log("ddd", d.value, x0)
						if(!data)
							return
						let {cx, cy, l, r, t, d} = data;
						let infoEl = me.infoEl;
						infoEl
							.html(FlowFormat[me.format||'default'](d.value, me)+", "+timeFormat(d.date))
		     				.style("top", t+"px")
		     			if(l){
		     				infoEl.style("right", 'initial')
		     				infoEl.style("left", l+"px")
		     			}else{
		     				infoEl.style("right", r+"px")
		     				infoEl.style("left", 'initial')
		     			}
						infoEl.transition()
							.duration(50)
							.style("opacity", 1)
						me.infoDot
							.style("opacity", 1)
							.attr("cx", cx)
			        		.attr("cy", cy)
					})
					.on('mouseout', ()=>{
						this.infoDot.style("opacity", 0);
						this.infoEl.transition()
							.duration(50)
							.style("opacity", 0);
					});
			}
		}


		if(this.axes){
			this.xAxis = this.xAxis || el.append("g")
			this.xAxis.call(xAxis);
			this.yAxis = this.yAxis || el.append("g")
			this.yAxis.call(yAxis);

			this.xAxis.classed('axis', true);
			this.yAxis.classed('axis', true);
		}

	}
}

FlowGraph.define('flow-graph');
