import {BaseElement, html, css} from './base-element.js';

export const ContextGroups = new Map();

export class FlowContext extends BaseElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			type:{type:String, value:""},
			code:{type:String, value:""},
			group:{type:String, value:""}
		}
	}
	static get styles(){
		return css`
			:host{display:inline-block;padding:5px}
		`
	}
	static init(){
		let {group, code} = this.properties;
		group = group&&group.value;
		code = code&&code.value;
		console.log("FlowContext.init(): group && code", group, code, this.properties)
		if(group && code){
			let groupClass = ContextGroups.get(group);
			if(!groupClass)
				return false;
			groupClass.addContext(code, this);
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

export class FlowContextGroup extends BaseElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			group:{type:String, value:""}
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
		let {group} = this.properties;
		group = group&&group.value;
		if(group){
			if(!ContextGroups.has(group)){
				ContextGroups.set(group, this);
				this.define(`flow-ctxgroup-${group}`)
			}
		}
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

	static renderSelectionMenu(selected=[], cmp){
		let contexts = this.contexts;
		console.log("contexts", contexts)
		return html`
		<flow-menu selected="${selected}">
		${[...contexts.keys()].filter(code=>{
			let ctxClass = contexts.get(code);
			console.log("ctxClass.info", ctxClass.info)
			return ctxClass && cmp.acceptContext(ctxClass.info);
		}).map(code=>{
			return this.createContextNode(code, {"class":"menu-item", value:code});
		})}
		</flow-menu>
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

export const FlowContextListenerMixin = base=>{
	class FlowContextListener extends base{
		static get properties(){
			return {
				contextgroup:{type:String, value:""},
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
				group:this.contextgroup,
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
			let {contextgroup, contexts} = this;
			return Object.assign({}, super.serialize(), {
				contextgroup, contexts
			});
		}
		deserialize(data){
			super.deserialize(data);
			let {contextgroup, contexts=[]} = data||{};
			console.log("got contextgroup", contextgroup, data)
			this.contextgroup = contextgroup;
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

	render(){
		let cmp = this.getHostComponent();
		let contexts = [], GroupClass, group;
		let selected = [];
		if(cmp){
			let {contexts:selectedCtx=[], group:groupCode} = cmp.getContextManagerConfig();
			console.log("groupCode", groupCode)
			selected = selectedCtx;
			GroupClass = ContextGroups.get(groupCode);
			if(GroupClass){
				contexts = GroupClass.contexts;
				group = groupCode;
			}
		}
		return html`
		<dialog @close=${this.onDialogClose}>
			<div class="head">
				<span class="head-text">${this.heading||'Context Manager'}</span>
				<fa-icon class="close-icon" @click="${this.close}" icon="times"></fa-icon>
			</div>
			<div class="body">
				${GroupClass?GroupClass.renderSelectionMenu(selected, cmp):''}
			</div>
		</dialog>`;
	}

	firstUpdated(){
		this.dialog = this.renderRoot.querySelector('dialog');
		console.log("this.dialog", this.parentNode, this._show)
		if(this._show)
			this[this._show]();
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

