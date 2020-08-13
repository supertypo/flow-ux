import {html, css, dpc} from './base-element.js';
import {FlowSelect} from './flow-select.js';
import {setTheme, getTheme} from './helpers.js';

/**
 * @export
 * @class FlowThemeSelect
 * @extends {FlowSelect}
 *
 *
 * 
 * @example
 * <flow-theme-select items="light,dark"></flow-dropdown>
 *
 */
export class FlowThemeSelect extends FlowSelect {
	static get properties() {
		return {
			items:{type:String}
		}
	}

	static get styles() {
		return [FlowSelect.styles, css`
			.selected{
				min-width: var(--flow-theme-select-selected-min-width, 150px);
			}
		`];
	}

	constructor(){
		super();
		this.items = "dark,light";
		this.label = "Theme"
		this.selected = this.getTheme("dark");
		this.hidefilter = true;
	}

	renderItems(){
		return this.items.split(",").map(item=>{
			let name = this.buildItemName(item);
			return html`<div class="menu-item" value="${item}">${name}</div>`
		})
	}
	get list(){
		if(!this.renderRoot){
			return [];
		}
		return [...this.renderRoot.querySelectorAll(".menu-item")]
	}
	buildItemName(name){
		name = name.toLowerCase()
					.replace(/[_-]+/g, ' ')
					.replace(/\s{2,}/g, ' ').trim();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}
	selectionChanged(){
		super.selectionChanged();
		let value = this.value;
		if(value)
			this.setTheme(value);
	}

	onThemeChange(){
		//this.log("onThemeChange", getTheme())
		this.selected = this.getTheme();
		this.requestUpdate("selected")
	}

	connectedCallback(){
		super.connectedCallback();
		this._onThemeChange = this._onThemeChange || this.onThemeChange.bind(this);
		document.body.addEventListener("flow-theme-changed", this._onThemeChange)
	}
	disconnectedCallback(){
		super.disconnectedCallback();
		document.body.removeEventListener("flow-theme-changed", this._onThemeChange)
	}

	getTheme(defaultTheme){
		return getTheme(defaultTheme)
	}

	setTheme(theme){
		setTheme(theme);
	}
}

FlowThemeSelect.define('flow-theme-select');
