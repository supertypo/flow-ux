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
export {IconMap, FlowIcons, NativeIcons, dpc, isSmallScreen, FlowStates};
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
            let script = document.createElement("script");
            script.src = src;
            document.head.appendChild(script);
            script.onload = ()=>{
                count--;
                if(!count)
                    ctor.define(name);
            }        
        }
	}
	else
		ctor.define(name);
}
