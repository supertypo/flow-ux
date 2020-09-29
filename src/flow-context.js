import {BaseElement, html, css} from './base-element.js';

export const objectToProperties = config=>{
	let props = {};
	for (const [key, value] of Object.entries(config)) {
		if(value.value !== undefined && value.type){
			props[key] = value;
			continue;
		}
		let type = String;
		if(key == "groups"){
			type = Array;
		}
		props[key] = {type, value};
	}

	return props;
}

export const ContextGroups = new Map();

export class FlowContextElement extends BaseElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			type:{type:String, value:""},
			code:{type:String, value:""},
			groups:{type:Array, value:[]}
		}
	}
	static get styles(){
		return css`
			:host{display:inline-block;padding:5px}
		`
	}
	static init(){
		let {groups, code} = this.properties;
		groups = groups&&groups.value;
		code = code&&code.value;
		//console.log("FlowContext.init(): groups && code", groups, code, this.properties)
		if(groups && groups.length && code){
			groups.forEach(group=>{
				let groupClass = ContextGroups.get(group);
				if(!groupClass)
					return false;
				groupClass.addContext(code, this);
			})
			
		}
	}

	static get info(){
		let info = {};
		Object.keys(this.properties).forEach(key=>{
			info[key] = this.properties[key].value;
		});
		return info;
	}

	render(){
		return html`${this.name||''}`
	}
	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}
}

export class FlowContextGroupElement extends BaseElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			code:{type:String, value:""}
		}
	}
	static get contexts(){
		if(!this._contexts)
			this._contexts = new Map();
		return this._contexts;
	}
	static addContext(code, klass){
		if(!this.contexts.has(code)){
			this.contexts.set(code, klass);
			klass.define(`flow-ctx-${code}`)
		}
	}
	static init(){
		let {code} = this.properties;
		code = code&&code.value;
		if(code){
			if(!ContextGroups.has(code)){
				ContextGroups.set(code, this);
				this.define(`flow-ctxgroup-${code}`)
			}
		}
	}
	static get info(){
		let info = {};
		Object.keys(this.properties).forEach(key=>{
			info[key] = this.properties[key].value;
		});
		return info;
	}
	static get styles(){
		return css`
			:host{display:inline-block;padding:5px}
		`
	}

	static createContextNode(code, attr, props){
		return this.createElement(`flow-ctx-${code}`, attr, props);
	}
	static createContextGroupNode(group, attr, props){
		return this.createElement(`flow-ctxgroup-${group}`, attr, props);
	}

	static renderSelectionMenu(selected=[], cmp, options){
		let {multiple} = options||{};
		let contexts = this.contexts;
		console.log("renderSelectionMenu:contexts", contexts, selected)
		let filteredCtxs = [...contexts.keys()].filter(code=>{
			let ctxClass = contexts.get(code);
			//console.log("ctxClass.info", ctxClass.info)
			return ctxClass && cmp.acceptContext(ctxClass.info);
		});
		let info = this.info;
		return html`
		<div class="group">
			<div class="group-head">${info.name||""}</div>
			<flow-menu class="ctx-selection-menu" .selected="${selected}" 
				?multiple=${multiple}>
				${filteredCtxs.map(code=>{
					return this.createContextNode(code, {
						"class":"menu-item",
						value:code
					});
				})}
			</flow-menu>
		</div>
		`
	}

	render(){
		let contexts = this.constructor.contexts;
		console.log("contexts", contexts)
		return html`${[...contexts.keys()].map(code=>{
			return this.constructor.createContextNode(code);
		})}`
	}

	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}
}

export const FlowContext = (config, base)=>{
	let props = objectToProperties(config);
	class klass extends (base||FlowContextElement){
		static get properties(){
			return props;
		}
	}

	klass.init();
}

export const FlowContextGroup = (config, base)=>{
	let props = objectToProperties(config);
	class klass extends (base||FlowContextGroupElement){
		static get properties(){
			return props;
		}
	}

	klass.init();
}

export const FlowContextListenerMixin = base=>{
	class FlowContextListener extends base{
		static get properties(){
			return {
				contextgroups:{type:Array, value:[]},
				contexts:{type:Array, value:[]}
			}
		}
		acceptContext(context){
			return !!context.type;
		}
		onContextsUpdate(){
			//
		}
		getContextManagerConfig(){
			return {
				groups:this.contextgroups,
				contexts:this.contexts||[]
			}
		}
		setContextManagerConfig(config){
			let {contexts} = config;
			this.contexts = contexts;
			this.onContextsUpdate();
		}

		openContextManager(){
			FlowContextManager.open(this);
		}

		serialize(){
			let {contextgroups, contexts} = this;
			return Object.assign({}, super.serialize(), {
				contextgroups, contexts
			});
		}
		deserialize(data){
			super.deserialize(data);
			let {contextgroups, contexts=[]} = data||{};
			console.log("got contextgroups", contextgroups, data)
			this.contextgroups = contextgroups;
			this.contexts = contexts;
		}
	}

	return FlowContextListener;
}

export class FlowContextManager extends BaseElement{
	static get properties(){
		return {

		}
	}

	static get styles(){
		return css `
			:host{display:block;background-color:#F00}
			dialog{
				padding:0px;
			    border:var(--flow-context-manager-dialog-border, 2px solid var(--flow-primary-color, #025763));
			    border-radius:var(--flow-context-manager-dialog-border-radius, 4px);
			    min-width:var(--flow-context-manager-dialog-min-width, 300px);
			    min-height:var(--flow-context-manager-dialog-min-height, 200px);
			}
			.head{
				display:flex;align-items:center;justify-content:center;
				padding:var(--flow-context-manager-head-padding, 10px);
			}
			.head-text{
				flex:1;overflow:hidden;text-overflow:ellipsis;
				font-size:var(--flow-context-manager-head-text-font-size, 1.2rem);
				margin-right:15px;
			}
			.close-icon{cursor:pointer;--fa-icon-size:20px;}
			.body{
				padding:var(--flow-context-manager-body-padding, 10px);
			}
		`;
	}

	static get _tagName(){
		return 'flow-context-manager';
	}

	static getContextManager(){
		let ctxManger = document.querySelector(this._tagName);
		if(ctxManger)
			return ctxManger;
		ctxManger = document.createElement(this._tagName);
		document.body.appendChild(ctxManger);
		return ctxManger;
	}

	static open(cmp){
		let ctxManger = this.getContextManager();
		ctxManger.showModal(cmp)
	}

	render(){
		return html`
		<dialog @close=${this.onDialogClose}>
			<div class="head">
				<span class="head-text">${this.heading||'Context Manager'}</span>
				<fa-icon class="close-icon" @click="${this.close}" icon="times"></fa-icon>
			</div>
			<div class="body" @select="${this.onCtxSelectionChange}">
				${this.renderSelectionMenus()}
			</div>
		</dialog>`;
	}

	renderSelectionMenus(){
		let cmp = this.getHostComponent();
		if(!cmp)
			return '';
		let items = [], options, GroupClass;
		let {contexts:selected=[], groups, groupOptions} = cmp.getContextManagerConfig();
		if(!groupOptions)
			groupOptions = new Map();
		groups.forEach(groupCode=>{
			GroupClass = ContextGroups.get(groupCode);
			if(GroupClass){
				options = groupOptions.get(groupCode);
				console.log("selected", selected)
				items.push(GroupClass.renderSelectionMenu(selected, cmp, options));
			}
		});

		return items;
	}

	firstUpdated(){
		this.dialog = this.renderRoot.querySelector('dialog');
		if(this._show)
			this[this._show]();
	}

	onCtxSelectionChange(){
		let menus = this.renderRoot.querySelectorAll('.ctx-selection-menu');
		let contexts = [];
		menus.forEach(menu=>{
			let context = menu.value;
			if(!context)
				return
			if(Array.isArray(context))
				contexts.push(...context)
			else
				contexts.push(context);
		});

		console.log("contexts", contexts)
		let cmp = this.getHostComponent();
		if(!cmp)
			return
		cmp.setContextManagerConfig({contexts})
	}

	onDialogClose(e){
		if(this._show){
			this[this._show]();
			return
		}
		let detail = {e};
		this.dispatchEvent(new CustomEvent('closed', {detail}))
	}

	showModal(cmp){
		cmp = cmp || this.getHostComponent();
		if(!cmp)
			return
		let missingFn = [
			'getContextManagerConfig',
			'setContextManagerConfig',
			'acceptContext'
		].find(fn=>{
			return (typeof cmp[fn] != 'function');
		});

		if(missingFn)
			return this.log("showModal: missing function", missingFn);

		this.setHostComponent(cmp);
		this._show = 'showModal';
		if(this.dialog){
			console.log(this.dialog)
			return this.dialog.showModal();
		}
	}

	setHostComponent(cmp){
		this._cmp = cmp;
		this.requestUpdate('_cmp');
	}
	getHostComponent(){
		return this._cmp;
	}

	close(){
		this._show = false;
		this.setHostComponent(null);
		if(this.dialog)
			this.dialog.close();
	}

	destroy(){
		this.close();
		this.remove();
	}
}

FlowContextManager.define(FlowContextManager._tagName)

