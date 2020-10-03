import {LitElement, html, css} from 'lit-element';

export * from 'lit-element';
export * from 'lit-html/lit-html.js';

import {baseUrl, debug, FlowIconPath, FlowIcons, resolveIcon, FlowStates, DeferComponent} from './helpers.js';
import {styleAppendTo} from "./helpers.js";
export * from './helpers.js';
export * from './pagination.js';
/**
* @class BaseElement
* @extends LitElement
*/
export class BaseElement extends LitElement{

	static get baseUrl(){
		return baseUrl;
	}

	static hashCode(str){//java String#hashCode
	    var hash = 0;
	    for (var i = 0; i < str.length; i++) {
	       hash = str.charCodeAt(i) + ((hash << 5) - hash);
	    }
	    return hash;
	} 

	static intToRGB(i){
	    var c = (i & 0x00FFFFFF)
	        .toString(16)
	        .toUpperCase();

	    return "00000".substring(0, 6 - c.length) + c;
	}

	/**
	* convert any string to color hex code
	* @param {String} str any string i.e 'hello'
	* @return {String} color hex code i.e `#DDFFAA`
	*/
	static strToColor(str){
		return '#'+this.intToRGB(this.hashCode(str));
	}

	/**
	* @desc define customElements. you can call on drived/child class as <code class="prettyprint js">CoolElement.define('my-cool-element')</code>
	* @param {String} name name of tag i.e. 'my-cool-element'
	* @since 0.0.1
	*/
	static define(name, deps){
		if(deps) {
			DeferComponent(this,name,deps);
		}
		else
			customElements.define(name, this);
	}

	static get svgStyle(){
		return css`
			svg.icon{
				width:28px;
				height:28px;
				margin:0px 5px;
				fill:var(--flow-primary-color);
			}
		`
	}

	static createElement(name, attr={}, props={}){
		let el = document.createElement(name);
		Object.keys(attr).forEach(k=>{
			el.setAttribute(k, attr[k])
		})
		Object.keys(props).forEach(k=>{
			el[k] = props[k];
		})

		return el;
	}

	static setLocalSetting(name, value){
		if(!window.localStorage)
			return

		window.localStorage['flow-'+name] = value;
	}

	static getLocalSetting(name, defaults){
		if(!window.localStorage)
			return defaults;

		let value = window.localStorage['flow-'+name];
		if(typeof(value) == 'undefined')
			return defaults

		return value;
	}

	constructor(){
		super();
		const name = this.constructor.name;
		this.__cname = name.toLowerCase().replace("flow", "");
		this._initLog();
	}

	initPropertiesDefaultValues(props=null){
		this.constructor._classProperties.forEach((v, key)=>{
			//console.log("key, v", key, v)
			let type = typeof v.value;
			if(!['undefined', 'function'].includes(type))
				this[key] = v.value;
		})
		if(props){
			Object.keys(props).forEach(name=>{
				if(typeof props[name].value != 'undefined')
					this[name] = props[name].value
			})
		}
	}

	_initLog(forceLog = false, name){
		let {localStorage:lS} = window;
		let {debug} = lS||{};
		name = name || this.constructor.name;
		if(forceLog||debug=="all"||debug=="*"||
			(debug+"").indexOf(this.__cname)>-1 ||
			(debug+"").indexOf(name) >-1){
			this.log = Function.prototype.bind.call(
				console.log,
				console,
				`%c[${name}]`,
				`font-weight:bold;color:${this.constructor.strToColor(name)}`
			);
		}else{
			this.log = ()=>{
				//
			}
		}
	}

	cloneValue(value){
		if( value instanceof Array )
			return value.map(v=>this.cloneValue(v))
		else if( value instanceof Object ){
			let r = {}
			Object.entries(value).forEach( ([k,v])=>{
				r[k] = this.cloneValue(v);
			})
			return r;
		}

		return value;	
	}

	/**
	* update the property by its path
	* @param {String} path propery path i.e `tabs.2.disable`
	* @param {*} value new value
	*
	*/
	set(path, value){
		const parts = path.split(".");
		let v = this;
		let last = parts.length-1;
		let updated = false;
		let lastValue = this.cloneValue(v[parts[0]]);
		
		parts.find((p, i)=>{
			if( !(v instanceof Object) )
				return
			if(i==last){
				v[p] = value;
				//this.log("v, p, i, v", {v, p, i, value})
				updated = true;
				return true;
			}
			v = v[p];
		})
		if(updated){
			this.requestUpdate(parts[0], lastValue)
			//this.log("requestUpdate, prop, lastValue", parts[0], lastValue)
		}
		return updated;
	}
 
	/**
	* fire CustomEvent
	* @param {String} eventName name of event
	* @param {Object=} detail event's [detail]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail} property
	* @param {Object=} options [CustomEventInit dictionary]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent}
	* @param {HTMLElement=} event target (default: this element)
	* @return {boolean} The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
	* @since 0.0.1
	*/
	fire(eventName, detail={}, options={}, el=null, returnEvent=false){
		let ev = new CustomEvent(eventName, Object.assign({}, options, {detail}));
		let result = (el || this).dispatchEvent(ev);
		return returnEvent?ev:result

	}

	/**
	* debounce provided function for given time
	* @param {String} name key name to debounce function
	* @param {Function} fn a function to debounce
	* @param {Number} time time in milliseconds for delay
	* @return {Object} a reference to debounced function
	* @since 0.0.1
	*/
	debounce(name, fn, time){
		this._debounce = this._debounce || new Map();
		if(this._debounce.has(name))
			this._debounce.get(name).cancel();

		this._debounce.set(name, {
			id:setTimeout(fn, time),
			cancel(){
				if(!this.id){
					clearTimeout(this.id)
					this.id = null;
				}

			}
		})

		return this._debounce.get(name);
	}

	buildUrl(url){
		return this.constructor.baseUrl + url;
	}
	iconPath(name, i){
		return resolveIcon(this.__cname, name, i);
	}

	/**
	* Logs given values
	* @param {...*} args
	*/
	log(...args){
	}


	renderOnStateChange(state, ON=true){
		if(!this._renderOnStateChange)
			this._renderOnStateChange = {};
		this._renderOnStateChange[state] = ON;
	}

	connectedCallback() {
		super.connectedCallback();

		let stateChange = this._renderOnStateChange || {};
		let ONLINE = stateChange[FlowStates.ONLINE];
		let AUTH = stateChange[FlowStates.AUTH];

		if(this.onlineCallback || ONLINE) {
			this.onlineCallback_ = (...args)=>{
				this.__online = true;
				this.onlineCallback?.(...args);
				if(ONLINE)
					this.requestUpdate("FLOW-NETWORK-ONLINE", false)
			}
			window.addEventListener('network-iface-online', this.onlineCallback_);
		}

		if(this.offlineCallback || ONLINE) {
			this.offlineCallback_ = (...args)=>{
				this.__online = false;
				this.offlineCallback?.(...args);
				if(ONLINE)
					this.requestUpdate("FLOW-NETWORK-ONLINE", true)
			}
			window.addEventListener('network-iface-offline', this.offlineCallback_);
		}

		if(this.signinCallback || AUTH) {
			this.signinCallback_ = (...args)=>{
				this.__signedin = true;
				this.signinCallback?.(...args);
				if(AUTH)
					this.requestUpdate("FLOW-USER-AUTH", false)
			}
			window.addEventListener('flow-user-signin', this.signinCallback_);
		}

		if(this.signoutCallback || AUTH) {
			this.signoutCallback_ = (...args)=>{
				this.__signedin = false;
				this.signoutCallback?.(...args);
				if(AUTH)
					this.requestUpdate("FLOW-USER-AUTH", true)
			}
			window.addEventListener('flow-user-signout', this.signoutCallback_);
		}

		if(this.registeredListeners) {
			this.registeredListeners.forEach(({ name, handler }) => {
				window.addEventListener(name, handler);
			})
		}

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		
		if(this.onlineCallback_) {
			window.removeEventListener('network-iface-online', this.onlineCallback_);
			delete this.onlineCallback_;
		}
		if(this.offlineCallback_) {
			window.removeEventListener('network-iface-offline', this.offlineCallback_);
			delete this.offlineCallback_;
		}
		if(this.signinCallback_) {
			window.removeEventListener('flow-user-signin', this.signinCallback_);
			delete this.signinCallback_;
		}
		if(this.signoutCallback) {
			window.removeEventListener('flow-user-signout', this.signoutCallback);
			delete this.signoutCallback;
		}

		if(this.registeredListeners) {
			this.registeredListeners.forEach(({ name, handler }) => {
				window.removeEventListener(name, handler);
			})
		}
	}

	registerListener(name, handler_) {
		if(!this.registeredListeners)
			this.registeredListeners = [];
		const handler = handler_ || (() => { this.requestUpdate(); });//.bind(this);
		this.registeredListeners.push({name,handler});
		window.addEventListener(name,handler);
		//console.log("window.addEventListener",name,handler);
	}

	removeListeners() {
		if(this.registeredListeners) {
			this.registeredListeners.forEach(({ name, handler }) => {
				window.removeEventListener(name, handler);
			})
		}
		this.registeredListeners = [];
	}

	isOnline(){
		return this.__online;
	}
	isSignedin(){
		return this.__signedin;
	}
	serialize(){
		return {
			nodeName: this.nodeName
		}
	}
	deserialize(){
		//
	}
}

export const ScrollbarStyle = css`
*::-webkit-scrollbar-track,
:host::-webkit-scrollbar-track{
    box-shadow:var(--flow-scrollbar-track-box-shadow, initial);
    background:var(--flow-scrollbar-track-bg, initial);
}

*::-webkit-scrollbar,
:host::-webkit-scrollbar{
	width:var(--flow-scrollbar-width, initial);
	height:var(--flow-scrollbar-width, initial);
	background:var(--flow-scrollbar-bg, initial);
}
*::-webkit-scrollbar-thumb,
:host::-webkit-scrollbar-thumb{
    box-shadow:var(--flow-scrollbar-thumb-box-shadow, initial);
    background:var(--flow-scrollbar-thumb-bg, initial);
}
`

ScrollbarStyle.appendTo = styleAppendTo(ScrollbarStyle);

let getLocalSetting = BaseElement.getLocalSetting;
let setLocalSetting = BaseElement.setLocalSetting;
export {getLocalSetting, setLocalSetting}
