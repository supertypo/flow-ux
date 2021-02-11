//import '../resources/extern/dialog/dialog-polyfill.js';
import {BaseElement, html, css, baseUrl} from './base-element.js';

/**
* @class FlowDialog
* @extends BaseElement
* @example
*   <flow-dialog heading="Title">value</flow-dialog>
* @property {Boolean} [disabled] 
* @property {String} [heading] 
* @property {Array} [btns] 
* @property {Object} [body] 
*/
export class FlowDialog extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect:true},
			heading:{type:String},
			btns:{type:Array},
			body:{type:Object},
			hideCloseBtn:{type:Boolean},
			compact:{type:Boolean}
		}
	}

	static buildArgs(...arg){
		let args = arg.shift();
		let handler = arg[arg.length-1];
		if(typeof(args) == 'string'){
			args = {
				title:args,
				body:arg.shift(),
				cls:arg.shift(),
				btns:arg.shift(),
				modal:arg.shift(),
			};
		}
		args.handler = args.handler || args.callback;
		args.modal = args.modal !== false;

		if(!args.handler && typeof(handler) == 'function')
			args.handler = handler

		console.log("args", args)

		return args;
	}

	static getHandler(btnName,  args){
		let {btns, handler} = args;
		if(!btnName || !btns || !btns.length)
			return handler;

		let btn = btns.find(btn=>((btn.value||btn.text)+"").toLowerCase() == btnName);
		return btn? (btn.handler || btn.callback || handler):handler;
	}

	static _show(args){

		let {btns, body, title, modal, cls, hideCloseBtn, compact, alignTo} = args;
		let {autoClose} = args;
		let dg = document.createElement("flow-dialog");
		let promise = new Promise((resolve, reject)=>{
			let resolved = false;
			let onWindoClick = (e)=>{
				if(resolved){
					removeWinEventListener();
					return
				}
				let t = e.target;
				let menu = t && t.closest && t.closest("flow-dialog");
				if(menu != dg){
					removeWinEventListener();
					dg.destroy();
				}
			}
			let removeWinEventListener = ()=>{
				window.removeEventListener("click", onWindoClick)
			}
			let _resolve = (result)=>{
				if(resolved)
					return
				resolved = true;
				dg.remove();
				dg.removeEventListener("btn-click", onBtnClicked);
				removeWinEventListener();
				resolve(result);
			}
			let onBtnClicked = e=>{
				let result = e.detail;
				let {btn} = result;
				let handler = this.getHandler(btn, args);
				if(handler)
					return handler(_resolve, result, dg, btn, e);

				dg.resolve(result);
			}
			dg.resolve = _resolve;

			dg.addEventListener("btn-click", onBtnClicked)
			if(cls)
				dg.classList.add(cls);
			if(btns)
				dg.btns = btns;
			if(body)
				dg.body = body;
			if(title)
				dg.heading = title;
			if(hideCloseBtn)
				dg.hideCloseBtn = true;
			if(compact)
				dg.compact = true;
			if(alignTo)
				this.alignTo(alignTo, dg, args);


			document.body.append(dg)
			setTimeout(()=>{
				modal?dg.showModal():dg.show();
				if(autoClose){
					window.addEventListener("click", onWindoClick)
				}
			}, 100)
			
		})

		promise.dialog = dg;
		return promise
	}

	static alignTo(alignTarget, dialog, args){
		let {vOffset=0, hOffset=0, targetPos='left-bottom', dialogPos='left-top'} = args;
		let box = alignTarget.getBoundingClientRect();
		let dialogBox = dialog.getBoundingClientRect();
		let style = dialog.style;
		let [H,V] = targetPos.split("-");
		let [dH, dV] = dialogPos.split("-");
		let dVOpposite = dV=='top'?'bottom':'top';
		let dHOpposite = dH=='left'?'right':'left';
		style[dVOpposite] = 'unset';
		style[dHOpposite] = 'unset';
		let setPos = ()=>{
			style[dH] = (box[H]+hOffset)+"px";
			style[dV] = (box[V]+vOffset)+"px";
			
			/*
			if(targetPos == 'right-top'){
				
			}else{
				style.top = (box.bottom+vOffset)+"px";
				style.left = (box.right-dialogBox.width+hOffset)+"px";
			}
			*/
		}

		setPos();
		dialog.addEventListener("updated", e=>{
			let {dialog} = e.detail
			dialogBox = dialog.getBoundingClientRect();
			style = dialog.style;
			setPos();
		})
	}

	static alert(...args){
		return this._show(this.buildArgs(...args))
	}
	static show(...args){
		return this._show(this.buildArgs(...args))
	}

	static confirm(...args){
		args = this.buildArgs(...args);
		if(!args.btns){
			args.btns = ['Cancel', 'Yes:danger']
		}

		return this._show(args);
	}

	createRenderRoot(){
		return this;
	}

	render() {
		return html
		`<dialog @close=${this.onDialogClose} ?compact=${this.compact}>
			<div class="heading" ?hide=${!this.heading}>${this.heading}</div>
			<span class="close-btn" title="Close" ?hide=${this.hideCloseBtn}
				@click="${this.onCloseClick}">&times;</span>
			<div class="body">
				${this.renderBody()}
			</div>
			<div class="buttons" @click=${this.onBtnClick} ?hide=${!this.btns||!this.btns.length}>
				${this.renderBtns()}
			</div>
		</dialog>`;	
	}

	renderBody(){
		return this.body||"";
	}

	renderBtns(){
		let value, text, cls;
		return (this.btns || ['Ok'])
		.map(b=>{
			if(typeof(b)=='string'){
				let [t, c, v] = b.split(":");
				text = t;
				value = v || text;
				cls = c||'';
			}else{
				text = b.text;
				value = b.value || text;
				cls = b.cls||"";
			}
			return html
			`<flow-btn 
				class="${cls}" 
				value="${(value+"").toLowerCase()}">${text}</flow-btn>`
		})
	}

	firstUpdated(){
		this.dialog = this.renderRoot.querySelector('dialog');
		dialogPolyfill.registerDialog(this.dialog)
		if(this._show)
			this[this._show]();
	}

	updated(){
		super.updated();
		this.dispatchEvent(new CustomEvent('updated', {detail:{dialog:this.dialog}, bubbles:true}))
	}

	show(){
		if(this.dialog)
			return this.dialog.show()

		this._show = 'show';
	}
	showModal(){
		if(this.dialog)
			return this.dialog.showModal();
		this._show = 'showModal';
	}

	close(){
		this._show = false;
		if(this.dialog)
			this.dialog.close();
	}

	destroy(){
		this.close();
		this.remove();
	}

	onCloseClick(){
		if(this.resolve)
			return this.resolve({btn:"close"})
		this.destroy();
	}

	onDialogClose(e){
		if(!this.autoClose && this._show){
			this[this._show]();
			return
		}
		let detail = {e};
		this.dispatchEvent(new CustomEvent('closed', {detail}))
	}
	onBtnClick(e){
		let btnEl = e.target;
		let btn = btnEl.getAttribute("value");
		if(!btn)
			return
		let inputs = [...this.renderRoot.querySelectorAll(".input, flow-input, flow-checkbox, input, textarea, select,flow-menu")];
		let values = {};
		inputs.forEach(input=>{
			name = input.name||input.getAttribute("name")||input.getAttribute("data-name");
			values[name] = input.value;
		})
		let detail = {
			btn,
			values
		}

		//console.log("onBtnClick", detail)
		this.dispatchEvent(new CustomEvent('btn-click', {detail}))
	}
}

window.FlowDialog = FlowDialog;

FlowDialog.define('flow-dialog', [
	baseUrl+'resources/extern/dialog/dialog-polyfill.css',
	baseUrl+'/resources/extern/dialog/dialog-polyfill.js'
]);
