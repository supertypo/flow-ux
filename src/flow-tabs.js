import {BaseElement, html, css} from './base-element.js';
import {repeat} from 'lit-html/directives/repeat.js';
import {i18n, T} from './flow-i18n.js';

/**
* @class FlowTabs
* @extends BaseElement
* @listens flow-tab-select
* @export FlowTabs
*
* @prop {String} active Active tab id
* @prop {Array.<FlowTabConfig>} tabs alternative to slotted tabs for defining tabs
* @prop {ActiveDisplay} target-display *blocked/active* display type for target elements (default: block)
* @cssvar {margin} [--flow-tabs-margin=8px 28px 0px 28px]
* @example
* <flow-tabs active="tab1">
*   <flow-tab id="tab1">TAB 1</flow-tab>
*   <flow-tab id="tab2">TAB 2</flow-tab>
*   <flow-tab id="tab3">TAB 3</flow-tab>
*   <flow-tab id="tab4">TAB 4</flow-tab>
* </flow-tabs>
*/
export class FlowTabs extends BaseElement {
	/**
	* @member {String} active Active tab id
	* @memberof FlowTabs#
	*/

	/**
	* @member {Array.<FlowTabConfig>} tabs alternative to slotted tabs for defining tabs
	* @memberof FlowTabs#
	*/

	/**
	* @member {ActiveDisplay} target-display *blocked/active* display type for target elements (default: block)
	* @memberof FlowTabs#
	*/


	static get properties() {
		return {
			active : { type : String },
			tabs : { type : Array },
			'target-display':{type: String, value:"block"}
		}
	}
	

	/**
	* [CSSResult]{@link https://lit-element.polymer-project.org/api/classes/_lib_css_tag_.cssresult.html} object
	*/
	static get styles() {
		return css`
			:host{
				flex:1;
				display:flex;
				flex-direction:row;
				flex-wrap:wrap;
				justify-content:flex-end;
				margin:var(--flow-tabs-margin, 8px 28px 0px 28px);
				-webkit-app-region:drag;
			}
			.tabs-outer{
				flex:1;
				display:flex;
				position:relative;
			}
			.tab-items{
				flex:1;
				display:flex;
				flex-direction:row;
				flex-wrap:wrap;
				justify-content:flex-end;
			}
			.proxy{
				position:absolute;
				left:0px;
				top:0px;
				width:100%;
				visibility: hidden;
			}
			.proxy.v{
				visibility:visible;
				z-index:100;
				opacity:1
			}
			flow-tab, ::slotted(flow-tab) {
				/*//min-width: var(--flow-tab-min-width);
				//max-width: var(--flow-tab-max-width);
				//width: var(--flow-tab-width);
				//min-width: fill-available;*/
				height: 38px;
				margin-left: -20px;
				margin-right: -20px;
				margin-top:-8px;
				-webkit-app-region:no-drag;
				
			}
			.line-break{
				width:100%;
				background-color:#F00;
			    padding:0px;
			    border:0px;
			    height:0px;
			}
			flow-tab[hidden]{display:none}
		`;
	}

	constructor() {
		super();
		this.ident = Math.round((Math.random()*1e16)).toString(16);
		this.tabs = null;
		this['target-display'] = "block";

		this.shadowRoot.addEventListener('flow-tab-select', (e) => {
			this.active = e.detail.id;
		})

		window.addEventListener("resize", ()=>{
			if(this._timeoutId)
				clearTimeout(this._timeoutId);
			this._timeoutId = setTimeout(()=>{
				this._timeoutId = null
				if(this.active)
					this.updateRows();
			}, 100);
		})
	}

	render() {
		let tabs = this._tabs || this.tabs || [];
		return html`
		<slot></slot>
		<div class="tabs-outer">
			<div class="tab-items proxy">
			${
				(this.tabs || []).filter(t => !t.disable).map(t=>{
					if(t.sep)
						return html`<div class="line-break"></div>`;
					return html`<flow-tab data-id='${t.id}' class="${t.cls||''}" part="${t.part||''}">${this.renderTab(t)}</flow-tab>`
				})
			}
			</div>
			<div class="tab-items front">
			${
				tabs.map(t=>{
					if(t.sep)
						return html`<div class="line-break"></div>`;
					if(t.disable)
						return html`<flow-tab id='${t.id}' hidden="1"></flow-tab>`;
					return html`<flow-tab id='${t.id}' class="${t.cls||''}" part="${t.part||''}"
						style="z-index:${t.zIndex || (t.id==this.active? 2:1)}">${this.renderTab(t)}</flow-tab>`
				})
			}
			</div>
		</div>
		`;
	}
	updated(changed) {
		//this.log("UPDATING UPDATING UPDATING", this.active, changed)
		if(changed.has("tabs") && this._tabs){
			let lastHash = this.lastTabHash;
			let tabs = this.tabs.map(t=>{
				return Object.assign({}, t, {zIndex:undefined});
			})
			this.lastTabHash = JSON.stringify(tabs)
			if(lastHash != this.lastTabHash){
				console.log('ssss', lastHash, this.lastTabHash)
				this._tabs = null;
				return this.update();
			}
		}
		let root = this.tabs ? this.shadowRoot : this;
		root = root.querySelector(".tab-items.front");
		if(!root)
			return

		let tabs = [...root.querySelectorAll("flow-tab")];

		//console.log("tabs", tabs, this.tabs, this._tabs)

		let i = tabs.length;
		if(!i)
			return false;

		let activeIsSet = false;
		tabs.forEach((tab) => {
			let target = document.querySelector(`tab-content[for="${tab.id}"]`);
			if(!tab.getAttribute('hidden') && tab.id == this.active) {
				tab.active = true;
				activeIsSet = true;
				//tab.style['z-index'] = 2;
				if(target){
					target.style.display = target.getAttribute('data-active-display') || this['target-display'];
				}
			}
			else {
				tab.active = false;
				//tab.style['z-index'] = 1;
				target && (target.style.display = 'none');
			}
		});


		if(!activeIsSet)
			this.active = tabs[0].id;

		//console.log("changed", changed)

		if(changed.has("tabs") || changed.has("active")){
			/*
			this.addFillerTabs();
			setTimeout(()=>{
				this.addFillerTabs();
			}, 10)
			this.changeTabRows(activeTab);
			if(changed.get("active") == 'undefined'){
				setTimeout(()=>{
					this.changeTabRows();
				}, 15)
			}
			*/
			//console.log("updateRows", this.active)
			if(this.active){
				this.updateRows();
				setTimeout(()=>{
					this.updateRows();
					setTimeout(()=>{
						this.updateRows();
					}, 1000)
				}, 15)
			}
		}
	}

	hashTabs(tabs){
		return JSON.stringify(tabs);
	}

	updateRows(activeTab){
		let container = this.tabs ? this.shadowRoot : this;
		container = container.querySelector(".tab-items.proxy");
		//this.log("this.active", this.active)
		activeTab = container && container.querySelector(`[data-id=${this.active}]`);
		if(!activeTab)
			return
		let offsetTop = activeTab.offsetTop;
		let bottomOffset = container.querySelector("flow-tab:last-child").offsetTop;
		let map = {};

		this.tabs.forEach(t=>{
			map[t.id] = t;
		})

		let tabs = [];
		let lastRowTabs = [];
		let lastTop = -1, id;
		container.querySelectorAll("flow-tab").forEach((tab, index)=>{
			id = tab.getAttribute("data-id");
			//this.log(tab.id, tab.offsetTop, offsetTop, bottomOffset)
			if(tab.offsetTop == offsetTop && tab.offsetTop != bottomOffset){
				lastRowTabs.push(map[id]);
				return true;
			}

			if(lastTop != -1 && tab.offsetTop != lastTop){
				tabs.push({sep:1, id:"sep"});
			}
			tabs.push(map[id]);

			lastTop = tab.offsetTop;
		});

		if(lastRowTabs.length)
			lastRowTabs.unshift({sep:1, id:"sep"})

		let _tabs = [...tabs, ...lastRowTabs];
		let index = _tabs.findIndex(t=>t.id == this.active);
		let zIndex = index>-1 ? _tabs.slice(index).length+2 : 2;
		_tabs.forEach((t, i)=>{
			if(index >-1 && i >= index){
				t.zIndex = zIndex--;
			}else{
				t.zIndex = 1;
			}
		})
		let hash1 =  this.hashTabs(_tabs);
		let hash2 =  this.hashTabs(this.tabs);

		//this.log("updateRows:_tabs\n", _tabs.map(t=>t.id+"::"+t.zIndex).join("\n"))

		
		if(hash1 != hash2 || this._lastHash != hash1){
			this._lastHash = hash1;
			this._tabs = _tabs;
			this.requestUpdate("_tabs")
		}else{
			//this.log('updateRows:hash1==hash2', hash1)
		}
	}

	changeTabRows(activeTab){
		let container = this.tabs ? this.shadowRoot : this;
		activeTab = activeTab || container.querySelector("flow-tab[active]");
		if(!activeTab)
			return
		let offsetTop = activeTab.offsetTop;
		let bottomOffset = container.querySelector("flow-tab:last-child").offsetTop
		let tabs = [];
		let lastRowTabs = [];
		Array.from(container.querySelectorAll("flow-tab")).filter(tab=>{
			//console.log(tab.id, tab.offsetTop, offsetTop, bottomOffset)
			if(tab.offsetTop == offsetTop && tab.offsetTop != bottomOffset){
				lastRowTabs.push(tab);
				return true;
			}
			tabs.push(tab);
		}).map(tab=>{
			tab.remove();
			return tab;
		}).forEach(tab=>{
			container.append(tab);
		})
		/*
		let _tabs = [...tabs, ...lastRowTabs];
		let tabStr = _tabs.map(t=>t.id||"filler").join(",");
		if(this.tabStr == tabStr)
			return
		this.tabStr = tabStr;
		this._tabs = _tabs;
		*/
	}

	addFillerTabs() {
		window.xxxxflowTabs = this;
		let container = this.tabs ? this.shadowRoot : this;
		container.querySelectorAll(".filler-tab").forEach(e=>{
			e.remove();
		});
	
		let lastTop = -1, fillerTab, fillerTabW;
		let isEndJustified = true;
		let minTabWidth = 50;
		container.querySelectorAll("flow-tab").forEach((e, i)=>{
			//console.log("e.offsetTop, lastTop", e.offsetTop, lastTop)
			if(e.offsetTop == lastTop)
				return
			if((isEndJustified && i==0) || lastTop !== -1){
				fillerTab = document.createElement("flow-tab");
				fillerTab.className = 'filler-tab';
				fillerTab.style.backgroundColor = `rgb(${lastTop}, ${lastTop}, ${lastTop})`;
				container.insertBefore(fillerTab, e);
				fillerTab.style.minWidth = minTabWidth+"px";
				fillerTabW = fillerTab.getBoundingClientRect().width;
				fillerTab.style.minWidth = Math.max(fillerTabW, minTabWidth)+"px";
				//console.log("fillerTab.offsetTop != lastTop", fillerTab.offsetTop , lastTop)
				console.log("fillerTab.width:", fillerTabW, fillerTab.getBoundingClientRect().width, Math.max(fillerTabW, minTabWidth))
				if(isEndJustified){
					if(fillerTab.offsetTop != e.offsetTop){
						console.log("fillerTab.remove", fillerTab.offsetTop, e.offsetTop)
						fillerTab.remove();
					}
				}else if(fillerTab.offsetTop != lastTop)
					fillerTab.remove();
			}
			lastTop = e.offsetTop;
		})
		if(!isEndJustified){
			fillerTab = document.createElement("flow-tab");
			fillerTab.className = 'filler-tab';
			container.append(fillerTab);
			fillerTab.style.minWidth = minTabWidth+"px";
			fillerTab.style.minWidth = Math.max(fillerTab.getBoundingClientRect().width, minTabWidth)+"px";
			//console.log("fillerTab.offsetTop != lastTop", fillerTab.offsetTop , lastTop)
			if(fillerTab.offsetTop != lastTop)
				fillerTab.remove();
		}

		/*
		container.querySelectorAll(".filler-tab").forEach((e, i)=>{
			//e.style.minWidth = e.getBoundingClientRect().width+"px";
			//e.classList.remove("flex")
		})
		*/
	}

	renderTab(t) {
		let text = t.render ? t.render() : t.html||t.title||t.caption;
		if(typeof(text) == 'string'){
			//this.log("t", t.id, text)
			return html`<flow-i18n .text="${text}" text2="${text}"></flow-i18n>`;
		}
		return text;
	}
}

FlowTabs.define('flow-tabs');