import {BaseElement, html, flowHtml, css, ScrollbarStyle, deepClone, render} from './base-element.js';
import {baseUrl, dpc} from './base-element.js';
export const FlowContextWorkspaces = new Map();
export const FlowContexts = new Map();

const boxStyle = css`
	:host{
		display:block;padding:5px;border-radius:3px;margin-top:5px;
		border:1px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
	}
	.head{
		display:flex;align-items:center;
		padding:5px;
	}
	.head .name{
		flex:1;overflow:hidden;text-overflow:ellipsis;
		margin-right:10px;
	}
	.head fa-icon{margin:5px;}
	fa-icon[disabled]{
		pointer-events:none;opacity:0.5;
	}
	fa-icon:not([disabled]){cursor:pointer}
`

let workspaceCount = 0;

export class FlowContextWorkspaceItem extends BaseElement{
	static get properties(){
		return {
			data:{type:Object},
			multi:{type:Boolean, reflect:true}
		}
	}
	static get styles(){
		return css`
			:host{
				display:flex;align-items:center;
			}
			:host([multi].item){
				padding:5px;margin:0px 2px 2px 0px;
				border-radius:3px;
				border:1px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
			}
		`
	}
	render(){
		let {data={name:""}} = this;
		//console.log("WorkspaceItem:data", this, this.parentNode, data.name, JSON.stringify(data))
		return html`${data.name||""}`
	}
}

FlowContextWorkspaceItem.define("flow-context-workspace-item");

export const objectToProperties = config=>{
	let props = {};
	for (const [key, value] of Object.entries(config)) {
		if(value.value !== undefined && value.type){
			props[key] = value;
			continue;
		}
		props[key] = {type:String, value};
	}

	return props;
}

export class ContextElement extends BaseElement{
	static get props(){
		if(!this._finalized){
			this.finalize();
			this._finalized = true;
		}
		let keys = [...this._classProperties.keys()];
		let properties = this.properties;
		let props = {}, ctor=this;
		while(properties && keys.length){
			[...keys].forEach(key=>{
				if(properties.hasOwnProperty(key)){
					let p = properties[key]
					if(p.hasOwnProperty('value')){
						props[key] = p.value;
						let index = keys.indexOf(key);
						//console.log("key, index:::", key, index, keys)
						keys.splice(index, 1);
						//console.log("key, index", key, index, keys)
					}
				}
			});
			ctor = ctor.__proto__;
			properties = ctor.properties;
		}


		/*
		let props2 = this._classProperties;
		let _props = {};
		props2.forEach((v, key)=>{
			_props[key] = v.value;
		})
		*/

		//console.log("propspropsprops", keys, props)

		return props;
	}
}

export class FlowContextElement extends ContextElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			code:{type:String, value:""},
			type:{type:String, value:""},
			config:{type:Object, value:{}},
			advance:{type:Boolean, reflect:true}
		}
	}
	static get styles(){
		return [boxStyle, css`
			:host{display:inline-block;padding:5px;margin:0px 5px 5px;}
			:host(:not([advance])) .remove-ctx-icon{display:none}
			:host(:not([advance])){border-color:transparent;}
		`]
	}
	static init(){
		this.config = this.props;
		let {code} = this.config;
		console.log("FlowContextElement:init", code, this.config)
		if(!FlowContexts.has(code)){
			FlowContexts.set(code, this);
			this.define(`flow-ctx-${code}`)
		}
	}

	render(){
		return html`
		<div class="head">
			<span class="name">${this.name||''}</span>
			<fa-icon class="remove-ctx-icon" icon="trash-alt"
				@click="${this.onRemoveClick}"></fa-icon>
		</div>
		${this.renderBody()}`
	}
	constructor(){
		super();
		this.initPropertiesDefaultValues();
	}
	fireNotification(){
		let args = this.buildConfig();
		this.fire("context-updated", args, {bubbles:true})
	}
	onRemoveClick(){
		this.fire("remove-ctx-request", {code:this.code}, {bubbles:true})
	}
	renderBody(){
		return '';
	}
	buildConfig(){
		let {code, type, name} = this;
		let result = {name, type, code};
		result.config = this.getConfig();
		return result;
	}
	setConfig(config){
		this.config = config;
	}
	getConfig(){
		return this.config || {};
	}
}

export class FlowContextWorkspaceElement extends ContextElement{
	static get properties(){
		return {
			name:{type:String, value:""},
			code:{type:String, value:""},
			contexts:{type:Array, value:[]},
			readonly:{type:Boolean, value:false},
			advance:{type:Boolean, reflect:true}
		}
	}

	static init(){
		this.config = this.props;
		let {code} = this.config;
		console.log("FlowContextWorkspaceElement:init", code, this.properties)
		if(code){
			if(!FlowContextWorkspaces.has(code)){
				FlowContextWorkspaces.set(code, this);
				this.define(`flow-ctxworkspace-${code}`)
			}
		}
	}
	static createContextNode(code, attr, props){
		/*
		let el = this.createElement(`flow-ctx-${code}`, attr, props);
		el.classList.add("flow-context");
		return el;
		*/
		let testValue = 123;
		let tags = new Map();
		tags.set("tag", `flow-ctx-${code}`);
		//tags.set("attr1", code)
		return flowHtml`${tags}<{tag} ?advance=${attr.advance}
			.config=${props.config||{}} class="flow-context"></{tag}>`;
	}
	static createContextWorkspaceNode(code, attr, props){
		/*
		let el = this.createElement(`flow-ctxworkspace-${code}`, attr, props);
		el.classList.add("flow-workspace");
		return el;
		*/
		let tags = new Map();
		tags.set("tag", `flow-ctxworkspace-${code}`);
		const {manager} = props;

		return flowHtml`${tags}<{tag} ?advance=${manager.advance}
			.manager=${manager} class="flow-workspace"></{tag}>`;
	}
	static get styles() {
		return [boxStyle, css`
			:host(:not([advance])) .head {
				display:none
			}
		`]
	}
	

	render(){
		let hasAddable = this.getAddableContexts().length
		return html`
		<div class="head">
			${this.renderHeadPrefix()}
			<span class="name">
				<flow-input ?readonly=${this.readonly} label="Workspace Name" @changed="${this.onNameChange}"
					class="name-input" .value="${this.name}" pattern="^.{3,20}$">
				</flow-input>
			</span>
			${this.renderHeadTools({hasAddable})}
		</div>
		${this.renderContexts()}`
	}
	renderHeadPrefix(){
		return '';
	}
	renderHeadTools({hasAddable}){
		let isDirty = this.isDirty();
		return html`<fa-icon icon="plus-circle" ?disabled=${!hasAddable} 
			@click="${this.onAddContextClick}"></fa-icon>
		<fa-icon icon="times" class="reset-workspace-btn" title="Reset"
			?disabled=${!isDirty} @click="${this.onResetClick}"></fa-icon>
		${this.manager.multiWorkspace?html`<fa-icon icon="trash-alt" 
			title="Remove Workspace" @click="${this.onRemoveWorkspaceClick}"></fa-icon>`:''}`;
	}

	renderContexts(){
		let contexts = this.manager.filterContexts(this.getContexts());
		this.log("render:contexts", contexts, JSON.stringify(this.constructor.config))
		return html`
		<div class="contexts" @remove-ctx-request=${this.onRemoveContext}
			@context-updated=${this.onContextUpdate}>
			${contexts.map(ctx=>{
				return this.constructor.createContextNode(ctx.code, {
					advance:this.advance
				}, {
					config: Object.assign({}, ctx.config||{})
				})
				/*let el = this.constructor.createContextNode(ctx.code);
				if(!el.setConfig){
					console.log("el.setConfig missing", el)
				}
				el.setConfig(Object.assign({}, ctx.config||{}));
				return el;*/
			})}
		</div>`
	}

	getContexts(){
		let klass;
		return (this.contexts||[]).map(ctx=>{
			klass = FlowContexts.get(ctx.code);
			if(!klass)
				return
			//console.log("ctx", klass.config, JSON.stringify(ctx))
			return Object.assign({}, klass.config, ctx);
		}).filter(ctx=>!!ctx);
	}

	isDirty(){
		let {config, defaultConfig} = this.constructor;
		let hash1 = this.makeHash(config);
		let hash2 = this.makeHash(defaultConfig);
		console.log("hash1 != hash2\n"+hash1+"\n----\n"+hash2)
		return hash1 != hash2;
	}
	makeHash(obj){
		return JSON.stringify(obj);
	}

	buildConfig(){
		let {name, code} = this; 
		let config = {name, code};
		this.getPropsKeys().forEach(key=>{
			if(key != 'contexts')
				config[key] = this[key];
		})
		config.contexts = this.buildContextConfig();
		return config;
	}
	buildContextConfig(){
		let contexts = this.renderRoot.querySelectorAll(".flow-context");
		contexts = [...contexts].map(ctx=>ctx.buildConfig());
		this.log("buildContextConfig:contexts", contexts)
		return contexts;
	}

	onNameChange(e){
		if(e.detail.value.length < 3)
			return
		this.name = e.detail.value;
	}

	onRemoveContext(e){
		let index = this.contexts.findIndex(c=>c.code == e.detail.code);
		if(index >-1){
			this.contexts.splice(index, 1);
			this.requestUpdate("contexts")
		}
	}

	getAddableContexts(){
		console.log("getAddableContexts:this.contexts", this.contexts)
		return this.manager.filterContexts([...FlowContexts.values()].map(ctx=>ctx.config).filter(ctx=>{
			return !this.contexts.find(c=>c.code==ctx.code)
		}));
	}

	onResetClick(e){
		let config = deepClone(this.constructor.defaultConfig, true)
		this.initConfig(config)
	}

	onAddContextClick(e){
		//this.fire('add-context', {code:this.code}, {bubbles:true})
		let items = this.getAddableContexts();
		//console.log("items", items)
		let body = html`<flow-menu data-name="contexts" multiple>
			${items.map(item=>{
				return html`<flow-menu-item value="${item.code}">${item.name}</flow-menu-item>`
			})}
			</flow-menu>`;

		FlowDialog.show({
			title:'Select Context',
			body,
			hideCloseBtn:true,
			compact:true,
			btns:[{
				text:"Close",
				handler:(resolve, result)=>{
					resolve();
				}
			},{
				text:"Done",
				cls:"primary",
				handler:(resolve, result)=>{
					resolve();
					let {contexts} = result.values;
					contexts = contexts.map(code=>{
						return {code};
					})
					console.log("result", contexts)
					if(contexts.length)
						this.contexts = [...contexts, ...this.contexts];
				}
			}]
		});
	}

	constructor(){
		super();
		//this.initPropertiesDefaultValues();
		this.initConfig(this.constructor.config);
		this.saveState()
	}

	initConfig(config){
		Object.entries(config).forEach(([key, value])=>{
			console.log("initConfig", key+"=>", value)
			this[key] = value;
		});
	}

	updated(changes){
		super.updated(changes)
		this.updateStaticValues();
		let ctor = this.constructor;
		if(!ctor.defaultConfig){
			ctor.defaultConfig = deepClone(ctor.config)
			this.recheckDirty();
		}
	}
	recheckDirty(){
		let btn = this.renderRoot.querySelector('.reset-workspace-btn');
		if(!btn)
			return
		console.log("this.isDirty()", this.isDirty())
		if(this.isDirty())
			btn.removeAttribute('disabled')
		else
			btn.setAttribute('disabled', true)
	}
	onContextUpdate(){
		this.updateStaticValues();
		this.recheckDirty()
	}
	getPropsKeys(extraKeys=[]){
		return ["name", "contexts", "readonly"].concat(extraKeys);
	}
	updateStaticValues(){
		this.updatePropValues(this.getPropsKeys());
	}
	updatePropValues(keys){
		let props = this.constructor.config;
		keys.forEach(key=>{
			if(key == "contexts"){
				props[key] = this.buildContextConfig();
				return
			}
			props[key] = this[key];
		});
		this.fireUpdateNotification();
	}
	buildNotificationArgs(){
		let {code} = this;
		let args = {code};
		let props = this.constructor.config;
		this.getPropsKeys().forEach(key=>{
			args[key] = props[key];
		})
		return args;
	}
	fireUpdateNotification(){
		let props = this.buildNotificationArgs();
		if(!this.validateNotificationHash(props))
			return
		this.fire("workspace-updated", {props, el:this}, {bubbles:true})
	}
	validateNotificationHash(props){
		let hash = JSON.stringify(props);
		if(this._hash == hash){
			//this.log("this._hash == hash\n"+this._hash+"\n--------\n"+hash)
			return false;
		}
		this._hash = hash;
		return true;
	}
	saveState(){
		this._hash = JSON.stringify(this.buildNotificationArgs());
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

export const CreateFlowContextWorkspace = (config, base)=>{
	let props = objectToProperties(config);
	class klass extends (base||FlowContextWorkspaceElement){
		static get properties(){
			return props;
		}
		_initLog(forceLog){
			super._initLog(forceLog, `FlowContextWorkspace:${config.code}`);
		}
	}

	klass.init();
}

export const FlowContextListenerMixin = base=>{
	class FlowContextListener extends base{
		static get properties(){
			return {
				ctxworkspaces:{type:Array, value:[]},
				multiWorkspace:{type:Boolean}
			}
		}

		constructor(){
			super();
			this.registerListener("flow-ctxworkspace-updated", this.onContextUpdate.bind(this));
		}

		acceptContext(context){
			return !!context.type;
		}
		onContextUpdate(e){
			let {props} = e.detail;
			console.log("onContextUpdate:props", props, e)
			let workspaces = this.ctxworkspaces||[];
			if(workspaces.includes(props.code))
				this.contextsUpdate();
		}
		contextsUpdate(){
			this.requestUpdate("ctxworkspaces", null)
		}
		getContextManagerConfig(){
			return {
				workspaces:this.ctxworkspaces||[],
				multiWorkspace:!!this.multiWorkspace
			}
		}
		setContextManagerConfig(config){
			let {workspaces} = config;
			this.ctxworkspaces = workspaces;
			this.contextsUpdate();
		}

		openContextManager(){
			Manager.open(this);
		}

		getContextWorkspaces(){
			let workspaces = this.ctxworkspaces||[];
			return workspaces.map(code=>{
				let workspace = (FlowContextWorkspaces.get(code)||{}).config;
				if(!workspace)
					return false;
				workspace = Object.assign({}, workspace)
				workspace.contexts = (workspace.contexts||[]).map(ctx=>{
					let klass = FlowContexts.get(ctx.code);
					if(!klass)
						return false;
					return Object.assign({}, klass.config, ctx);
				}).filter(ctx=>this.acceptContext(ctx))
				return workspace;
			}).filter(w=>w);
		}

		serialize(){
			let {ctxworkspaces} = this;
			return Object.assign({}, super.serialize(), {
				ctxworkspaces
			});
		}
		deserialize(data){
			super.deserialize(data);
			let {ctxworkspaces=[]} = data||{};
			//console.log("got contexts", data)
			this.ctxworkspaces = ctxworkspaces;
			this.contextsUpdate();
		}
	}

	return FlowContextListener;
}

export class FlowContextManager extends BaseElement{
	static get properties(){
		return {
			selected:{type:Array, value:[]},
			isLoading:{type:Boolean},
			advance:{type:Boolean, reflect:true, value:true}
		}
	}

	static get styles(){
		return [ScrollbarStyle, css `
			:host{--fa-icon-size:20px;}
			dialog{
				display:flex;padding:0px;height:700px; top:2vh;
				width:800px;max-width:95vw;
				max-height:95vh;flex-direction:column;
			    border:var(--flow-context-manager-dialog-border, 2px solid var(--flow-primary-color, #025763));
			    border-radius:var(--flow-context-manager-dialog-border-radius, 4px);
			    min-width:var(--flow-context-manager-dialog-min-width, 300px);
			    min-height:var(--flow-context-manager-dialog-min-height, 200px);
			    background-color:var(--flow-context-manager-dialog-bg, var(--flow-dialog-background-color, var(--flow-background-color)));
			    color:var(--flow-context-manager-dialog-color, var(--flow-dialog-color, var(--flow-color)));
			    box-shadow:var(--flow-box-shadow);
			}
			dialog:not([open]){display:none}
			.head,.header{
				display:flex;align-items:center;justify-content:center;
				padding:var(--flow-context-manager-head-padding, 10px);
				line-height:1.3;
			}
			.header{
				justify-content:flex-end;min-height:72px
			}
			.head-text{
				flex:1;overflow:hidden;text-overflow:ellipsis;
				font-size:var(--flow-context-manager-head-text-font-size, 1.2rem);
				margin-right:15px;
			}
			.header{
				padding:var(--flow-context-manager-header-padding, 0px 5px);
			}
			.workspace-selector{
				flex:1;--flow-selector-dropdown-width:100%;
				--flow-select-selected-max-width:100%;
			}
			.close-icon{cursor:pointer;--fa-icon-size:20px;}
			.body{
				padding:var(--flow-context-manager-body-padding, 10px);
				flex:1;overflow:auto;
			}
			.buttons{
			    margin:10px;display:flex;flex-wrap:wrap;justify-content:flex-end;
			}
			.buttons flow-btn{margin:0px 5px;align-items:center;display:flex;}
			.buttons flow-btn:last-child{margin-right:0px;}
			.buttons flow-btn:first-child{margin-left:0px;}
			dialog[loading]:after{
				content:"";z-index:10000;
				position:absolute;left:0px;top:0px;width:100%;height:100%;
				background-color:var(--flow-context-manager-loading-mask-bg, rgba(0,0,0, 0.5))
			}
			:host(:not([advance])) .advance-tools,
			[hidden]{
				display:none;
			}
			:host([advance]) flow-btn.toggle-advance-mode-btn{
				background-color:var(--flow-primary-color);
				color:var(--flow-primary-invert-color);
				--fa-icon-color:var(--flow-primary-invert-color);
			}
		`];
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
		<link rel="stylesheet" type="text/css" href="${baseUrl}/resources/extern/dialog/dialog-polyfill.css" />
		<dialog @close=${this.onDialogClose} ?loading=${this.isLoading} ?advance=${this.advance}>
			<div class="head">
				<span class="head-text">${this.heading||'Context Manager'}</span>
				<fa-icon class="close-icon" @click="${this.onCloseClick}" icon="times"></fa-icon>
			</div>
			<div class="header">
				${this.renderWorkspaceSelector()}
				${this.renderHeaderTools()}
			</div>
			<div class="body" @workspace-updated="${this.onWorkspaceUpdate}">
				${this.renderWorkspaces()}
			</div>
			<div class="buttons">
				<flow-btn @click="${this.onCloseClick}">Close</flow-btn>
				<flow-btn @click="${this.onDoneClick}" class="primary">Done</flow-btn>
			</div>
		</dialog>`;
	}

	constructor(){
		super();
		this.restoreWorkspaces();
		this.initPropertiesDefaultValues();
	}

	renderWorkspaceSelector(){
		let workspaces = [...FlowContextWorkspaces.values()].map(w=>w.config);
		console.log("this.selected", this.selected)
		return html`<flow-selector class="workspace-selector advance-tools" label="Select Workspace"
			?multiple=${this.multiWorkspace} .selected="${this.selected.slice(0)}"
			@select="${this.onWorkspacesSelectionChange}">
			${workspaces.map(w=>{
				return this.renderWorkspaceItem(w);
			})}
		</flow-selector>`
	}
	renderWorkspaceItem(w){
		return html`<flow-context-workspace-item 
					value="${w.code}" ?multi=${this.multiWorkspace}
					class="menu-item" data-text="${w.name}" .data="${w}"></flow-context-workspace-item>`
	}

	renderHeaderTools(){
		return html`
		<flow-btn class="advance-tools add-workspace-btn" title="Add workspace"  
			@click="${this.onCreateWorkspaceClick}" >
			<fa-icon icon="plus"></fa-icon>
		</flow-btn>
		<!--flow-btn class="close-panel-btn" title="Remove Panel" 
			@click="${this.onClosePanelClick}" >
			<fa-icon icon="times"></fa-icon>
		</flow-btn>
		<flow-btn class="toggle-advance-mode-btn" title="Toggle advance mode"
			@click="${this.onToggleModeClick}" >
			<fa-icon icon="cogs"></fa-icon>
		</flow-btn-->`
	}

	renderWorkspaces(){
		let workspaces = this.getWorkspacesConfig();
		let nodes = workspaces.map(w=>{
			return FlowContextWorkspaceElement.createContextWorkspaceNode(w.code, {}, {
				manager:this
			})
		});
		return nodes;
	}

	buildNewWorkspaceConfig(config){
		return Object.assign({
			name:`Workspace ${++workspaceCount}`,
			code:`workspace${(Math.random()*10000).toFixed(0)}`,
			contexts:[]
		}, config||{});
	}

	createNewWorkspace(baseClass){
		let config = this.buildNewWorkspaceConfig();
		CreateWorkspace(config, baseClass);
		return config;
	}

	filterContexts(contexts){
		let cmp = this.getHostComponent();
		if(!cmp)
			return [];
		return (contexts||[]).filter(ctx=>cmp.acceptContext(ctx))
	}

	saveWorkspace(props){
		let workspaces = [];
		FlowContextWorkspaces.forEach(klass=>{
			let config = Object.assign({}, klass.config);
			workspaces.push(config);
		});
		this.saveWorkspacesConfig(workspaces);
	}

	saveWorkspacesConfig(workspaces){
		this.constructor.setLocalSetting("ctxworkspaces", JSON.stringify(workspaces))
	}

	fetchWorkspacesConfig(){
		return new Promise((resolve, reject)=>{
			let data = JSON.parse(this.constructor.getLocalSetting("ctxworkspaces", "[]"))
			//just to test delay in loading
			setTimeout(()=>{
				resolve(data)
			}, 1000);
		})
	}
	restoreWorkspaces(){
		this.isLoading = true;
		let p = this.fetchWorkspacesConfig();
		p.then(workspaces=>{
			this.loadWorkspacesConfig(workspaces)
		},err=>{

		}).catch((e)=>{

		}).finally(()=>{
			this.isLoading = false;
		})
		
	}
	loadWorkspacesConfig(workspaces){
		console.log("loadWorkspacesConfig:workspaces", workspaces)
		workspaces.forEach(workspace=>{
			CreateWorkspace(workspace)
		});
		this.requestUpdate("_workspace", null)
	}

	onWorkspaceUpdate(e){
		let {props} = e.detail;
		this.saveWorkspace(props);
		this.fire("flow-ctxworkspace-updated", {props}, {}, window);
	}

	onToggleModeClick(){
		this.advance = !this.advance;
	}

	onClosePanelClick(){
		let cmp = this.getHostComponent();
		if(!cmp || !cmp.onClosePanelClick)
			return

		let e = cmp.onClosePanelClick();
		dpc(100, ()=>{
			//console.log("e:::", e, e.defaultPrevented)
			if(e.defaultPrevented)
				return
			this.close();
		})
		
	}

	onCreateWorkspaceClick(){
		let config = this.createNewWorkspace();
		if(this.multiWorkspace){
			this.selected.push(config.code);
			this.requestUpdate("workspaces", null)
		}else{
			this.selected = [config.code]
		}
		console.log("onCreateWorkspaceClick", FlowContextWorkspaces, this.selected)
	}

	onWorkspacesSelectionChange(e){
		let {selected} = e.detail;
		if(!Array.isArray(selected)){
			if(selected)
				selected = [selected]
			else
				selected = [];
		}
		this.selected = selected;
		console.log("Workspaces:selected", selected)
	}
	getWorkspacesConfig(){
		let cmp = this.getHostComponent();
		if(!cmp)
			return [];
		let config = [];
		//let {workspacesMap} = this;
		this.selected.map(wCode=>{
			let workspace = (FlowContextWorkspaces.get(wCode)||{}).config;
			if(!workspace)
				return
			/*
			let workspaceConfig = workspacesMap.get(wCode);
			if(workspaceConfig){
				console.log("workspaceConfig", workspaceConfig)
				config.push(workspaceConfig);
				return
			}
			*/
			workspace = Object.assign({}, workspace);
			workspace.contexts = workspace.contexts.filter(ctx=>{
				return FlowContexts.get(ctx.code||ctx)
			}).filter(cmp.acceptContext)
			config.push(workspace);
		});

		return config;
	}

	firstUpdated(){
		this.dialog = this.renderRoot.querySelector('dialog');
		dialogPolyfill.registerDialog(this.dialog);
		if(this._show)
			this[this._show]();
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
		let fromCloseEvent = !cmp;
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

		if(!fromCloseEvent)
			this.setHostComponent(cmp);
		this._show = 'showModal';
		if(this.dialog){
			console.log(this.dialog)
			return this.dialog.showModal();
		}
	}

	setHostComponent(cmp){
		this._cmp = cmp;
		if(cmp){
			let {workspaces, multiWorkspace} = cmp.getContextManagerConfig();
			this.selected = workspaces.map(w=>w.code||w);
			this.workspaces = workspaces;
			this.multiWorkspace = !!multiWorkspace;
		}else{
			this.selected = [];
			this.workspaces = [];
			this.multiWorkspace = false;
		}

		/*
		let {workspaces=[]} = this;
		this.workspacesMap = new Map();
		workspaces.forEach(workspace=>{
			this.workspacesMap.set(workspace.code, workspace);
			/*
			let {contexts=[]} = workspace;
			workspace.contexts = new Map();
			contexts.map(ctx=>{
				workspace.contexts.set(ctx.code, ctx);
			})
			* /
		})*/
	}
	getHostComponent(){
		return this._cmp;
	}

	onCloseClick(){
		this.close();
	}

	buildConfig(){
		let workspaces = this.renderRoot.querySelectorAll(".flow-workspace");
		//return [...workspaces].map(w=>w.buildConfig());
		return [...workspaces].map(w=>w.code);
	}

	onDoneClick(){
		let cmp = this.getHostComponent();
		if(!cmp){
			this.close();
			return
		}
		let workspaces = this.buildConfig();
		console.log("workspaces-config", workspaces);

		cmp.setContextManagerConfig({workspaces});
		this.close();
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

let Manager = FlowContextManager;
let CreateWorkspace = CreateFlowContextWorkspace;
export const SetFlowContextManger = manager=>{
	Manager = manager;
}
export const SetFlowContextWorkspaceCreator = creator=>{
	CreateWorkspace = creator;
}

