import {BaseElement, html, css, baseUrl, dpc} from './base-element.js';
import {FlowGridStackPanel} from './flow-gridstack-panel.js';
/*
let gs = import(baseUrl+'resources/extern/gridstack/gridstack.all.js').then(e=>{
	console.log("gs", gs, e, e.GridStack)
})
*

class GridStackDDJQueryUI{
    constructor(grid) {
        this.grid = grid;
    }
    resizable(el, opts, key, value) {
        let $el = $(el);
        if (opts === 'disable' || opts === 'enable') {
            $el.resizable(opts);
        }
        else if (opts === 'destroy') {
            if ($el.data('ui-resizable')) { // error to call destroy if not there
                $el.resizable(opts);
            }
        }
        else if (opts === 'option') {
            $el.resizable(opts, key, value);
        }
        else {
            let handles = $el.data('gs-resize-handles') ? $el.data('gs-resize-handles') : this.grid.opts.resizable.handles;
            $el.resizable(Object.assign({}, this.grid.opts.resizable, { handles: handles }, {
                start: opts.start,
                stop: opts.stop,
                resize: opts.resize // || function() {}
            }));
        }
        return this;
    }
    draggable(el, opts, key, value) {
        let $el = $(el);
        if (opts === 'disable' || opts === 'enable') {
            $el.draggable(opts);
        }
        else if (opts === 'destroy') {
            if ($el.data('ui-draggable')) { // error to call destroy if not there
                $el.draggable(opts);
            }
        }
        else if (opts === 'option') {
            $el.draggable(opts, key, value);
        }
        else {
        	let {handleCmp, handle} = this.grid.opts.draggable;
        	console.log("optsoptsopts", opts, this.grid.opts.draggable, handleCmp)
        	let el = $el[0];
        	if(el && handleCmp){
        		let cmp = el.querySelector(handleCmp);
        		if(cmp && cmp.getGridstackDragHandle)
        			handle = cmp.getGridstackDragHandle() || handle;

        		//console.log("handle", handle)
        	}
            $el.draggable(Object.assign({}, this.grid.opts.draggable, {
                containment: (this.grid.opts._isNested && !this.grid.opts.dragOut) ?
                    $(this.grid.el).parent() : (this.grid.opts.draggable.containment || null),
                handle,
                start: opts.start,
                stop: opts.stop,
                drag: opts.drag // || function() {}
            }));
        }
        return this;
    }
    dragIn(el, opts) {
        let $el = $(el); // workaround Type 'string' is not assignable to type 'PlainObject<any>' - see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29312
        $el.draggable(opts);
        return this;
    }
    droppable(el, opts, key, value) {
        let $el = $(el);
        if (typeof opts.accept === 'function' && !opts._accept) {
            // convert jquery event to generic element
            opts._accept = opts.accept;
            opts.accept = ($el) => opts._accept($el.get(0));
        }
        $el.droppable(opts, key, value);
        return this;
    }
    isDroppable(el) {
        let $el = $(el);
        return Boolean($el.data('ui-droppable'));
    }
    isDraggable(el) {
        let $el = $(el); // workaround Type 'string' is not assignable to type 'PlainObject<any>' - see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29312
        return Boolean($el.data('ui-draggable'));
    }
    on(el, name, callback) {
        let $el = $(el);
        $el.on(name, (event, ui) => { callback(event, ui.draggable ? ui.draggable[0] : event.target, ui.helper ? ui.helper[0] : null); });
        return this;
    }
    off(el, name) {
        let $el = $(el);
        $el.off(name);
        return this;
    }
}
*/


/**
* @class FlowGridStack
* @extends BaseElement
* @property {Number} [cols]
* @property {Number} [rows]
* @example
*   <flow-gridstack></flow-gridstack>
*
*/

export class FlowGridStack extends BaseElement {
	static get properties() {
		return {
			cols:{type:Number, value:10},
			rows:{type:Number, value:10},
			resizableHandles:{type:String, value:'e, s, w'},
			cellHeight:{type:Number, value:100},
			dragMode:{type:String, value:'header', reflect:true}
		}
	}

	static get styles() {
		return css`
			:host{
				display:block;
				margin:20px;
			}
			.grid-stack{
				height:500px;
			}
			.grid-stack-item-content{background:#DDD}
		`;
	}

	static define(name, deps){
		if(deps){
			BaseElement.define.call(this, name, deps)
		}else{
			this.overrideGridStack();
			BaseElement.define.call(this, name);
		}
	}

	static overrideGridStack(){

		$.ui.draggable.prototype._getHandle = function( event ) {
			let {handle, handleFn} = this.options;
			let gridEl = this.element.closest('.grid-stack')[0];
			if(gridEl && gridEl.gridstack){
				handleFn = gridEl.gridstack.opts.draggable.handleFn;
			}
			console.log("handleFn", handleFn, this)
			console.dir(gridEl)
			if(typeof handleFn == 'function')
				return handleFn(event, this);

			return handle?!!$(event.target)
				.closest(this.element.find(handle)).length:true;
		}

		/*
		if(this._overrideGS)
			return

		console.dir(GridStackDD)
		this._overrideGS = true;
		//let proto = GridStack.prototype;

		GridStack.prototype.getElement = function(els = '.grid-stack-item') {
			console.log("elsxxxxxx111111", els)
	        return (typeof els === 'string' ?
	            (document.querySelector(els) || document.querySelector('#' + els) || document.querySelector('.' + els)) : els);
	    }
	    GridStack.prototype.getElements = function(els = '.grid-stack-item') {
	    	console.log("elsxxxxxx", els)
	        if (typeof els === 'string') {
	            let list = document.querySelectorAll(els);
	            if (!list.length) {
	                list = document.querySelectorAll('.' + els);
	            }
	            if (!list.length) {
	                list = document.querySelectorAll('#' + els);
	            }
	            return Array.from(list);
	        }
	        return [els];
	    }
	    GridStack.prototype.getGridItems = function() {
	    	console.log("getGridItems", this.el.children)
	        return Array.from(this.el.children)
	            .filter((el) => el.matches('.' + this.opts.itemClass) && !el.matches('.' + this.opts.placeholderClass));
	    }
	    */
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
		<style data-uid="${uid}"></style>
		<textarea data-uid="${uid}"></textarea>
		<div>
			<flow-btn @click="${this.saveGrid}">Save</flow-btn>
			<flow-btn @click="${this.loadGrid}">Load</flow-btn>
		</div>
		<div class="grid-stack ${uid} hide-w-opacity" style_="height:500px">
		  <div class="grid-stack-item" data-gs-id="a1" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
		    <flow-gridstack-panel class="grid-stack-item-content" heading="Panel 2">my first widget</flow-gridstack-panel>
		  </div>
		  <div class="grid-stack-item" data-gs-id="a2" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="1">
		    <flow-gridstack-panel class="grid-stack-item-content" heading="Test">another widget!</flow-gridstack-panel>
		  </div>
		</div>
		<slot></slot>`;
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
		let options = {
			alwaysShowResizeHandle:false,// /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			//ddPlugin:GridStackDDJQueryUI,
			resizable: {
			    handles: this.resizableHandles
			},
			minRow:1,
			cellHeight:this.cellHeight,
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
						return event.originalEvent.path.includes(handleEl);
					}

					return handle?!!$(event.target)
						.closest(uiDraggable.element.find(handle)).length:true;
				}
			}
		};
		dpc(()=>{
			//FlowGridStack.overrideGridStack();
			/*let self = this;
			/*
			$.ui.draggable.prototype._getHandle = function( event ) {
				let {handle, handlePanel, dragMode} = this.options;
				console.log("handle2", this.element[0], dragMode, handlePanel, this)
				if(self.dragMode=="panel" && handlePanel){
					handle = handlePanel;
				}else if(handle instanceof HTMLElement){
					//console.log("event.target", event.originalEvent, handle, this.element.find( handle ))
					return event.originalEvent.path.includes(handle);
				}
				return handle?!!$(event.target)
					.closest(this.element.find(handle)).length:true;
			}
			*/
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
		}, 100)
	}

	saveGrid(){
		let data = [];
		this.grid.engine.nodes.forEach(node=>{
			let state = null, nodeName = 'div';
			let el = node.el.querySelector(".grid-stack-item-content");
			if(el){
				nodeName = el.nodeName;
				if(el.getGridstackState)
					state = el.getGridstackState();
			}

			data.push({
				x: node.x,
				y: node.y,
				width: node.width,
				height: node.height,
				id: node.id,
				nodeName,
				state
			});
		});
		this.debugEl.value = JSON.stringify(data, null, '  ');
	}
	loadGrid(){
		let data = [];
		try{
			data = JSON.parse(this.debugEl.value);
		}catch(e){
			//data;
		}

		this.loadData(data);
	}
	loadData(data){
		let items = GridStack.Utils.sort(data);
		let {grid} = this;

		grid.batchUpdate();

		if (grid.engine.nodes.length === 0) {
			// load from empty
			items.forEach(item=>{
				this.addWidget(item)
			});
		} else {
			console.log("items", items)
			// else update existing nodes (instead of calling grid.removeAll())
			items.forEach(item=>{
				let node = grid.engine.nodes.find(n=>n.id == item.id);
				console.log("node", node, item)
				if(node){
					grid.update(node.el, item.x, item.y, item.width, item.height);
					this._updatePanelEl(node.el, item.state);
				}else{
					this.addWidget(item)
				}
			})
		}

		grid.commit();
	}
	addWidget(item){
		let nodeName = item.nodeName || 'div';
		let el = this.grid.addWidget(`<div data-gs-id="${item.id}">
			<${nodeName} class="grid-stack-item-content"></${nodeName}></div>`, item);
		this._updatePanelEl(el, item.state);
	}
	_updatePanelEl(el, state){
		if(!state)
			return
		el = el.querySelector(".grid-stack-item-content")
		if(!el || !el.setGridstackState)
			return
		el.setGridstackState(state);
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
    /*
    addCSSRule(selector, block){
    	let {sheet} = this.styleEl;
    	console.log("sheet.rules", sheet, sheet.rules);
    	[...sheet.rules].forEach((rule, i)=>{
    		console.log("rule, i", rule.selectorText, rule.style.cssText, i)
    	})
    }
    */
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

FlowGridStack.define('flow-gridstack',[baseUrl+'resources/extern/gridstack/gridstack.all.js']);
