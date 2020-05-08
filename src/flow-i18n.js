import {BaseElement, html, css, directive, LitElement} from './base-element.js';
const stateMap = new WeakMap();

class i18n extends BaseElement{

	static hash(text) {
        var A = 5381,
            B = 9835,
            i    = text.length;
        while(i) {
            var ch = text.charCodeAt(--i);
            A = (A * 33) ^ ch;
            B = (B * 55) ^ ch ^ A;
        }
        A = A >= 0 ? A : (A & 0x7FFFFFFF) + 0x80000000;
        B = B >= 0 ? B : (B & 0x7FFFFFFF) + 0x80000000;
        return A.toString(16)+B.toString(16);
    }

    static entriesChanged(){
    	let entriesAll = this.getAllEntries();
    	let entries = this.getEntries();
    	let detail = {entries, entriesAll}
    	let ce = new CustomEvent("flow-i18n-entries-changed", {detail})
    	window.dispatchEvent(ce);
    }

	static stripWhitespace(text) {
		return text.replace(/\s\s+/g,' ').trim();
	}

    static createEntry(text, values=false){
		let hash = this.hash(text);
		//console.log("i18n.entries", this.entries, text)
		if(!this.entries[hash]){
			this.entries[hash] = Object.assign({en:text}, values || {});
			this.entriesChanged();
		}else if(values){
			Object.assign(this.entries[hash], values);
			this.entriesChanged();
		}
		return hash;
	}

	static t(text, defaults, locale){
		text = this.stripWhitespace(text);
		let hash = this.createEntry(text);
		if(this.testing)
			return `[${locale||this.locale}:${text}]`;
		let entry = this.entries[hash];
		let value = entry[locale||this.locale];
		//console.log("value", value, this.locale, text)
		//if(value !== undefined)
		//	return value;
		return value || defaults || text;
	}

	static setConfig(_config){
		config = _config;
	}
	static getConfig(){
		return config;
	}
	static setActiveLanguages(locales){
		let newLocale = false;
		config.languages.forEach(l=>{
			l.active = locales.includes(l.locale);
			if(l.locale == this.locale && !l.active)
				newLocale = 'en';
		});

		if(newLocale)
			this.setLocale(newLocale);
	}
	static getActiveLanguages(){
		return config.languages.filter(l=>l.active)
	}
	static getActiveLocales(){
		return this.getActiveLanguages().map(l=>l.locale);
	}
	static setEntries(list){
		(list ||[]).forEach(entry=>{
			this.entries[this.hash(entry.en)] = entry;
		});

		onLocaleChange();
	}
	static setTesting(testing){
		this.testing = testing;
		onLocaleChange();
	}
	static getEntries(){
		let activeLocales = this.getActiveLocales();
    	let entry;
    	return this.getAllEntries().map(e=>{
    		entry = {en:e.en};
    		activeLocales.forEach(l=>{
    			entry[l] = e[l] || "";
    		})
    		return entry;
    	})
	}
	static getAllEntries(){
		return Object.values(this.entries);
	}
	static get properties() {
		return {
			text:{type:String}
			//xx:{type:String}
		}
	}

	static setLocale(locale='en'){
		this.locale = locale;
		this.setLocalSetting('i18n-locale', locale);
		onLocaleChange();
	}

	constructor(){
		super();
		this.text = "";
		//this.setAttribute("c1", `${this.text}`)
		//console.log("constructor:", this.innerHTML, this.text)
	}

	createRenderRoot() {
		//this.innerHTML_ = this.innerHTML;
		return this;
	}

	connectedCallback(){
		super.connectedCallback();
		this._cb = this._cb || this.onLocaleChange.bind(this);
		window.addEventListener("flow-i18n-locale", this._cb)
		//this.setAttribute("c2", `${this.text}`)
		this.update();
	}

	disconnectedCallback(){
		super.disconnectedCallback();
		this._cb && window.removeEventListener("flow-i18n-locale", this._cb)
	}

	onLocaleChange(){
		this.update();
	}

	/*
	updated(changed){
		super.updated();
		console.log("changed", changed)
		this.setAttribute("c3", `${this.text}:${JSON.stringify(changed)}`)
	}
	*/

	render() {
		if(this.innerHTML_ == undefined)
			this.innerHTML_ = this.innerHTML;
		//if(this.getAttribute("xx") == 1)
		//this.log("innerHTML", i18n.locale, "inner:"+this.innerHTML_, " text:"+this.text)
		return html([i18n.t(this.text || this.innerHTML_)]);
	}  
}


let config = {
	// languages:[
	// 	{title:'English', locale:'en'},
	// 	{title:'Russian', locale:'ru'},
	// 	{title:'Hindi', locale:'hi'},
	// 	{title:'Punjabi', locale:'pu'}
	// ]
	languages : [
		{"title":"العربية‎", "locale": "ar", rtl: true },
		{"title":"Български", "locale": "bg" },
		{"title":"বাংলা", "locale": "bn" },
		{"title":"English", "locale": "en" },
		{"title":"Español", "locale": "es" },
		{"title":"Greek", "locale": "el" },
		{"title":"Esti", "locale": "et" },
		{"title":"Français", "locale": "fr" },
		{"title":"Deutsch", "locale": "de" },
		{"title":"Danish", "locale": "da" },
		{"title":"Czech", "locale": "cs" },
		{"title":"Farsi", "locale": "fa" },
		{"title":"Finnish", "locale": "fi" },
		{"title":"Filipino", "locale": "fil" },
		{"title":"עברית", "locale": "he", rtl: true },
		{"title":"Hindi", "locale": "hi" },
		{"title":"Croatian", "locale": "hr" },
		{"title":"Hungarian", "locale": "hu" },
		{"title":"Italiano", "locale": "it" },
		{"title":"Icelandic", "locale": "is" },
		{"title":"日本語", "locale": "ja" },
		{"title":"Korean", "locale": "ko" },
		{"title":"Lithuanian", "locale": "lt" },
		{"title":"Norwegian", "locale": "nb" },
		{"title":"Dutch", "locale": "nl" },
		{"title":"Norwegian", "locale": "no" },
		{"title":"Polski", "locale": "pl" },
		{"title":"PortuguÃªs", "locale": "pt" },
		{"title":"Romanian", "locale": "ro" },
		{"title":"Русский", "locale": "ru" },
		{"title":"Slovak", "locale": "sk" },
		{"title":"Serbian", "locale": "sr" },
		{"title":"Slovenian", "locale": "sl" },
		{"title":"Swedish", "locale": "sv" },
		{"title":"Tamil", "locale": "ta" },
		{"title":"Thai", "locale": "th" },
		{"title":"Turkish", "locale": "tr" },
		{"title":"Ukrainian", "locale": "uk" },
		{"title":"Urdu", "locale": "ur" },
		{"title":"Vietnamese", "locale": "vi" },
		{"title":"Mongolian", "locale": "mn" },
		{"title":"中文", "locale": "zh_HANS" },
		{"title":"繁體中文", "locale": "zh_HANT" }
	],
	aliases : {
		"en-GB": "en",
		"en-US": "en",
		"zh-CN": "zh_HANS",
		"zh-TW": "zh_HANT"
	}

}

i18n.entries = {};
i18n.locale = BaseElement.getLocalSetting('i18n-locale', 'en');
i18n.entries[i18n.hash('Hello')] = {
	en: "Hello",
	ru : 'Ð-Ð´Ñ€Ð°Ð²ÑÑ‚Ð²ÑƒÐ¹Ñ‚Ðµ',
	pu: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
	hi: 'नमस्ते!'
}

window.addEventListener("flow-i18n-entries", e=>{
	i18n.setEntries(e.detail.entries);
})

let Mixin = (Base, tag)=>{
	class Child extends Base{
		connectedCallback() {
			if(!this.innerHTML_)
				this.innerHTML_ = this.innerHTML;
			this._cb = this._cb || this.onLocaleChange.bind(this);
			window.addEventListener("flow-i18n-locale", this._cb)
			this.onLocaleChange();
		}

		disconnectedCallback(){
			this._cb && window.removeEventListener("flow-i18n-locale", this._cb)
		}

		onLocaleChange(){
			this.innerHTML = this.htmlToElement(i18n.t(this.innerHTML_))
		}
		htmlToElement(html) {
		    let template = document.createElement('template');
		    template.innerHTML = `<span>${html.trim()}</span>`;
		    return template.content.firstChild.innerHTML;
		}
	}

	customElements.define('i18n-'+tag, Child, {extends: tag});

}

Mixin(HTMLDivElement, 'div');
Mixin(HTMLSpanElement, 'span')
Mixin(HTMLParagraphElement, 'p')
 



let parts = [];

const T = directive((text) => (part) => {
	let state = stateMap.get(part);
	if (state === undefined) {
		state = {};
		state.node = part?.startNode?.nextSibling || part.element || part?.committer?.element;
		stateMap.set(part, state);
		parts.push(part);
	}
	state.text = text;
	//console.log("i18n:T", text, i18n.locale)
	part.setValue(i18n.t(text));
	part.commit();
});

let onLocaleChange = ()=>{
	let ce = new CustomEvent("flow-i18n-locale", {detail:{locale:i18n.locale}})
	window.dispatchEvent(ce);
	let state; 
	let removed = [];
	parts.forEach((p, i)=>{
		state = stateMap.get(p);
		if(!state){
			removed.push(i);
			return
		}
		console.log("i18n:T", i18n.t(state.text), i18n.locale, state.node?.isConnected)
		p.setValue(i18n.t(state.text));
		p.commit();
	})
}

i18n.setLocale(i18n.locale);


export class FlowI18nDialog{
	static open(alignTarget){
		if(this.dialog)
			return
		this._click = this._click || this.onClick.bind(this);
		
		let p = this._open(alignTarget);
		setTimeout(()=>{
			window.addEventListener("click", this._click)
		}, 100);
		return p;
	}
	static close(data){
		if(this.dialog){
			this.dialog.resolve(data);
			this.dialog = null;
		}
		this.removeEventListener();
	}
	static onClick(e){
		if(!this.dialog){
			this.removeEventListener();
			return
		}
		let menu = e.target?.closest?.("flow-dialog.flow-menu");
		if(menu != this.dialog){
			this.removeEventListener();
			this.close();
		}
	}
	static removeEventListener(){
		window.removeEventListener("click", this._click)
	}
	static _open(alignTarget){
		let menuClick = e=>{
			let li = e.target.closest("li");
			let locale = li.getAttribute("data-locale");
			i18n.setLocale(locale);
			dialog.resolve({locale});
			this.dialog = false;
			this.removeEventListener();
		}

		let body = html
			`<ul class="menu" @click="${menuClick}">${
				config.languages.filter(l=>l.active).map(l=>html
					`<li data-locale="${l.locale}" 
						class="${l.locale==i18n.locale?'active':''}">${l.title}</li>`
				)
			}</ul>`

		let promise = FlowDialog.show({
			body,
			btns:[],
			cls:"flow-menu",
			modal:false
		})

		let {dialog} = promise;
		this.dialog = dialog;
		if(alignTarget){
			let box = alignTarget.getBoundingClientRect();
			let dialogBox = dialog.getBoundingClientRect();
			let style = dialog.style;
			style.top = (box.bottom+2)+"px";
			style.left = (box.right-dialogBox.width)+"px";
			dialog.addEventListener("updated", e=>{
				let {dialog} = e.detail;
				let dialogBox = dialog.getBoundingClientRect();
				style.left = (box.right-dialogBox.width)+"px";
			})
		}

		return promise
	}
}


window.xxxxx_setLocale = i18n.setLocale;


export class I18nTest extends LitElement{
	static get styles(){
		return css`:host{display:inline-block;border:1px solid #DDD;padding:10px;}`
	}
	constructor(){
		super();
		this.start();
	}
	start(){
		let i=0, ls = ['ru', 'pu', 'hi', 'en'];
		this.intervalId = setInterval(()=>{
			let l = ls[i++];
			if(!l){
				//i=0;
				//l = ls[i++];
				this.remove();
			}
			i18n.setLocale(l)
		}, 1000)
	}
	render(){
		return html`Hello: ${T('Hello')} <div title="${T('abc')}">How are You</div>`
	}
}

customElements.define('i18n-test', I18nTest);
customElements.define('flow-i18n', i18n);


export {i18n, T}


