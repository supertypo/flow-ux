import {BaseElement, html, css, ScrollbarStyle} from './base-element.js';



import '../resources/extern/colors/extend-string-prototypes.js';

import '../resources/extern/xterm/lib/xterm.js';
import '../resources/extern/xterm-addon-fit/lib/xterm-addon-fit.js';
import '../resources/extern/xterm-addon-web-links/lib/xterm-addon-web-links.js';

// import '/node_modules/xterm/lib/xterm.js';
// import '/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js';
// import '/node_modules/xterm-addon-web-links/lib/xterm-addon-web-links.js';

/**
* @class FlowTerminal
* @extends BaseElement
*
* @prop {String} [background=rgba(0,0,0,0.0)] background color
* @prop {String} [foreground=#000000] foreground color
* @prop {Number} [font-size=20] font size in number
* @prop {String} [font-family=Consolas, 'Ubuntu Mono', courier-new, courier, monospace] text font-family 
* @prop {Boolean} [noscroll=false] set true to make overflow as hidden 
* @prop {Boolean} [fixed=false] set true to disable "`" and "Esc" keys which toggle terminal 
* @prop {Boolean} [noinput=false] set true to make terminal readonly
*
* @cssvar {color} --flow-terminal-bg-color terminal background color
* @cssvar {color} --flow-terminal-color terminal foreground color
* @cssvar {color} --flow-terminal-cursor terminal cursor color
* @cssvar {color} --flow-terminal-selection terminal selection color
*
* @example
* <flow-terminal id="terminal" background="#000" foreground="#FFF"></flow-terminal>
* @example
* document.querySelector("#terminal").prompt();
*/
export class FlowTerminal extends BaseElement {
	/**
	* @member {String} [background=rgba(0,0,0,0.0)] background color
	* @memberof XTerminal#
	*/

	/**
	* @member {String} [foreground=#000000] foreground color
	* @memberof XTerminal#
	*/

	/**
	* @member {Number} [font-size=20] font size in number
	* @memberof XTerminal#
	*/

	/**
	* @member {String} [font-family=Consolas, 'Ubuntu Mono', courier-new, courier, monospace] text font-family 
	* @memberof XTerminal#
	*/

	/**
	* @member {Boolean} [noscroll=false] set true to make overflow as hidden 
	* @memberof XTerminal#
	*/

	/**
	* @member {Boolean} [fixed=false] set true to disable "`" and "Esc" keys which toggle terminal 
	* @memberof XTerminal#
	*/

	/**
	* @member {Boolean} [noinput=false] set true to make terminal readonly 
	* @memberof XTerminal#
	*/

	static get properties() {
		return {
			background : { type : String },
			foreground : { type : String },
			'font-size' : { type : Number },
			'font-family' : { type : String },
			noscroll : { type : Boolean },
			fixed : { type : Boolean },
			noinput : { type : Boolean },
			resident : { type : Number },
			/*data: { type: Array }*/
		};
	}
	static get styles() {
		return [ScrollbarStyle, css`
			:host {
				/*background-color: rgba(0,0,0,0.0);*/
				/*color: black;*/
				min-height:100px;
				min-width:100px;
				display:flex;
				flex-direction:column;
				box-sizing:border-box;
			}
			:host(.hidden){visibility:hidden}
			#terminal .terminal{height:100%;}
			
			#terminal{flex:1;height: 100%;overflow: hidden;}
			/******* imported from xterm module **********/
			.xterm {
			    font-feature-settings: "liga" 0;
			    position: relative;
			    user-select: none;
			    -ms-user-select: none;
			    -webkit-user-select: none;
			    font-size:20px;
			    letter-spacing:0;
			}
			.xterm.focus,
			.xterm:focus {
			    outline: none;
			}
			.xterm .xterm-helpers {
			    position: absolute;
			    top: 0;
			    /**
			     * The z-index of the helpers must be higher than the canvases in order for
			     * IMEs to appear on top.
			     */
			    z-index: 5;
			}
			.xterm .xterm-helper-textarea {
			    /*
			     * HACK: to fix IE's blinking cursor
			     * Move textarea out of the screen to the far left, so that the cursor is not visible.
			     */
			    position: absolute;
			    opacity: 0;
			    left: -9999em;
			    top: 0;
			    width: 0;
			    height: 0;
			    z-index: -5;
			    /** Prevent wrapping so the IME appears against the textarea at the correct position */
			    white-space: nowrap;
			    overflow: hidden;
			    resize: none;
			    font-size:20px;
			    letter-spacing:0;
			}
			.xterm .composition-view {
			    /* TODO: Composition position got messed up somewhere */
			    background: #000;
			    color: #FFF;
			    display: none;
			    position: absolute;
			    white-space: nowrap;
			    z-index: 1;
			}
			.xterm .composition-view.active {
			    display: block;
			}
			.xterm .xterm-viewport {
			    /* On OS X this is required in order for the scroll bar to appear fully opaque */
			    background-color: #000;
			    overflow-y: scroll;
			    cursor: default;
			    position: absolute;
			    right: 0;
			    left: 0;
			    top: 0;
			    bottom: 0;
			}
			.xterm .xterm-screen {
			    position: relative;
			}
			.xterm .xterm-screen canvas {
			    position: absolute;
			    left: 0;
			    top: 0;
			}
			.xterm .xterm-scroll-area {
			    visibility: hidden;
			}
			.xterm-char-measure-element {
			    display: inline-block;
			    visibility: hidden;
			    position: absolute;
			    top: 0;
			    left: -9999em;
			    line-height: normal;
			    letter-spacing:normal;
			    _width:9px;
			    overflow:hidden
			}
			.xterm {
			    cursor: text;
			}
			.xterm.enable-mouse-events {
			    /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
			    cursor: default;
			}
			.xterm.xterm-cursor-pointer {
			    cursor: pointer;
			}
			.xterm.column-select.focus {
			    /* Column selection mode */
			    cursor: crosshair;
			}
			.xterm .xterm-accessibility,
			.xterm .xterm-message {
			    position: absolute;
			    left: 0;
			    top: 0;
			    bottom: 0;
			    right: 0;
			    z-index: 10;
			    color: transparent;
			}
			.xterm .live-region {
			    position: absolute;
			    left: -9999px;
			    width: 1px;
			    height: 1px;
			    overflow: hidden;
			}
			.xterm-dim {
			    opacity: 0.5;
			}
			.xterm-underline {
			    text-decoration: underline;
			}
		`];
	}

	constructor() {
		// Must call superconstructor first.
		super();

		this.resident = 0;
		this.residentBuffers = [];
		this.residentBuffersLength = 0;
	}

	/**
	* Define a template for the new element by implementing LitElement's
	* `render` function. `render` must return a lit-html TemplateResult.
	*/
	render() {
		return html`<div id="colorClc"></div><div id="terminal"></div><div id="clipboard"></div>`;
	}

	/**
	* Initilize terminalHolder element then calls initTerminal(), initClipboard()
	*/
	firstUpdated() {
		this.terminalHolder = this.renderRoot.getElementById('terminal');
		this.colorClc = this.renderRoot.getElementById("colorClc");
		this.initTerminal();
		let clipboardHolder = this.renderRoot.getElementById('clipboard');
		this.initClipboard(this.terminalHolder, clipboardHolder);
		this._updateBGColorChange = this.updateBGColorChange.bind(this);
		document.body.addEventListener("flow-theme-changed", this._updateBGColorChange)
		this._updateBGColorChange();
	}

	getVarColor(varName, defaults, style){
		style = style || getComputedStyle(this);
		this.colorClc.style.color = style.getPropertyValue(varName) || defaults;
		return getComputedStyle(this.colorClc).color;
	}

	updateBGColorChange(){
		let style = getComputedStyle(this);
		let theme = this.term.getOption("theme") || this.termTheme;
		//console.log('%cOld Theme', `color:${theme.foreground};background-color:${theme.background}`, theme)
		
		let background = this.getVarColor('--flow-terminal-bg-color', theme.background, style);
		let foreground = this.getVarColor('--flow-terminal-color', theme.foreground, style);
		let cursor = this.getVarColor('--flow-terminal-cursor', theme.cursor || foreground, style);
		let selection = this.getVarColor('--flow-terminal-selection', theme.selection || foreground, style);

		theme.background = background;
		theme.foreground = foreground;
		theme.cursor = cursor;
		theme.selection = selection;

		//console.log('%cNew Theme', `color:${foreground};background-color:${background}`, theme)
		this.term.setOption('theme', theme)
		this.term._core._setTheme(theme)
	}

	removeBgColorListerner(){
		if(!this._updateBGColorChange)
			return
		document.body.removeEventListener("flow-theme-changed", this._updateBGColorChange)
	}

	/**
	* Initilize paste event handling process
	* @param {HTMLElement} eventEl terminalHolder element
	* @param {HTMLElement} holder textarea parent node, where new textarea will be created for paste event
	*/
	initClipboard(eventEl, holder){
		this.term.attachCustomKeyEventHandler((e)=>{
			if(e.type != 'keydown')
				return;
			this.onClipboardKeyDown(e);
		});
	}
	onClipboardKeyDown(e){
		if(e.key == "v" && (e.metaKey || e.ctrlKey)){
			//e.preventDefault();
			navigator.clipboard.readText().then((text) => {
				this.onClipboardPaste(text);
			})
		}
		else
		if(e.key == "c" && (e.metaKey || e.ctrlKey)){
			//e.preventDefault();
			let text = this.term.getSelection();
			if(text) {
				console.log("copying text to clipboard:",text);
				navigator.clipboard.writeText(text);
			}
		}
	}
	onClipboardPaste(value){
		this.term.focus();
		this.pasteText(value);
	}
	pasteText(text){
		if(this.running) {
			this.term.write(text);
		} else {
			let t = this.buffer.split('');
			t.splice(this.cursorX,0,text);
			this.buffer = t.join('');
			this.trail(this.cursorX, { rewind : true, offset : text.length });
			this.cursorX+=text.length;
		}
	}
	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			//this.log(`${propName} changed. oldValue: ${oldValue}, new: ${this[propName]}`);
			//if(propName == "data")
			//	this.updateGraph(this.data);
		});
	}

	trail (x, options) {
		const { rewind, eraseLast, offset } = options;
		let tail = this.buffer.substring(x)+(eraseLast?' ':'');
		this.term.write(tail);
		for(let i = 0; rewind && i < tail.length-(offset||0); i++)
			this.term.write('\b');
	}


	initTerminal(){

		/*
		this.log("INIT TERMINAL:", {
			fontSize: this['font-size'] || 20,
			background: this.background || 'rgba(0,0,0,0.0)',
			//background: 'rgba(255,255,255,0.75)',
			foreground: this.foreground || '#000000',
			noscroll : this.noscroll
		});
		*/

		let term = new Terminal({
			allowTransparency: true,
			fontFamily: this['font-family'] || 'Consolas, Ubuntu Mono, courier-new, courier, monospace',
			fontSize: this['font-size'] || 20,
			cursorBlink : true,
			theme: {
				background: this.background || 'rgba(0,0,0,0.0)',
				foreground: this.foreground || '#000000',
				cursor: this.cursor || this.foreground || "#FFF"
			}
		});
    	this.term = term;
    	this.termTheme = term.getOption("theme") || {}

    	window.terms = window.terms || [];
    	window.terms.push(term);

    	//this.log("termtermterm:theme", this.termTheme)
    	this.addons = {
	    	weblinks : new WebLinksAddon.WebLinksAddon((event,uri) => {
				this.handleLink(event,uri);
			}),
	    	fit : new FitAddon.FitAddon()
	    };

		//$(this.terminalHolder).on("keydown", e=>{
		this.terminalHolder.addEventListener("keydown", e=>{
				//this.log("e.key", e.key)
			if(e.ctrlKey || e.metaKey) {
				if(e.key == "+" || e.key == "="){
					this.setFontSizeDelta(1, e);
				}else if(e.key == "-" || e.key == "_"){
					this.setFontSizeDelta(-1, e);
				}
			}
		});

	    Object.entries(this.addons).forEach((e,i) => { 
	    	let [k,addon] = e; term.loadAddon(addon); 
	    	let instance = term._addonManager._addons[i];
	    	this.addons[k] = instance;
	    });
		//	https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-fit	
		//	https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-attach	
		//	term.loadAddon(new AttachAddon.AttachAddon(websocket));

		//term.open(document.getElementById("terminalx"));
		term.open(this.terminalHolder)
		this.buffer = '';
		this.cursorX = 0;
		this.history = [ ];
		this.historyIdx = 0;
		term.onResize(()=>{
			var size = {rows: term.rows, cols:term.cols};
			this.fire("terminal-resize", size);
			this.log('terminal-resize', size)
		})


		const keys = {
			Tab : (e, key) => {
				// TODO - completion handler
			},
			Backspace : (e, key) => {
				if(this.cursorX == 0)
					return;
				term.write('\b');
				this.cursorX--;
				let t = this.buffer.split('');
				t.splice(this.cursorX,1);
				this.buffer = t.join('');
				this.trail(this.cursorX, { rewind : true, eraseLast : true });
			},
			Delete : (e, key) => {
				let t = this.buffer.split('');
				t.splice(this.cursorX,1);
				this.buffer = t.join('');
				this.trail(this.cursorX, { rewind : true, eraseLast : true });
			},
			Inject : (e,key) => {
				let t = this.buffer.split('');
				t.splice(this.cursorX,0,key);
				this.buffer = t.join('');
				this.trail(this.cursorX, { rewind : true, offset : 1 });
				this.cursorX++;
			},
			Enter : async (e) => {
				e.stopPropagation();
				let { buffer, history } = this;
				let { length } = history;

				term.write('\r\n');
				this.buffer = '';
				this.cursorX = 0;

				if(buffer) {
					if(!length || history[length-1])
						this.historyIdx = length;
					else
						this.historyIdx = length-1;
					this.history[this.historyIdx] = buffer;
					this.historyIdx++;

					this.running = true;
					await this.digest(buffer);
					this.running = false;
				}

				this.prompt();
			},
			Escape : async (e) => { },
			PageDown : async (e) => { },
			PageUp : async (e) => { },
			Home : async (e) => { 
				let l = this.cursorX;
				term.write(`\x1B[${l}D`);
				this.cursorX = 0;
			},
			End : async (e) => { 
				let l = this.buffer.length - this.cursorX;
				term.write(`\x1B[${l}C`);
				this.cursorX = this.buffer.length;
			},
			ArrowLeft : (e, key) => {
				if(this.cursorX == 0)
					return;
				this.cursorX--;
				term.write(key);
			},
			ArrowRight : (e, key) => {
				if(this.cursorX < this.buffer.length) {
					this.cursorX++;
					term.write(key);
				}
			},
			ArrowUp : () => {
				if(this.historyIdx == 0)
					return;
				this.history[this.historyIdx] = this.buffer;
				this.historyIdx--;
				this.buffer = this.history[this.historyIdx] || '';
				this.term.write(`\x1B[2K\r${this.prompt_}${this.buffer}`);
				this.cursorX = this.buffer.length;
			},
			ArrowDown : () => {
				if(this.historyIdx >= this.history.length)
					return;

				this.history[this.historyIdx] = this.buffer;
				this.historyIdx++;
				this.buffer = this.history[this.historyIdx] || '';
				this.term.write(`\x1B[2K\r${this.prompt_}${this.buffer}`);
				this.cursorX = this.buffer.length;
			},
		}

		term.onKey((e_) => {

			if(this.noinput)
				return;

			const e = e_.domEvent;
			const termKey = e_.key;
			const { key, keyCode } = e;
			if(!this.fixed && (key == "`" || key == "Escape"))
				return this.toggleTerminal();

			if(this.stdinSink)
				return this.stdinSink({termKey,key,keyCode});

			const printable = !e.altKey && !e.ctrlKey && !e.metaKey && !key.match(/^F\d+$/);

			if(keys[key]) {
				keys[key](e,termKey);
			} else 
			if (printable) {
				keys.Inject(e,termKey);
			}

			//console.log('cursorX:',this.cursorX,'buffer:',this.buffer,'key:',key,'tk:',termKey);
			//console.log('x:',term._core.buffer.x,'plen:',this.promptLength);
			//console.log('keys:',key,keyCode,term._core.buffer);
			//console.log(this.buffer);
		});
		if(window.ResizeObserver){
			this.resizeObserver = new ResizeObserver(e => {
				this.updateTerminalSize();
			});
			this.resizeObserver.observe(this.terminalHolder);
		}
		this.setFontSize(this['font-size'] || this.getFontSize());

		if(this.noscroll) {
			let xtv = this.shadowRoot.querySelector(".xterm-viewport");
			xtv.style.overflow = 'hidden';
		}
	}
	get prompt_() {
		return `${this.promptPrefix?this.promptPrefix()+' ':''}$ `;
	}
	/**
	* prompt the terminal
	*/
	prompt(){
		this.cursorX = 0;
		this.buffer = '';

		let prompt = this.prompt_;
		this.term.write(prompt);
		this.promptLength = prompt.length;
	}

	enableResidentMode(length) {
		this.resident = length;
	}

	flushResidentBuffers() {
		while(this.residentBuffers.length)
			this.term.write(this.residentBuffers.shift());
	}

	writeToResidentBuffers(text) {
		if(!this.resident)
			return this.term.write(text);

		this.residentBuffers.push(text);
		this.residentBuffersLength += text.length;
		while(this.residentBuffersLength > this.resident && this.residentBuffers.length > 1) {
			let tip = this.residentBuffers.shift();
			this.residentBuffersLength -= tip.length;
		}
	}

	writeln(...args) {

		if(!args.length)
			args = [''];

		if(this.running) {
			this.term.write(args.join(' ')+'\r\n');
		}
		else {
			this.term.write(`\x1B[2K\r`+args.join(' ')+'\r\n');
			let prompt = `${this.prompt_}${this.buffer}`;
			this.term.write(prompt);
			let l = this.buffer.length-this.cursorX;
			while(l--)
				this.term.write('\b');
		}
	}
	write(text){
		this.writeln(text)
	}
	updateTerminalSize() {
		let term = this.term;
		//this.log("updateTerminalSize", this, this.term)
		//if(!$(this).width() || !term)
		if(!this.offsetWidth || !term)
			return
		let charSizeService = term._core._charSizeService
		if(charSizeService && !charSizeService.hasValidSize){
			charSizeService.measure()
			//if(term._core._renderService)
			//	term._core._renderService._updateDimensions();
		}
		let addon = this.addons.fit.instance;
		let dimensions = addon.proposeDimensions()
		addon.fit();
		//this.addons.fit.instance.fit();
	}
	/**
	* toggle terminal css class `hidden`
	*/
	toggleTerminal(){
		this.classList.toggle("hidden");
	}
	async digest(cmd) {
		return new Promise( async (resolve, reject) => {
			if(!cmd) {
				resolve();
				return;
			}

			if(cmd == 'history') {
				[...new Set(this.history)].forEach(t => this.write(t));
				resolve();
				return;
			}

			if(cmd == 'history reset') {
				this.history.forEach(t => this.write(t));
				resolve();
				return;
			}
			if(!this.sink)
				return resolve();

			this.sink.digest(cmd).then((resp)=>{
				if(resp && typeof(resp) == 'string')
					this.write(resp);
				resolve();
			},(err)=>{
				this.write((err||'unknown digest error').toString().brightRed);
				resolve();
			})
		})
	}
	registerSink(sink) {
		if(!sink.digest || !sink.complete)
			throw new Error("Missing digest() or complete() in the terminal sink");
		this.sink = sink;
	}

	captureStdin(sink) {
		this.stdinSink = sink;
	}

	releaseStdin(sink) {
		delete this.stdinSink;
	}

	isCaptured() {
		return !!this.stdinSink;
	}

	getSize() {
		return { rows: this.term.rows, cols: this.term.cols };
	}

	setFontSizeDelta(delta, e){
		this.setFontSize(this.getFontSize()+delta);
		if(e && e.preventDefault){
			e.preventDefault();
			e.stopPropagation();
		}
	}
	/**
	* Set font size and update terminal size
	* @param {number} [size=20] font size should be >= 7
	*/
	setFontSize(size){
		if(!size)
			size = 20;
		else
		if(size < 7)
			size = 7;
		this.setSetting("fontSize", size);
		this.term.setOption("fontSize", size)
		this.updateTerminalSize();
	}
	getFontSize(size){
		return parseFloat(this.getSetting("fontSize", size || 20));
	}
	increaseFontSize(){
		this.setFontSizeDelta(1);
	}
	decreaseFontSize(){
		this.setFontSizeDelta(-1);
	}
	getStorageKeyPrefix(){
		return (this.id || this.dataKey || "xterm")+"_";
	}
	getSetting(name, defaults){
		let key = this.getStorageKeyPrefix();
		let ls = window.localStorage || {};
		return ls[key+name] || defaults;
	}
	setSetting(name, value){
		let key = this.getStorageKeyPrefix();
		let ls = window.localStorage || {};
		ls[key+name] = value;
	}
	clear() {
		this.term.write(`\x1B[2J\x1B[H`);
	}
	handleLink(event, link) {
		this.linkHandler?.(event,link);
	}
	registerLinkHandler(fn) {
		this.linkHandler = fn;
	}
}

FlowTerminal.define("flow-terminal")
