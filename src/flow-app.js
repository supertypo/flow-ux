import {dpc, UID} from './helpers.js';
import {FlowSocketIORPC} from './flow-socketio-rpc.js';
import {FlowSocketIONATS} from './flow-socketio-nats.js';

import {BaseElement, ScrollbarStyle, html, css} from './base-element.js';

class FlowAppBase {}

export const FlowAppBaseMixin = (baseClass)=>{
	class base extends baseClass{
		constructor(...args) {
			super(...args)
			this.uid = UID();
		}

		setTheme(theme){
			const body = document.querySelector('body');

			[...body.classList]
			.filter(cls=>cls.startsWith('flow-theme'))
			.forEach(cls=>body.classList.remove(cls));

			body.classList.add(`flow-theme-${theme}`);
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
	
		initSocketIONATS(){
			return new Promise((resolve, reject) => {
				this.nats = new FlowSocketIONATS({
					path:"/nats"
				});

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
					this.fireEvent('network-iface-offline');
				})
			})
		}

		setLoading(isLoading=true, el=null){
			(el || document.body).classList.toggle("loading", isLoading)
		}

		initLog(){
			const name = this.constructor.name;
			this.log = Function.prototype.bind.call(
				console.log,
				console,
				`%c[${name}]`,
				`font-weight:bold;color:#41c7ef`
			);
		}

		onNetworkIfaceOnline(){
			this.fireEvent('network-iface-online');
		}
		onNetworkIfaceOffline(){
			this.fireEvent('network-iface-offline');
		}
	}
	return base;
}

export class FlowApp extends FlowAppBaseMixin(FlowAppBase){}

export class FlowAppComponent extends FlowAppBaseMixin(BaseElement){
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
			.header ::slotted(.logo){
				max-height:80%;
			}
			.header ::slotted(a.link){
				padding:var(--flow-app-header-link-padding, 0px 0px 0px 16px);
				color:var(--flow-app-header-color, #91aec1);
				text-decoration:none;
			}
			.body{flex:1;display:flex;flex-direction:row;overflow:hidden;}
			.drawer{
				background-color:var(--flow-app-drawer-bg, var(--flow-background, inherit));
				color:var(--flow-app-drawer-color, var(--flow-color, inherit));
				width:var(--flow-app-drawer-width, 300px);
				overflow:auto;
			}
			:host([no-drawer]) .drawer{display:none}
			.main{flex:1;overflow:var(--flow-app-main-overflow,auto)}
			::slotted(.flex){flex:1}
		`]
	}
	constructor(...args){
		super(...args);
	}
	render(){
		return html`
		<div class="header"><slot name="header"></slot></div>
		<div class="body">
			<div class="drawer sbar"><slot name="drawer"></slot></div>
			<div class="main sbar"><slot name="main"></slot></div>
		</div>`
	}
	firstUpdated(){
		this.setLoading(false);
	}
}

FlowAppComponent.define("flow-app");

