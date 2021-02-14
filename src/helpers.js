const toString = Object.prototype.toString;
const is = (obj, type) =>toString.call(obj)=='[object '+type+']'

export const utils = {};
utils.toString = toString;
utils.is = is;
utils.isArray = obj=>Array.isArray(obj);
utils.isObject = obj=>is(obj, 'Object');
utils.isString = obj=>is(obj, 'String');
utils.isNumber = obj=>is(obj, 'Number');
utils.isBoolean = obj=>is(obj, 'Boolean');
utils.isFunction = obj=>is(obj, 'Function');
utils.isUndefined = obj=>is(obj, 'Undefined');
utils.valueToDataType = (value)=>{
	return window[toString.call(value).split("object")[1]?.replace("]", "").trim()||""]
}

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

if(!window.OnReCaptchaLoad){
	window.OnReCaptchaLoad = ()=>{
		console.log("OnReCaptchaLoad OnReCaptchaLoad OnReCaptchaLoad")
		trigger("g-recaptcha-ready")
		buildReCaptcha();
	}
}

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
	//let ce = new CustomEvent("flow-theme-changed", {detail:{theme}});
	//body.dispatchEvent(ce);
	trigger("flow-theme-changed", {theme}, {bubbles:true}, body);
	//trigger("flow-theme-changed", {theme}, {bubbles:true}, window);
}

//window.setTheme = setTheme;
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
                    ctor.defineElement(name);
            }        
        }
	}
	else
		ctor.defineElement(name);
}

export const sizeClsMap = new Map();
sizeClsMap.set("TINY", 400);
sizeClsMap.set("XXS", 550);
sizeClsMap.set("XS", 768);
sizeClsMap.set("SM", 992);
sizeClsMap.set("MD", 1200);

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

export class ExtendedMap extends Map{
	constructor(...args){
		super(...args)
		this.handlers = new Map();
	}
	setListener(type, handler){
		if(!["set", "clear", "delete"].includes(type)){
			return false
		}
		let handlers = this.handlers.get(type)
		if(!handlers)
			handlers = []
		if(!handlers.includes(handler))
			handlers.push(handler);
		this.handlers.set(type, handlers);
	}
	callHandlers(type, ...args){
		let handlers = this.handlers.get(type);
		if(!handlers)
			return
		handlers.forEach(fn=>{
			fn(...args);
		})
	}
	set(key, value){
		super.set(key, value);
		this.callHandlers("set", key, value);
	}
}

export const trigger = (eventName, detail={}, options={}, el=null, returnEvent=false)=>{
	let ev = new CustomEvent(eventName, Object.assign({}, options, {detail}));
	let result = (el || window).dispatchEvent(ev);
	return returnEvent?ev:result
}

export const buildReCaptcha = root=>{
	if(!window.grecaptcha)
		return
	grecaptcha.ready(()=>{
		root = root||document;
		root.querySelectorAll('.g-recaptcha').forEach((el)=>{
			let id = el.dataset.grecaptchaId;
			if(id !== undefined){
				grecaptcha.reset(id)
				return
			}

			id = grecaptcha.render(el, {
				'sitekey' : el.dataset.sitekey || document.body.dataset.recaptchaKey,
				callback(data){
					trigger("g-recaptcha", {code:"success", data}, {bubbles:true}, el)
				},
				'expired-callback':()=>{
					trigger("g-recaptcha", {code:"expired"}, {bubbles:true}, el)
				},
				'error-callback':()=>{
					trigger("g-recaptcha", {code:"error"}, {bubbles:true}, el)
				}
			});
			el.dataset.grecaptchaId = id;
		});
	})
}

export const chunks = (arr, size) =>{
	return arr.length ? [arr.slice(0, size), ...chunks(arr.slice(size), size)] : []
}
export const getRandomInt = (min, max)=>{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max + 1 - min) + min); //The maximum and minimum are inclusive
}
export const shuffle = (array)=>{
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

const fit = (contains)=>{
	return (parentWidth, parentHeight, childWidth, childHeight, scale = 1, offsetX = 0.5, offsetY = 0.5) => {
		const childRatio = childWidth / childHeight
		const parentRatio = parentWidth / parentHeight
		let width = parentWidth * scale
		let height = parentHeight * scale

		if (contains ? (childRatio > parentRatio) : (childRatio < parentRatio)) {
			height = width / childRatio
		} else {
			width = height * childRatio
		}

		return {
			width,
			height,
			offsetX: (parentWidth - width) * offsetX,
			offsetY: (parentHeight - height) * offsetY
		}
	}
}

export const contain = fit(true)
export const cover = fit(false)
