import {dpc, UID, setTheme, getTheme} from './helpers.js';
import {FlowSocketIORPC} from './flow-socketio-rpc.js';
import {FlowSocketIONATS} from './flow-socketio-nats.js';

import {BaseElement, ScrollbarStyle, html, css} from './base-element.js';

/**
* @class FlowApp
* @extends BaseElement
* @example <flow-app></flow-app>
* 
* @property {String} ["menu-icon"] 
* @property {Boolean} [floating-drawer]
* @property {Boolean} [open-drawer]
* @cssvar {font-family} [--flow-btn-font-family=var(--flow-font-family, initial)]
* @cssvar {width} [--flow-app-width=100vw]
* @cssvar {height} [--flow-app-height=100vh]
* @cssvar {align-items} [--flow-app-header-align-items=center]
* @cssvar {height} [--flow-app-header-height=60px]
* @cssvar {background-color} [--flow-app-header-bg=#161926]
* @cssvar {color} {--flow-app-header-color=#91aec1]
* @cssvar {padding} [--flow-app-header-padding=0px 100px]
* @cssvar {padding} [--flow-app-header-link-padding=0px 0px 0px 16px]
* @cssvar {color} [--flow-app-header-color=#91aec1]
* @cssvar {background-color} [--flow-app-drawer-bg=var(--flow-background-color, inherit)]
* @cssvar {color} [--flow-app-drawer-color=var(--flow-color, inherit)]
* @cssvar {width} [--flow-app-drawer-width=300px]
* @cssvar {overflow} [--flow-app-drawer-overflow=initial]
* @cssvar {transition} [--flow-app-drawer-transition=left 0.5s ease]
* @cssvar {z-index} [--flow-app-drawer-z-index=10001]
* @cssvar {left} [--flow-app-drawer-hidden-left=-500px]
* @cssvar {transition} [--flow-app-drawer-transition=right 0.5s ease]
* @cssvar {right} [--flow-app-drawer-hidden-right=-500px]
* @cssvar {overflow} [--flow-app-main-overflow=auto]
* @cssvar {position} [--flow-app-main-position=initial]
* @cssvar {display} [--flow-app-main-display=initial]
* @cssvar {align-items} (--flow-app-main-align-items=stretch]
* @cssvar {justify-content} [--flow-app-main-align-justify-content=space-between);
* @cssvar {height} [--flow-app-header-height=60px]
* @cssvar {padding} --flow-app-header-padding=0px 100px]
* @cssvar {z-index} --flow-app-body-mask-z-index=10000]
* @cssvar {background-color} [--flow-app-body-mask-bg=initial]
* @cssvar {padding} [--flow-app-header-sm-padding=0px 15px]
* #cssvar {overflow} [--flow-app-body-overflow=hidden]
*/
	// {--fa-icon-color} [--flow-app-drawer-close-icon-color=var(--flow-color)]
	// {--fa-icon-color} [--flow-app-menu-icon-color=var(--flow-color)]		
	// {--flow-dropdown-trigger-bg} [--flow-app-header-bg=#161926]
	// {--flow-dropdown-trigger-color} [--flow-app-header-color=#91aec1]
	// {--flow-dropdown-trigger-hover-color} [--flow-app-header-color=#91aec1]
export const FlowAppMixin = (baseClass)=>{
	class base extends baseClass{
		constructor(...args) {
			super(...args)
			this.uid = UID();
			this.setTheme(this.getTheme("light"));
		}

		getTheme(defaultTheme){
			return getTheme(defaultTheme);
		}

		setTheme(theme){
			setTheme(theme);
		}

		initSocketIORPC(){
			return new Promise((resolve, reject) => {
				this.rpc = new FlowSocketIORPC({
					path:"/rpc"
				});

				this.rpc.on("init", ()=>{
					this.log("RPC:init");
					this.onNetworkIfaceOnline();
					resolve();
					// this.rpc.dispatch("rpc-test-1", {key:"value-1"});
					// this.rpc.dispatch("rpc-test-2", {key:"value-2"}, (err, data)=>{
					// 	console.log("rpc-test-2: err, data", err, data)
					// })
				})
			})
		}

		// taken from BaseElement...
		fireEvent(eventName, detail={}, options={}){
			let ev = new CustomEvent(eventName, Object.assign({}, options, {detail}));
			return window.dispatchEvent(ev);
		}
	
		initSocketIONATS(options={}){
			return new Promise((resolve, reject) => {
				this.nats = new FlowSocketIONATS(Object.assign({
					path:"/nats"
				}, options));

				this.nats.on("init", ()=>{
					this.log("NATS:init");
					this.onNetworkIfaceOnline();
					resolve();
					// this.rpc.dispatch("rpc-test-1", {key:"value-1"});
					// this.nats.request("nats.hello", {key:"origin-client-init"}, (err, data)=>{
					// 	console.log("nats-test-reponse: err, data", err, data);
					// })
				})

				this.nats.on('disconnected', () => {
					console.log("disconnected...");
					this.onNetworkIfaceOffline();
				})
			})
		}

		setLoading(isLoading=true, el=null){
			(el || document.body).classList.toggle("loading", isLoading)
		}

		initLog(...args){
			if(super._initLog)
				return super._initLog(...args)
			const name = this.constructor.name;
			this.log = Function.prototype.bind.call(
				console.log,
				console,
				`%c[${name}]`,
				`font-weight:bold;color:#41c7ef`
			);
		}

		onNetworkIfaceOnline(){
			this._online = true;
			this.fireEvent('network-iface-online');
		}
		onNetworkIfaceOffline(){
			this._online = false;
			this.fireEvent('network-iface-offline');
		}

		isOnline(){
			return this._online;
		}
	}
	return base;
}


export class FlowApp extends FlowAppMixin(BaseElement){
	static get properties(){
		return {
			"menu-icon":{type:String},
			"floating-drawer":{type:Boolean, reflect:true},
			"open-drawer":{type:Boolean, reflect:true},
		}
	}
	static get styles(){
		return [ScrollbarStyle, css`
			:host{
				display:flex;
				flex-direction:column;
				width:var(--flow-app-width, 100vw);
				height:var(--flow-app-height, 100vh);
			}
			.header{
				display:flex;flex-direction:row;
				align-items:var(--flow-app-header-align-items, center);
				height:var(--flow-app-header-height, 60px);
				background-color:var(--flow-app-header-bg, #161926);
				color:var(--flow-app-header-color, #91aec1);
				padding:var(--flow-app-header-padding, 0px 100px);
				--flow-dropdown-trigger-bg:var(--flow-app-header-bg, #161926);
				--flow-dropdown-trigger-color:var(--flow-app-header-color, #91aec1);
				--flow-dropdown-trigger-hover-bg:transparent;
				--flow-dropdown-trigger-hover-color:var(--flow-app-header-color, #91aec1);
				--flow-dropdown-trigger-width:20px;
				--flow-dropdown-trigger-padding:0px;
			}
			.header-sm{display:none}
			.header ::slotted(.logo){
				height:100%;
				max-height:80%;
			}
			.logo ::slotted(.logo){
				max-height:80%;
			}
			.header ::slotted(a.link){
				padding:var(--flow-app-header-link-padding, 0px 0px 0px 16px);
				color:var(--flow-app-header-color, #91aec1);
				text-decoration:none;
			}
			.footer {
				height: var(--flow-app-footer-height, initial);
				color:var(--flow-app-footer-color, #000);
				background:var(--flow-app-footer-bg, #91aec1);				
			}
			
			.body{
				flex:1;display:flex;flex-direction:row;
				overflow:var(--flow-app-body-overflow, hidden);
			}
			.drawer{
				background-color:var(--flow-app-drawer-bg, var(--flow-background-color, inherit));
				color:var(--flow-app-drawer-color, var(--flow-color, inherit));
				width:var(--flow-app-drawer-width, 300px);
				overflow:var(--flow-app-drawer-overflow, initial);
				position:relative;
			}
			:host([no-drawer]) .drawer{display:none}
			:host([floating-drawer]) .drawer{
				position:absolute;
				left:0px;top:0px;bottom:0px;
				transition:var(--flow-app-drawer-transition, left 0.5s ease);
				z-index:var(--flow-app-drawer-z-index, 10001);
			}
			:host([floating-drawer]:not([open-drawer])) .drawer{
				left:var(--flow-app-drawer-hidden-left, -500px);
			}
			:host([floating-drawer][right-drawer]) .drawer{
				left:initial;right:0px;
				transition:var(--flow-app-drawer-transition, right 0.5s ease);
			}
			:host([floating-drawer][right-drawer]:not([open-drawer])) .drawer{
				right:var(--flow-app-drawer-hidden-right, -500px);
			}
			.main{
				flex:1;
				overflow:var(--flow-app-main-overflow, hidden);
				position:var(--flow-app-main-position, initial);
				display:var(--flow-app-main-display, flex);
				flex-direction:var(--flow-app-main-flex-direction, column);
			}

			.wrapper {
				/*
				min-height: 100%;
				height:var(--flow-app-wrapper-height, 100%);
				margin-bottom: calc(-1 * var(--flow-app-footer-height,0px));
				*/
				height:var(--flow-app-wrapper-height, 100px);
				overflow:var(--flow-app-wrapper-overflow, auto);
				position:var(--flow-app-wrapper-position, initial);
				display:var(--flow-app-wrapper-display, initial);
				flex:var(--flow-app-wrapper-flex, 1);
			}
			:host([main-v-box]) .main{
				display:flex;flex-direction:column;
				align-items:var(--flow-app-main-align-items, stretch);
				justify-content:var(--flow-app-main-align-justify-content, space-between);
			}
			fa-icon{
				--fa-icon-color:var(--flow-color);
			}

			.menu-icon{
				cursor:pointer;
				--fa-icon-color:var(--flow-app-menu-icon-color, var(--flow-color));
			}
			.drawer-top{
				height:var(--flow-app-header-height, 60px);
				display:flex;align-items:center;
				padding:var(--flow-app-header-padding, 0px 100px);
			}
			.main-mask{
				position:absolute;z-index:var(--flow-app-body-mask-z-index, 10000);
				left:0px;top:0px;right:0px;bottom:0px;width:100%;height:100%;
				background-color:var(--flow-app-body-mask-bg, initial);
			}
			:host([floating-drawer][open-drawer]) .main{position:relative}
			:host(:not([floating-drawer])) .drawer-top,
			:host(:not([floating-drawer])) .main-mask,
			:host(:not([open-drawer])) .main-mask{display:none}
			.drawer-close-icon{
				cursor:pointer;
				--fa-icon-color:var(--flow-app-drawer-close-icon-color, var(--flow-color));
			}

			@media(max-width:760px){
				:host([floating-drawer]) .header-sm{display:flex}
				:host([floating-drawer]) .header:not(.header-sm){display:none}
				.drawer-top,
				.header{
					padding:var(--flow-app-header-sm-padding, 0px 15px);
				}
			}



			::slotted(.flex){flex:1}
		`]
	}
	constructor(...args){
		super(...args);
		this.registerListener("flow-network-and-user-state-get", (e)=>{
			//e.detail = e.detail||{};
			e.detail.online = this.isOnline();
			e.detail.signedin = this.signedin;
		})
	}
	render(){
		return html`
		<div class="header"><slot name="logo"></slot><slot name="header"></slot></div>
		<div class="header header-sm"><fa-icon class="menu-icon"
			icon="${this['menu-icon'] || 'bars'}" 
			@click="${this.toggleFloatingDrawer}"></fa-icon><slot 
			name="header-sm"></slot></div>
		<div class="body">
			<div class="drawer sbar">
			<div class="drawer-top">
				<fa-icon class="drawer-close-icon"
				icon="${this['drawer-close-icon'] || 'times'}" 
				@click="${this.toggleFloatingDrawer}"></fa-icon>
			</div>
			<slot name="drawer"></slot></div>
			<div class="main sbar">
				<div class="wrapper">
					<slot name="main"></slot><div 
					class="main-mask" @click="${this.toggleFloatingDrawer}"></div>
				</div>
				<div class="footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
		`
	}
	firstUpdated(){
		this.setLoading(false);
	}
	toggleFloatingDrawer(){
		if(!this['floating-drawer'])
			return
		this['open-drawer'] = !this['open-drawer'];
	}
	signinCallback(){
		this.signedin = true;
		document.body.classList.toggle("flow-user-signedin", true);
	}
	signoutCallback(){
		this.signedin = false;
		document.body.classList.toggle("flow-user-signedin", false);
	}
	connectedCallback() {
		super.connectedCallback();
		this.signinCallback_ = (...args)=>{
			this.signinCallback(...args);
		}
		window.addEventListener('flow-user-signin', this.signinCallback_);

		this.signoutCallback_ = (...args)=>{
			this.signoutCallback(...args);
		}
		window.addEventListener('flow-user-signout', this.signoutCallback_);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if(this.signinCallback_){
			window.removeEventListener('flow-user-signin', this.signinCallback_);
			delete this.signinCallback_;
		}
		if(this.signoutCallback_){
			window.removeEventListener('flow-user-signout', this.signoutCallback_);
			delete this.signoutCallback_;
		}
	}
}

FlowApp.define("flow-app");

