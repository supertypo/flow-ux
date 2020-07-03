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
export {IconMap, FlowIcons, NativeIcons, dpc}
export {baseUrl, debug, FlowIconPath, flow, UID, storage, resolveIcon};


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