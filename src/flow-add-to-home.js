import {
	BaseElement, html, css, getLocalSetting, setLocalSetting
} from './base-element.js';


/**
* @class FlowAddToHome
* @extends BaseElement
* @example
*   <flow-add-to-home icon="logo.png"
		message="Add App to Home screen"></flow-add-to-home>
* @property {Boolean} [disabled] 
* @cssvar {font-family} [--flow-add2home-font-family=var(--flow-font-family, initial)]
*/
export class FlowAddToHome extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			icon:{type:String},
			closeIcon:{type:String},
			message:{type:String},
			once:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{
				display:var(--flow-add2home-display, block);
				margin: var(--flow-add2home-margin);
				padding:var(--flow-add2home-padding, 10px);
				border: var(--flow-add2home-border, 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1))));
				border-radius:var(--flow-add2home-radius, 2px);
				border-width:var(--flow-add2home-border-width, 2px);
				font-family:var(--flow-add2home-font-family, var(--flow-font-family, initial));
				font-weight:var(--flow-add2home-font-weight, var(--flow-font-weight, bold));
				font-size:var(--flow-add2home-font-size, initial);
				line-height:var(--flow-add2home-line-height, inherit);
				text-transform:var(--flow-add2home-text-transform, inherit);
				user-select: none;
				background-color:var(--flow-add2home-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-add2home-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-add2home-invert-color, var(--flow-primary-invert-color, #FFF));
				--fa-icon-color:var(--flow-add2home-invert-color, var(--flow-primary-invert-color, #FFF));
				--fa-icon-size-temp:var(--fa-icon-size);
				cursor:pointer;
			}
			.icon{
				--fa-icon-size:var(--flow-add2home-icon-size, var(--fa-icon-size-temp, 20px));
				--fa-icon-padding:var(--flow-add2home-icon-padding, var(--fa-icon-padding));
				background-color:var(--flow-add2home-icon-bg);
				margin:0px 10px;
			}
			:host(:hover){
				background-color:var(--flow-add2home-hover-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color: var(--flow-add2home-hover-color);
			}
			.message{flex:1;word-wrap:break-word;}
			.close-icon{background-color:none}
			.wrapper{
				display:flex;
				align-items:center;
				margin:var(--flow-add2home-wrapper-margin, 0px);
				min-width:var(--flow-add2home-wrapper-min-width, 50px);
				text-align:center;
				justify-content:center;
				height:100%;
				box-sizing:border-box;
			}
			:host(:not(.active)){
				display:none;
			}
		`;
	}
	constructor(){
		super()
		
		if(getLocalSetting('add-to-home-disabled')==1){
			this.disabled = true;
		}else{
			//this.classList.add("active")
		}
		this.setAttribute('role', 'button');
	}
	render() {
		let {icon='', closeIcon='times'} = this;
		return html`
		<div class="wrapper">
			${icon?html`<fa-icon class="icon"
				icon=${icon} @click="${this.onAddClick}"></fa-icon>`:''}
			<div class="message" @click="${this.onAddClick}">
				${this.message||''}
				<slot></slot>
			</div>
			<fa-icon class="close-icon" icon=${closeIcon}
				@click="${this.onCloseClick}"></fa-icon>
		</div>`;
	}
	connectedCallback(){
		super.connectedCallback();
		if(!this.disabled)
			this.init();
	}
	init(){
		window.addEventListener('beforeinstallprompt', (e) => {
			//alert("beforeinstallprompt:"+e)
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			this.deferredPrompt = e;
			this.classList.add("active");
		})
	}

	onAddClick() {
		if(this.disabled || !this.deferredPrompt)
			return
		this.fire("add", {el:this})
		this.deferredPrompt.prompt();
		this.deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			} else {
				console.log('User dismissed the A2HS prompt');
			}
			this.deferredPrompt = null;
			this.close(choiceResult.outcome);
		});
	}
	onCloseClick(){
		this.close('closed');
	}
	close(reason='closed'){
		if(this.once){
			setLocalSetting('add-to-home-disabled', 1)
		}
		this.classList.remove("active");
		this.fire("closed", {el:this, reason})
	}
}

FlowAddToHome.define('flow-add-to-home');
