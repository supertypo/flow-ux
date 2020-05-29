import {BaseElement, html, css, dpc} from './base-element.js';
import {Flowd3Element} from './flow-d3.js';
import {FlowSampler} from './flow-graph.js';

/**
* @class FlowDataBadge
* @extends BaseElement
* @example
*   <flow-data-badge title="text">value</flow-data-badge>
* @property {Boolean} [disabled] 
* @property {String} [title] 
* @property {String} [prefix] 
* @property {String} [suffix] 
* @property {String} [align] 
* @cssvar {font-family} [--flow-data-badge-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-data-badge-font-weight=bold]
* @cssvar {border} [--flow-primary-color=#333]
*/
export class FlowDataBadge extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect:true},
			title:{type:String},
			prefix : { type : String },
			suffix:{type:String},
			align:{type:String}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-weight:bold;
				font-size:13px;
				text-transform:uppercase;
				cursor:pointer;
				font-family:var(--flow-data-badge-font-family, "Julius Sans One");
				font-weight:var(--flow-data-badge-font-weight, bold);
			}
			:host([disabled]){opacity:0.5;cursor:default;pointer-events:none;}
			.colon{display:none}
			:host(.has-colon) .colon{display:inline;}
			.container{
				white-space: nowrap;
				border: 2px solid var(--flow-primary-color,#333);
				xdisplay:flex;xflex-firection:column;xalign-items:center;padding:2px 6px;
				margin: 6px;
				box-shadow: 2px 2px 1px rgba(1, 123, 104, 0.1);
				border-radius: 10px;

			}
			.container>div{padding:2px;}
			.title{text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-badge-caption); xtext-shadow: 0px 0px 0px var(--flow-data-badge-caption-shadow, #fff); }
			.value{text-align:right; opacity:1;font-size:14px;font-family:"Exo 2";font-weight:normal;}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left; }
			.row { display: flex; flex-direction: row; }
		`;
	}

	render() {
		return html
		`<div class="container col">
			<div class="title">${this.title}<span class="colon">:</span></div>
			<div class="row">
				${ (!this.align || this.align == 'right') ? html`<div style="flex:1;"></div>` : '' }
				<div class="prefix">${this.prefix}</div>
				<div class="value"><slot></slot></div>
				<div class="suffix">${this.suffix}</div>
				${ (this.align == 'left') ? html`<div style="flex:1;"></div>` : '' }
			</div>
		</div>`;	
	}
}

//FlowDataBadge.define('flow-data-badge');
FlowDataBadge.define('flow-data-badge');


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
				xdisplay:flex;xflex-firection:column;xalign-items:center;padding:2px 6px;
				/*min-height: inherit;*/
			}
			.container>div{padding:2px;}
			.title{flex:1; text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-badge-caption); xtext-shadow: 0px 0px 0px var(--flow-data-badge-caption-shadow, #fff); }
			.value{text-align:right; opacity:1;font-size:14px;font-family:"Exo 2";font-weight:normal;}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left;  }
			.row { display: flex; flex-direction: row; flex:0; }


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
		window.addEventListener('resize', ()=>{
			dpc(()=>{
				this.draw();
			})
		})
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

		// TODO - 'date' should be 'ts' as unix timestamp; 'v' should be 'value'
		// const rawData1 = [
		// 	{"ts":1328659200000,"value":476.68},{"ts":1328745600000,"value":493.17},
		// 	{"ts":1328745600000,"value":493.42},{"ts":1329004800000,"value":502.6},
		// 	{"ts":1329091200000,"value":509.46},{"ts":1329177600000,"value":497.67},
		// 	{"ts":1329264000000,"value":502.21},{"ts":1329350400000,"value":502.12},
		// 	{"ts":1329696000000,"value":514.85},{"ts":1329782400000,"value":513.04},
		// 	{"ts":1329868800000,"value":516.39},{"ts":1329955200000,"value":522.41}
		// ];

		// const rawData = [{"ts":1177286400000,"value":93.24},{"ts":1177372800000,"value":95.35},{"ts":1177459200000,"value":98.84},{"ts":1177545600000,"value":99.92},{"ts":1177804800000,"value":99.8},{"ts":1177977600000,"value":99.47},{"ts":1178064000000,"value":100.39},{"ts":1178150400000,"value":100.4},{"ts":1178236800000,"value":100.81},{"ts":1178496000000,"value":103.92},{"ts":1178582400000,"value":105.06},{"ts":1178668800000,"value":106.88},{"ts":1178668800000,"value":107.34},{"ts":1178755200000,"value":108.74},{"ts":1179014400000,"value":109.36},{"ts":1179100800000,"value":107.52},{"ts":1179187200000,"value":107.34},{"ts":1179273600000,"value":109.44},{"ts":1179360000000,"value":110.02},{"ts":1179619200000,"value":111.98},{"ts":1179705600000,"value":113.54},{"ts":1179792000000,"value":112.89},{"ts":1179878400000,"value":110.69},{"ts":1179964800000,"value":113.62},{"ts":1180310400000,"value":114.35},{"ts":1180396800000,"value":118.77},{"ts":1180483200000,"value":121.19},{"ts":1180656000000,"value":118.4},{"ts":1180915200000,"value":121.33},{"ts":1181001600000,"value":122.67},{"ts":1181088000000,"value":123.64},{"ts":1181174400000,"value":124.07},{"ts":1181260800000,"value":124.49},{"ts":1181433600000,"value":120.19},{"ts":1181520000000,"value":120.38},{"ts":1181606400000,"value":117.5},{"ts":1181692800000,"value":118.75},{"ts":1181779200000,"value":120.5},{"ts":1182038400000,"value":125.09},{"ts":1182124800000,"value":123.66},{"ts":1182211200000,"value":121.55},{"ts":1182297600000,"value":123.9},{"ts":1182384000000,"value":123},{"ts":1182643200000,"value":122.34},{"ts":1182729600000,"value":119.65},{"ts":1182816000000,"value":121.89},{"ts":1182902400000,"value":120.56},{"ts":1182988800000,"value":122.04},{"ts":1183334400000,"value":121.26},{"ts":1183420800000,"value":127.17},{"ts":1183593600000,"value":132.75},{"ts":1183680000000,"value":132.3},{"ts":1183939200000,"value":130.33},{"ts":1183939200000,"value":132.35},{"ts":1184025600000,"value":132.39},{"ts":1184112000000,"value":134.07},{"ts":1184198400000,"value":137.73},{"ts":1184457600000,"value":138.1},{"ts":1184544000000,"value":138.91},{"ts":1184630400000,"value":138.12},{"ts":1184716800000,"value":140},{"ts":1184803200000,"value":143.75},{"ts":1185062400000,"value":143.7},{"ts":1185148800000,"value":134.89},{"ts":1185235200000,"value":137.26},{"ts":1185321600000,"value":146},{"ts":1185408000000,"value":143.85},{"ts":1185667200000,"value":141.43},{"ts":1185753600000,"value":131.76},{"ts":1185926400000,"value":135},{"ts":1186012800000,"value":136.49},{"ts":1186099200000,"value":131.85},{"ts":1186358400000,"value":135.25},{"ts":1186444800000,"value":135.03},{"ts":1186531200000,"value":134.01},{"ts":1186617600000,"value":126.39},{"ts":1186617600000,"value":125},{"ts":1186876800000,"value":127.79},{"ts":1186963200000,"value":124.03},{"ts":1187049600000,"value":119.9},{"ts":1187136000000,"value":117.05},{"ts":1187222400000,"value":122.06},{"ts":1187481600000,"value":122.22},{"ts":1187568000000,"value":127.57},{"ts":1187654400000,"value":132.51},{"ts":1187740800000,"value":131.07},{"ts":1187827200000,"value":135.3},{"ts":1188086400000,"value":132.25},{"ts":1188172800000,"value":126.82},{"ts":1188259200000,"value":134.08},{"ts":1188345600000,"value":136.25},{"ts":1188432000000,"value":138.48},{"ts":1188864000000,"value":144.16},{"ts":1188950400000,"value":136.76},{"ts":1189036800000,"value":135.01},{"ts":1189123200000,"value":131.77},{"ts":1189296000000,"value":136.71},{"ts":1189382400000,"value":135.49},{"ts":1189468800000,"value":136.85},{"ts":1189555200000,"value":137.2},{"ts":1189641600000,"value":138.81},{"ts":1189900800000,"value":138.41},{"ts":1189987200000,"value":140.92},{"ts":1190073600000,"value":140.77},{"ts":1190160000000,"value":140.31},{"ts":1190246400000,"value":144.15},{"ts":1190505600000,"value":148.28},{"ts":1190592000000,"value":153.18},{"ts":1190678400000,"value":152.77},{"ts":1190764800000,"value":154.5},{"ts":1190851200000,"value":153.47},{"ts":1191196800000,"value":156.34},{"ts":1191283200000,"value":158.45},{"ts":1191369600000,"value":157.92},{"ts":1191456000000,"value":156.24},{"ts":1191542400000,"value":161.45},{"ts":1191801600000,"value":167.91},{"ts":1191888000000,"value":167.86},{"ts":1191888000000,"value":166.79},{"ts":1191974400000,"value":162.23},{"ts":1192060800000,"value":167.25},{"ts":1192320000000,"value":166.98},{"ts":1192406400000,"value":169.58},{"ts":1192492800000,"value":172.75},{"ts":1192579200000,"value":173.5},{"ts":1192665600000,"value":170.42},{"ts":1192924800000,"value":174.36},{"ts":1193011200000,"value":186.16},{"ts":1193097600000,"value":185.93},{"ts":1193184000000,"value":182.78},{"ts":1193270400000,"value":184.7},{"ts":1193529600000,"value":185.09},{"ts":1193616000000,"value":187},{"ts":1193702400000,"value":189.95},{"ts":1193875200000,"value":187.44},{"ts":1193961600000,"value":187.87},{"ts":1194220800000,"value":186.18},{"ts":1194307200000,"value":191.79},{"ts":1194393600000,"value":186.3},{"ts":1194480000000,"value":175.47},{"ts":1194566400000,"value":165.37},{"ts":1194739200000,"value":153.76},{"ts":1194825600000,"value":169.96},{"ts":1194912000000,"value":166.11},{"ts":1194998400000,"value":164.3},{"ts":1195084800000,"value":166.39},{"ts":1195344000000,"value":163.95},{"ts":1195430400000,"value":168.85},{"ts":1195516800000,"value":168.46},{"ts":1195689600000,"value":171.54},{"ts":1195948800000,"value":172.54},{"ts":1196035200000,"value":174.81},{"ts":1196121600000,"value":180.22},{"ts":1196208000000,"value":184.29},{"ts":1196294400000,"value":182.22},{"ts":1196640000000,"value":178.86},{"ts":1196726400000,"value":179.81},{"ts":1196812800000,"value":185.5},{"ts":1196899200000,"value":189.95},{"ts":1196985600000,"value":194.3},{"ts":1197158400000,"value":194.21},{"ts":1197244800000,"value":188.54},{"ts":1197331200000,"value":190.86},{"ts":1197417600000,"value":191.83},{"ts":1197504000000,"value":190.39},{"ts":1197763200000,"value":184.4},{"ts":1197849600000,"value":182.98},{"ts":1197936000000,"value":183.12},{"ts":1198022400000,"value":187.21},{"ts":1198108800000,"value":193.91},{"ts":1198368000000,"value":198.8},{"ts":1198540800000,"value":198.95},{"ts":1198627200000,"value":198.57},{"ts":1198713600000,"value":199.83},{"ts":1198972800000,"value":198.08},{"ts":1199232000000,"value":194.84},{"ts":1199318400000,"value":194.93},{"ts":1199404800000,"value":180.05},{"ts":1199664000000,"value":177.64},{"ts":1199750400000,"value":171.25},{"ts":1199836800000,"value":179.4},{"ts":1199836800000,"value":178.02},{"ts":1199923200000,"value":172.69},{"ts":1200182400000,"value":178.78},{"ts":1200268800000,"value":169.04},{"ts":1200355200000,"value":159.64},{"ts":1200441600000,"value":160.89},{"ts":1200528000000,"value":161.36},{"ts":1200873600000,"value":155.64},{"ts":1200960000000,"value":139.07},{"ts":1201046400000,"value":135.6},{"ts":1201132800000,"value":130.01},{"ts":1201392000000,"value":130.01},{"ts":1201478400000,"value":131.54},{"ts":1201564800000,"value":132.18},{"ts":1201651200000,"value":135.36},{"ts":1201824000000,"value":133.75},{"ts":1202083200000,"value":131.65},{"ts":1202169600000,"value":129.36},{"ts":1202256000000,"value":122},{"ts":1202342400000,"value":121.24},{"ts":1202428800000,"value":125.48},{"ts":1202601600000,"value":129.45},{"ts":1202688000000,"value":124.86},{"ts":1202774400000,"value":129.4},{"ts":1202860800000,"value":127.46},{"ts":1202947200000,"value":124.63},{"ts":1203292800000,"value":122.18},{"ts":1203379200000,"value":123.82},{"ts":1203465600000,"value":121.54},{"ts":1203552000000,"value":119.46},{"ts":1203811200000,"value":119.74},{"ts":1203897600000,"value":119.15},{"ts":1203984000000,"value":122.96},{"ts":1204070400000,"value":129.91},{"ts":1204156800000,"value":125.02},{"ts":1204502400000,"value":121.73},{"ts":1204588800000,"value":124.62},{"ts":1204675200000,"value":124.49},{"ts":1204761600000,"value":120.93},{"ts":1204848000000,"value":122.25},{"ts":1205020800000,"value":119.69},{"ts":1205107200000,"value":127.35},{"ts":1205193600000,"value":126.03},{"ts":1205280000000,"value":127.94},{"ts":1205366400000,"value":126.61},{"ts":1205625600000,"value":126.73},{"ts":1205712000000,"value":132.82},{"ts":1205798400000,"value":129.67},{"ts":1205884800000,"value":133.27},{"ts":1206230400000,"value":139.53},{"ts":1206316800000,"value":140.98},{"ts":1206403200000,"value":145.06},{"ts":1206489600000,"value":140.25},{"ts":1206576000000,"value":143.01},{"ts":1206835200000,"value":143.5},{"ts":1207008000000,"value":149.53},{"ts":1207094400000,"value":147.49},{"ts":1207180800000,"value":151.61},{"ts":1207267200000,"value":153.08},{"ts":1207526400000,"value":155.89},{"ts":1207612800000,"value":152.84},{"ts":1207699200000,"value":151.44},{"ts":1207699200000,"value":154.55},{"ts":1207785600000,"value":147.14},{"ts":1208044800000,"value":147.78},{"ts":1208131200000,"value":148.38},{"ts":1208217600000,"value":153.7},{"ts":1208304000000,"value":154.49},{"ts":1208390400000,"value":161.04},{"ts":1208649600000,"value":168.16},{"ts":1208736000000,"value":160.2},{"ts":1208822400000,"value":162.89},{"ts":1208908800000,"value":168.94},{"ts":1208995200000,"value":169.73},{"ts":1209254400000,"value":172.24},{"ts":1209340800000,"value":175.05},{"ts":1209427200000,"value":173.95},{"ts":1209600000000,"value":180},{"ts":1209686400000,"value":180.94},{"ts":1209945600000,"value":184.73},{"ts":1210032000000,"value":186.66},{"ts":1210118400000,"value":182.59},{"ts":1210204800000,"value":185.06},{"ts":1210291200000,"value":183.45},{"ts":1210464000000,"value":188.16},{"ts":1210550400000,"value":189.96},{"ts":1210636800000,"value":186.26},{"ts":1210723200000,"value":189.73},{"ts":1210809600000,"value":187.62},{"ts":1211068800000,"value":183.6},{"ts":1211155200000,"value":185.9},{"ts":1211241600000,"value":178.19},{"ts":1211328000000,"value":177.05},{"ts":1211414400000,"value":181.17},{"ts":1211760000000,"value":186.43},{"ts":1211846400000,"value":187.01},{"ts":1211932800000,"value":186.69}]

		// const sampler = FlowSampler.get(this.sampler || 'test-sampler').data;
		// //sampler.put(this.value || 0);
		// const rawData = sampler.data;

		if(!this.sampler)
			return;
		let sampler = FlowSampler.get(this.sampler || 'test-sampler');
		if(!this._draw){
			this._draw = this.draw.bind(this);
			sampler.on('data', this._draw);
		}
		const rawData = sampler.data;
		// console.log('rendering:',this.sampler,'data:',rawData);

		let data = rawData.map(d=>{
			return {date:new Date(d.ts), value:d.value}
		})

		// console.log(JSON.stringify(data, null))

		let [min,max] = d3.extent(data, d => d.date);
		//console.log("processing min-max[1]",min,max);
		min = max - 1000*this.range;


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
			this.path = this.svg.append('path')
				.attr("transform", `translate(${margin.left},0)`)
				.attr('stroke-opacity', 'var(--flow-data-badge-graph-stroke-opacity, 1.0)')
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 'var(--flow-data-badge-graph-stroke-width, 0)')
				.attr('fill','var(--flow-data-badge-graph-fill, steelblue)')
				.attr('stroke','var(--flow-data-badge-graph-stroke, "#000)')
				
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
