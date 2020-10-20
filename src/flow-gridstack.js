import {BaseElement, html, css, baseUrl, dpc, getLocalSetting, setLocalSetting} from './base-element.js';
export * from './flow-gridstack-panel.js';
//export * from './flow-context-test.js';
export * from './flow-context.js';

export class FlowGridStackTest extends BaseElement{
	render(){
		return html`
			<h1 slot="title">GridStack in SHADOW DOM</h1>
			<flow-gridstack class="gs"></flow-gridstack>`;
	}
}

FlowGridStackTest.define("flow-gridstack-test");


export const FlowGridStackMixin = (base)=>{
class FlowGridStackKlass extends base{
	static get properties() {
		return {
			cols:{type:Number, value:10},
			rows:{type:Number, value:10},
			gridMargin:{type:Number, value:1},
			column:{type:Number, value:30},
			resizableHandles:{type:String, value:'e, s, w'},
			cellHeight:{type:Number, value:100},
			dragMode:{type:String, value:'header', reflect:true},
			items:{type:Array, value:[]}
		}
	}

	static define(name, deps){
		if(deps){
			BaseElement.define.call(this, name, deps)
		}else{
			this.addGridStackHelpers();
			BaseElement.define.call(this, name);
		}
	}

	static addGridStackHelpers(){

		$.ui.draggable.prototype._getHandle = function( event ) {
			let {handle, handleFn} = this.options;
			let gridEl = this.element.closest('.grid-stack')[0];
			if(gridEl && gridEl.gridstack){
				handleFn = gridEl.gridstack.opts.draggable.handleFn;
			}
			if(typeof handleFn == 'function')
				return handleFn(event, this);

			return handle?!!$(event.target)
				.closest(this.element.find(handle)).length:true;
		}
	}

	constructor() {
		super();
		this.initPropertiesDefaultValues();
		this.uid = 'flow-gs-'+(Math.random()*1000000).toFixed(0);
		this.style.display = 'block';
		//this.style.height = '1000px';
	}

	createRenderRoot(){
		return this;
	}

	render() {
		let {uid} = this;
		return html`
		<link rel="stylesheet" href="${baseUrl}resources/extern/gridstack/gridstack.min.css">
		<link rel="stylesheet" href="${baseUrl}resources/extern/gridstack/gridstack-extra.css">
		<style data-uid="${uid}"></style>
		${this.renderGSTools(uid)}
		<div class="grid-stack grid-stack-${this.column} ${uid} hide-w-opacity"
			@remove-gridstack-panel-request=${this.onRemovePanelRequest}
		></div>
		<slot></slot>`;
	}
	renderGSTools(uid){
		return html`
		<textarea class="gridstack-json" data-uid="${uid}"></textarea>
		<div class="buttons">
			<flow-btn @click="${this.saveGrid}">Save</flow-btn>
			<flow-btn @click="${this.loadGrid}">Load</flow-btn>
			<flow-btn @click="${this.saveGridLS}">Save to LStorage</flow-btn>
			<flow-btn @click="${this.loadGridLS}">Load from LStorage</flow-btn>
			<flow-btn @click="${this.toggleDragMode}">ToggleDragMode : ${this.dragMode}</flow-btn>
		</div>`
	}
	firstUpdated(){
		let {uid} = this;
		this.gridEl = this.renderRoot.querySelector('.grid-stack');
		this.styleEl = this.renderRoot.querySelector(`style[data-uid="${uid}"]`);
		this.debugEl = this.renderRoot.querySelector(`textarea[data-uid="${uid}"]`);
		this.styleEl.textContent = `
			/*.${uid} .grid-stack-item-content{display:block}*/
			.${uid}.grid-stack.hide-w-opacity{opacity:0}
		`
		console.log("this.resizableHandles", this.resizableHandles)
		let options = {
			alwaysShowResizeHandle:false,// /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			//ddPlugin:GridStackDDJQueryUI,
			resizable: {
			    handles: this.resizableHandles
			},
			minRow:1,
			margin:this.gridMargin,
			cellHeight:this.cellHeight,
			column:this.column,
			acceptWidgets:this.acceptWidgets||function(el) { return true; },
			draggable:{
				handle:'.grid-stack-item-content .heading',
				handleFn:(event, uiDraggable)=>{
					let {handle} = uiDraggable.options.handle;
					if(this.dragMode=="panel"){
						handle = '.grid-stack-item-content';
					}else if(this.dragMode=='header'){
						//console.log("event.target", event.originalEvent, handle, this.element.find( handle ))
						let cmp = uiDraggable.element.find('.grid-stack-item-content')[0];
						let handleEl;
						if(cmp && cmp.getGridstackDragHandle){
							handleEl = cmp.getGridstackDragHandle();
						}

						if(!handleEl)
							return false;
						return event.originalEvent.path?.includes(handleEl);
					}

					return handle?!!$(event.target)
						.closest(uiDraggable.element.find(handle)).length:true;
				}
			}
		};
		dpc(()=>{
			this.grid = GridStack.init(options, this.gridEl);
			this.gridEl.classList.remove("hide-w-opacity");
			this.grid.on('added removed change', (e, items)=>{
				let str = '';
				items.forEach(o=>{
					str += `${o.id} => x: ${o.x}, y: ${o.y}, w: ${o.width}, h: ${o.height}\n`;
				});
				this.log(`${e.type} ${items.length} items\n${str}` );
			});
			//console.log("GridStack.prototype.getElement", GridStack.prototype.getElement)
			this.initItems();
		}, 100)
	}

	setLocalSetting(name, value){
		if(typeof value != 'string')
			value = JSON.stringify(value);
		setLocalSetting('gridstack-${this.id || this.uid)}-${name}', value);
	}

	getLocalSetting(name, defaults){
		let value = getLocalSetting('gridstack-${this.id || this.uid)}-${name}');
		if(typeof value == 'undefined')
			return defaults;

		return value;
	}

	saveGridLS(){
		this.setLocalSetting('grid', this.saveGrid())
	}
	loadGridLS(){
		let grid = this.getLocalSetting('grid', '[]');
		this.debugEl.value = grid;
		try{
			grid = JSON.parse(grid);
			if(grid)
				this.debugEl.value = JSON.stringify(grid, null, '  ');
		}catch(e){
			grid = [];
		}
		this.setGridItemsConfig(grid);
	}

	saveGrid(){
		let data = this.getGridItemsConfig();
		this.debugEl.value = JSON.stringify(data, null, '  ');
		return data;
	}
	loadGrid(){
		let data = [];
		try{
			data = JSON.parse(this.debugEl.value);
		}catch(e){
			//data;
			this.log("JSON.parse:error", e)
		}

		console.log("loadGrid", this.debugEl.value, data)

		this.setGridItemsConfig(data);
	}

	updated(changes){
		if(changes.has('items'))
			this.setGridItemsConfig(this.items||[]);
	}
	initItems(){
		let {items} = this;
		if(items && items.length)
			this.setGridItemsConfig(items);
	}
    getGridItemsConfig(){
    	let data = [];
		this.grid.engine.nodes.forEach(node=>{
			let serializedData = null, nodeName = 'div';
			let el = node.el.querySelector(".grid-stack-item-content");
			if(el){
				nodeName = el.nodeName;
				if(typeof el.serialize == 'function')
					serializedData = el.serialize();
			}

			data.push({
				x: node.x,
				y: node.y,
				width: node.width,
				height: node.height,
				id: node.id,
				nodeName,
				serializedData
			});
		});

		return data;
    }
	setGridItemsConfig(itemsConfig){
		let items = GridStack.Utils.sort(itemsConfig);
		let {grid} = this;
		if(!grid)
			return

		grid.batchUpdate();
		if (grid.engine.nodes.length === 0) {
			// load from empty
			items.forEach(item=>{
				this.addWidget(item)
			});
		} else {
			console.log("items", items)
			// else update existing nodes (instead of calling grid.removeAll())
			let itemsIdMap = new Map();
			items.forEach(item=>{
				itemsIdMap.set(item.id, item);
				let node = grid.engine.nodes.find(n=>n.id == item.id);
				console.log("node", node, item)
				if(node){
					//console.log("sending serializedData00", node.el, item.serializedData)
					grid.update(node.el, item.x, item.y, item.width, item.height);
					//console.log("sending serializedData11", node.el, item.serializedData)
					this.sendSerializeDataToPanel(node.el, item.serializedData);
				}else{
					this.addWidget(item)
				}
			});
			let nodes = [...grid.engine.nodes];
			nodes.forEach(node=>{
				if(!itemsIdMap.get(node.id))
					this.grid.removeWidget(node.el, true, true)
			})
		}
		grid.commit();
	}
	addWidget(item){
		let nodeName = item.nodeName || 'div';
		let el = this.grid.addWidget(`<div data-gs-id="${item.id}">
			<${nodeName} class="grid-stack-item-content"></${nodeName}></div>`, item);
		this.sendSerializeDataToPanel(el, item.serializedData);
	}
	sendSerializeDataToPanel(el, serializedData){
		if(!serializedData)
			return
		el = el.querySelector(".grid-stack-item-content")
		if(!el || typeof el.deserialize!='function')
			return console.log("el.deserialize is missing", el&&el.deserialize)

		//console.log("sending serializedData", el, serializedData)
		el.deserialize(serializedData);
	}
	clearGrid(){
		this.grid.removeAll();
    }
    onResize(){
    	//console.log("onResize")
    	let {grid} = this;
    	if(!grid)
    		return
    	dpc(10, e=>{
    		//console.log("onResize1")
    		//grid._updateContainerHeight();
    		grid._onResizeHandler();
    		//grid.commit();
    		//grid.compact();
    	})
    }
    removePanel(panel, removeDOM=true, fireEvent=true){
    	if(!panel.matches(".grid-stack-item"))
    		panel = panel.closest(".grid-stack-item");
    	if(!panel)
    		return
    	this.grid.removeWidget(panel, removeDOM, fireEvent)
    }
    toggleDragMode(){
    	if(this.dragMode == 'panel'){
			this.setDragMode('header');
		}else{
			this.setDragMode('panel');
		}
		return this.dragMode;
    }
    setDragMode(mode){
    	let {uid} = this;
    	//this.addCSSRule(`.${uid}.grid-stack`, 'background:#F00');
    	if(['header', 'panel'].includes(mode)){
    		this.dragMode = mode;
    		return this.dragMode;
    	}

    	return false
    }

    onRemovePanelRequest(e){
    	let {panel} = e.detail;
    	if(!panel)
    		return
    	console.log("onRemovePanelRequest:", panel)
    	/*
    	setTimeout(()=>{
    		e.preventDefault();
    	}, 100)
    	*/

    	this.removePanel(panel);
    }

    serialize(){
    	let config = super.serialize()
		config.items = this.getGridItemsConfig();
		return config;
	}

	deserialize(config){
		super.deserialize(config)
		let {items} = config;
		this.setGridItemsConfig(items);
	}

    connectedCallback(){
		super.connectedCallback();
		if(!this.resizeObserver){
			this.resizeObserver = new ResizeObserver(()=>{
				this.onResize();
			});
		}

		this.resizeObserver.observe(this);
	}
	disconnectedCallback(){
		super.disconnectedCallback();
		this.resizeObserver.disconnect();
	}
}
return FlowGridStackKlass;
}

/**
* @class FlowGridStack
* @extends BaseElement
* @property {Number} [cols]
* @property {Number} [rows]
* @example
*   <flow-gridstack></flow-gridstack>
*
*/

export const FlowGridStackImp = FlowGridStackMixin(BaseElement);
export class FlowGridStack extends FlowGridStackImp{}

FlowGridStack.define('flow-gridstack',[baseUrl+'resources/extern/gridstack/gridstack.all.js']);
