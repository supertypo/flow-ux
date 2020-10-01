import {BaseElement, html, css} from './base-element.js';
let Defaults = [
	'America/Los_Angeles:San_Francisco',
	'America/New_York',
	'Europe/London',
	'Europe/Moscow',
	'Asia/Dubai',
	'Asia/Hong_Kong',
	'Asia/Tokyo',
	'Asia/Tel_Aviv'
]

export class FlowClockWidget extends BaseElement {

	static get properties() {
		return {
			locale: {type: String},
			tz: {type: String},
			city:{type:String}
		}
	}

	static get styles() {
		return css`
			:host {
				padding: 0px;
			}
			[col] { display: flex; flex-direction: column; }
			[row] { display: flex; flex-direction: row; }
			.caption { 
				font-size: var(--flow-clock-widget-caption-font-size, 9px);
				text-transform:var(--flow-clock-widget-caption-text-transform, uppercase);
				white-space: nowrap;
			}
			.time-wrapper {
				align-items: flex-start;
				padding: 1px;
			}
			.time { 
				font-size: var(--flow-clock-widget-time-font-size, 14px);
			}
			.suffix {
				font-size: var(--flow-clock-widget-suffix-font-size, 10px);
			}
		`;
	}

	constructor() {
		super();

		this.locale = 'en-US';
		this.tz = '';
		this.city = '';
	}

	connectedCallback() {
		super.connectedCallback();
		this.interval = setInterval(()=>{this.requestUpdate()}, 1000);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if(this.interval) {
			clearInterval(this.interval);
			delete this.interval;
		}
	}

	render() {

		let city, timeZone;
		if(this.tz.includes(':')) {

			let parts = this.tz.split(':');
			console.log("TIMEZONE",this.tz,parts);
			timeZone = parts.shift();
			city = parts.shift();
		} else {
			city = this.city || this.tz.split('/').pop() || 'N/A';
			timeZone = this.tz || 'UTC';
		}

		const tzTime = new Date().toLocaleString(this.locale,{timeZone});
		const s = (new Date(tzTime)).toISOString();
		const [time,ampm] = (new Date(tzTime)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).split(/\s/);
		
		return html`
			<div col>
				<div class='caption'>${city.replace(/_/g,' ')}</div>
				<div row class='time-wrapper'>
					<div class='time'>${time}</div>
					${ampm?html`<div class="suffix"> ${ampm}</div>`:''}
				</div>
			</div>
		
		`;
	}  
}

FlowClockWidget.Defaults = Defaults;

/*
class FlowClockWidgetChild extends FlowClockWidget{}
class FlowClockWidgetChild2 extends FlowClockWidget{}
FlowClockWidgetChild2.Defaults = [];
console.log("FlowClockWidgetChild.Defaults", FlowClockWidgetChild.Defaults, FlowClockWidgetChild2.Defaults)
*/

FlowClockWidget.define('flow-clock-widget');
