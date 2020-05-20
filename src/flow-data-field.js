import {BaseElement, html, css} from './base-element.js';
import {Flowd3Element} from './flow-d3.js';

/**
* @class FlowDataField
* @extends BaseElement
* @example
*   <flow-data-field title="text">value</flow-data-field>
*
*/
export class FlowDataField extends BaseElement {
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
				font-family:var(--flow-data-field-font-family, "Julius Sans One");
				font-weight:var(--flow-data-field-font-weight, bold);
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
			.title{text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-field-caption); xtext-shadow: 0px 0px 0px var(--flow-data-field-caption-shadow, #fff); }
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

FlowDataField.define('flow-data-field');


/**
* @class FlowDataFieldCanvas
* @extends BaseCanvasElement
* @example
*   <flow-data-field-canvas title="text">value</flow-data-field-canvas>
*
*/
export class FlowDataFieldGraph extends Flowd3Element {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect:true},
			title:{type:String},
			prefix : { type : String },
			suffix:{type:String},
			align:{type:String},
			lineColor:{type:String},
			fillColor:{type:String},	
			value:{type:Number}
			//strokeColor:{type:String},
			//fill:{type:String},
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
				font-family:var(--flow-data-field-font-family, "Julius Sans One");
				font-weight:var(--flow-data-field-font-weight, bold);
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
			.title{text-align:left; opacity:1;xmargin-top:7px; font-size: 10px; color: var(--flow-data-field-caption); xtext-shadow: 0px 0px 0px var(--flow-data-field-caption-shadow, #fff); }
			.value{text-align:right; opacity:1;font-size:14px;font-family:"Exo 2";font-weight:normal;}
			.prefix{opacity:0.9;margin-right:3px;margin-top:3px; font-size: 10px; }
			.suffix{opacity:0.9;margin-left:3px;margin-top:3px; font-size: 10px; }
			.col { display: flex; flex-direction: column; align-items: left; }
			.row { display: flex; flex-direction: row; }


			.wrapper {
				width: 100%; height:100%;
			}
			.wrapper > div {
				width: 100%; height:100%;
				position:relative;left:0px;top:0px;
			}
		`;
	}

	render() {
		return html
		`
		<div class='wrapper'>
			<div>${super.render()}</div>
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

	firstUpdated() {
		super.firstUpdated();

		// TODO - 'date' should be 'ts' as unix timestamp; 'v' should be 'value'
		const data = [
			{"date":"2012-02-08T00:00:00.000Z","value":476.68},{"date":"2012-02-09T00:00:00.000Z","value":493.17},{"date":"2012-02-09T00:00:00.000Z","value":493.42},{"date":"2012-02-12T00:00:00.000Z","value":502.6},{"date":"2012-02-13T00:00:00.000Z","value":509.46},{"date":"2012-02-14T00:00:00.000Z","value":497.67},{"date":"2012-02-15T00:00:00.000Z","value":502.21},{"date":"2012-02-16T00:00:00.000Z","value":502.12},{"date":"2012-02-20T00:00:00.000Z","value":514.85},{"date":"2012-02-21T00:00:00.000Z","value":513.04},{"date":"2012-02-22T00:00:00.000Z","value":516.39},{"date":"2012-02-23T00:00:00.000Z","value":522.41}			
		];

		const x = d3.scaleUtc().domain([0, d3.max(data, d => d.value)]).nice()
		.range([height - margin.bottom, margin.top]);

		const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.value)]).nice()
		.range([height - margin.bottom, margin.top]);

		const xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

		const yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y))
		.call(g => g.select(".domain").remove())
		.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 3)
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text(data.y));

		const area = d3.area()
			.curve(curve)
			.x(d => x(d.date))
			.y0(y(0))
			.y1(d => y(d.value));

		const { svg } = this;
		svg.attr('viewBox',[0,0,1,1]);
		svg.append('path').datum(data).attr('fill','steelblue').attr('d',area);

		svg.append("g")
		.call(xAxis);
  
		svg.append("g")
		.call(yAxis);

	}
}

FlowDataFieldGraph.define('flow-data-field-graph');
