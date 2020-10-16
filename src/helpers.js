const storage = () => {
	if(typeof global != 'undefined')
		return global
	if(typeof globalThis != 'undefined')
		return globalThis
	return  window;
}

let uid_vec = new Uint32Array(6);
const UID = (len = 26)=>{
	window.crypto.getRandomValues(uid_vec);
	return [...uid_vec].map(v=>bs58e(v)).join('').substring(0,len);
}

window.UID = UID;
const universe = storage();
const default_flow_global = { }
const flow = universe.flow = (universe.flow || default_flow_global);

let {debug, baseUrl, theme} = window.flowConfig || flow;
let {iconPath, icons, resolveIcon, iconMap, iconFile} = theme || {};

if(!baseUrl){
	baseUrl = (new URL("../", import.meta.url)).href;
	debug && console.log("FlowUX: baseUrl", baseUrl)
}
const isSmallScreen = navigator.userAgent.toLowerCase().includes("mobi");

const IconMap = Object.assign({
	fal:'light',
	far:'regular',
	fab:'brands',
	fa: 'solid',
	fas:'solid'
}, iconMap || {});

iconFile = iconFile||'icons';
const NativeIcons = baseUrl+'resources/icons/sprites/';
const FlowIconPath = iconPath || '/resources/fonts/sprites/';//NativeIcons;
const FlowIcons = icons || {};
const FlowStates = Object.freeze({ONLINE:'online', AUTH:'auth'});

if(!resolveIcon){
	resolveIcon = (cname, name, i)=>{
		if(!name)
			return `${cname}:invalid icon`;
		if(/\.(.{3,4}|.{3,4}#.*)$/.test(name))
			return name
		
		let icon = FlowIcons[`${cname}:${name}${i?'-'+i:''}`]
			||FlowIcons[name]
			||(name.indexOf(":")>-1?name:iconFile+':'+name);

		if(/\.(.{3,4}|.{3,4}#.*)$/.test(icon))
			return icon

		let [file, hash] = icon.split(":");
		if(file == "icons")
			return `${NativeIcons}icons.svg#${hash}`;
		return `${FlowIconPath}${IconMap[file]||file}.svg#${hash}`;
	}
}

// console.log("FlowIcons", FlowIcons) 

const dpc = (delay, fn)=>{
	if(typeof delay == 'function')
		return setTimeout(delay, fn||0);
	return setTimeout(fn, delay||0);
}

const clearDPC = (dpc_)=>{
	clearTimeout(dpc_);
}

const deferred = () => {
    let methods = {};
    const p = new Promise((resolve, reject) => {
        methods = { resolve, reject };
    });
    return Object.assign(p, methods);
}

export { dpc, clearDPC, deferred };

export const setTheme = theme=>{
	const body = document.body; 
	[...body.classList]
	.filter(cls=>cls.startsWith('flow-theme'))
	.forEach(cls=>body.classList.remove(cls));

	body.classList.add(`flow-theme-${theme}`);
	localStorage.flowtheme = theme;
	let ce = new CustomEvent("flow-theme-changed", {detail:{theme}});
	body.dispatchEvent(ce);
}
export const getTheme = (defaultTheme=((theme && theme.default) || "light"))=>{ 
	if(localStorage.flowtheme)
		return localStorage.flowtheme;
	const body = document.body;
	let theme = [...body.classList]
	.find(cls=>cls.startsWith('flow-theme'))
	if(!theme)
		return defaultTheme;

	return theme.replace("flow-theme-", "");
}
export {IconMap, FlowIcons, NativeIcons, isSmallScreen, FlowStates};
export {baseUrl, debug, FlowIconPath, flow, UID, storage, resolveIcon};


export const styleAppendTo = (style, defaultSelector="head")=>selector=>{
	let p = document.querySelector(selector||defaultSelector);
	if(!p)
		p = document.head;
	if(p.matches("style")){
		p.innerHTML = style.cssText;
	}else{
		let sBar = document.createElement('style');
		sBar.innerHTML = style.cssText;
		p.appendChild(sBar);
	}
}

const bs58e = (function() {
    var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return function(enc) {
		var encoded = '';
		while(enc) {
			var remainder = enc % base;
			enc = Math.floor(enc / base);
			encoded = alphabet[remainder].toString() + encoded;        
		}
		return encoded;
	}
})();

const resolveConditions = (src) => {
	src = Object.entries(src).map(([k,v]) => {
		return eval(k) ? undefined : v;
	}).filter(v=>v!==undefined);
	if(!src.length)
		return null;
	return src;
}

export const DeferComponent = (ctor, name, deps) => {

	if(deps && typeof deps == 'object' && !Array.isArray(deps))
		deps = resolveConditions(deps);

    if(deps && Array.isArray(deps)) {
		let count = 0;
		deps = deps.slice();		
		while(deps.length) {
			let src = deps.shift();

			switch(typeof src) {
				case 'function': {
					src = src();
					if(!src)
						continue;
					if(Array.isArray(src)) {
						deps = deps.concat(src);
						continue;
					}
				} break;
				case 'object': {
					src = resolveConditions(src);
					if(!src)
						continue;
					else
					if(src.length == 1)
						src = src.shift();
					else {
						deps = deps.concat(src);
						continue;
					}
				} break;
			}

			console.log('Flow - loading dep:', src);
            count++;
            let el
            if(/\.css$/.test(src)){
            	el = document.createElement("link");
            	el.setAttribute("rel", "stylesheet");
            	el.setAttribute("type", "text/css")
            	el.href = src;
            }else{
            	el = document.createElement("script");
            	el.src = src;
            }
            document.head.appendChild(el);
            el.onload = ()=>{
                count--;
                if(!count)
                    ctor.define(name);
            }        
        }
	}
	else
		ctor.define(name);
}

export const isArray = o=>Array.isArray(o);
export const isObject = o=>Object.prototype.toString.call(o)=='[object Object]';

export const camelCase = str=>{
  // Lower cases the string
  return (str+"").toLowerCase()
    // Replaces any - or _ characters with a space 
    .replace( /[-_\.]+/g, ' ')
    // Removes any non alphanumeric characters 
    .replace( /[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space 
    // (delimited by spaces) 
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    // Removes spaces 
    .replace( / /g, '' );
}

export const humanize = str=>{
	// Lower cases the string
  	str = (str+"").toLowerCase()
    // Replaces any - or _ characters with a space 
    .replace( /[-_\.]+/g, ' ')
    // Removes any non alphanumeric characters 
    .replace( /[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space 
    // (delimited by spaces) 
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    return str[0].toUpperCase()+str.substring(1);
    // Removes spaces 
    //.replace( / /g, '' );
}

export const deepClone = (obj, debug)=>{
	if(debug)
		console.log("deepClone:", obj, obj instanceof HTMLElement)
	if((typeof jQuery !='undefined' && obj instanceof jQuery) || (obj?.constructor?.prototype.jquery))
		return obj.clone();//$("___xxxxxx____");
	if(obj instanceof HTMLElement)
		return obj.cloneNode(true);
	if(isArray(obj))
		return obj.map(e=>deepClone(e, debug))
	if(isObject(obj)){
		let r = {};
		Object.entries(obj).forEach(([key, value])=>{
			r[key] = deepClone(value, debug);
		})
		return r;
	}
	return obj;
}


export class AsyncQueue {
	constructor(opt) {
		this.pending = [];
        this.processed = 0;
        this.inflight = 0;
		this.signal = deferred();
		this.done = false;
		this.max = opt?.max || 0;
	}
	[Symbol.asyncIterator]() { return this.iterator(); }
	push(v) {
		if(this.done)
			return;
		if(this.max) {
			while(this.pending.length >= this.max)
				this.pending.shift();
		}
		this.pending.push(v);
		this.signal.resolve();
	}
	stop(err) {
		this.err = err;
		this.abort = true;
		this.done = true;
		if(!this.inflight) {
			this.signal.resolve();
		}
	}
	clear() {
		this.pending = [];
		if(this.inflight) {
			this.abort = true;
			this.reset_ = true;
		}
	}
    get length() {
        return this.pending.length+this.inflight;
    }
	async *iterator() {

		if(this.done) {
			this.done = false;
			if(!this.pending.length)
				this.signal = deferred();
		}

		while(true) {
			if(this.pending.length === 0) {
				await this.signal;
			}
			if (this.err)
				throw this.err;

			const pending = this.pending;
			this.inflight = pending.length;
			this.pending = [];
			let processed = 0;
			for (; processed < pending.length && !this.abort; processed++) {
                this.processed++;
                yield pending[processed];
				this.inflight--;
			}


			if(this.reset_) {
				this.abort = false;
				this.reset_ = false;
				pending.length = 0;
			}
			
			if(this.done) {
				this.abort = false;
				const incoming = this.pending.length;
				if(incoming)
					this.pending = processed ? pending.slice(processed).concat(this.pending) : pending.concat(this.pending);
				else
					this.pending = processed ? pending.slice(processed) : pending;
				this.inflight = 0;
				break;
			}
			else if (this.pending.length === 0) {
				this.inflight = 0;
				pending.length = 0;
				this.pending = pending;
				this.signal = deferred();
			}
		}
	}
}
