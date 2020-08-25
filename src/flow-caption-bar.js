import {BaseElement, html, css} from './base-element.js';
import {FlowI18nDialog} from './flow-i18n.js';






/**
 *
 * @export
 * @class FlowCaptionBar
 * @extends {BaseElement}
 * @property {String} [icon] [FaIcon]{@link FaIcon} css classes i.e `fal fa-chart-network`
 * @property {Array.<FlowTabConfig>} [tabs] [FlowTabs.tabs]{@link FlowTabs#tabs}
 * @property {String} [active-tab] [FlowTabs.active]{@link FlowTabs#active}
 * @property {String} [logo] url to the logo image
 * @property {String} [version] text containig version information
 * @property {String} [caption] window caption text
 * @prop {ActiveDisplay} target-display *blocked/active* display type for target elements (default: block)
 *
 * @example
 * <flow-caption-bar icon="fal fa-chart-network">FLOW</flow-caption-bar>
 * <flow-caption-bar logo="/resources/images/logo.png"></flow-caption-bar>
 * 
 * JavaScript
 * initCaption(){
 *		let caption = document.querySelector('flow-caption-bar');
		caption.close = ()=>{ ... };
		caption.logo = `/resources/images/logo-${this.theme}-bg.png`;
		caption.version = '1.0.0';
		caption.tabs = [{
			title : "Tab1",
			id : "tab1",
			cls: "tab1"
		},{
			title : "Tab2",
			id : "tab2"
		},{
			title : "Tab3",
			id : "tab3",
			disable: true,
			section: 'filter'
		}];

		caption["active"] = "tab1";
	}
 * @cssvar {font-family} [--flow-caption-bar-font-family=var(--flow-font-family, "Julius Sans One")]
 * @cssvar {font-weight} [--flow-caption-bar-font-weight=var(--flow-font-weight, bold)]
 * @cssvar {font-size} [--flow-caption-bar-font-size=var(--flow-font-size, 1.5rem)]
 * @cssvar {color} [--flow-caption-bar-primary-color=var(--flow-primary-color, rgba(0,151,115,1))]
 * @cssvar {color} [--flow-primary-color=rgba(0,151,115,1)]
 * @cssvar {margin} [--flow-caption-tabs-margin=0px]
 * @cssvar {background-color} [--flow-caption-logo-bg-color=var(--flow-background-color,#232323)]
 */
export class FlowCaptionBar extends BaseElement {
	static get properties() {
		return {
			caption : { type : String },
			version : { type : String },
			icon : { type : String },
			logo : { type : String },
			tabs : { type : Array},
			"active-tab" : { type : String },
			"target-display":{type: String, value:"block"}
		}
	}

	constructor() {
		super();
		this.tabs = null;
		this['target-display'] = 'block';
		if(typeof nw != 'undefined' && typeof nw.Window != 'undefined'){
			this.window = nw.Window.get();
			this.window.on("maximize", ()=>{
				//this.log("maximize")
				this.window._maximize = true;
				this.updateMaxIcon();
			});
			this.window.on("restore", ()=>{
				//this.log("restore")
				this.window._maximize = false;
				this.updateMaxIcon();
			})
			this.window.on("resize", ()=>{
				//this.log("resize")
				this.window._maximize = false;
				this.updateMaxIcon();
			})
		}
		else
			this.window = window;
	}

	static get styles() {
		return [this.svgStyle, css`
			/*div { border: 1px solid red; }*/
			:host {
				width: 100vw;
				user-select:none;
			}
			.host {
				width: calc(100vw - 8px);
				min-height: 28px;
				/* background-color: green; */
				display: flex;
				flex-direction: row;
				font-family: var(--flow-caption-bar-font-family, var(--flow-font-family, "Julius Sans One"));
				font-weight: var(--flow-caption-bar-font-weight, var(--flow-font-weight, bold));
				font-size: var(--flow-caption-bar-font-size, var(--flow-font-size, 1.5rem));
				color: var(--flow-caption-bar-primary-color, var(--flow-primary-color, rgba(0,151,115,1.0)));
				padding: 4px;
				/*border-bottom: 1px solid rgba(0,151,115,0.5);*/
			}

			.caption {
				-webkit-app-region: drag;
				padding-left: 8px;
				padding-top: 2px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				/*border: 1px solid red;*/
			}

			.tabs {
				flex: 1;
				margin:var(--flow-caption-tabs-margin, 0px);
				z-index:3;
			}
			svg.icon{
				cursor:pointer;
			}
			fa-icon,
			svg.icon:hove{
				margin: 0px 4px 0px 4px;
				--fa-icon-size: 28px;
				--fa-icon-color: var(--flow-primary-color, rgba(0,151,115,1.0));
			}

			fa-icon:hover,
			svg.icon:hove{
				filter: brightness(0.8);
			}
			fa-icon:active {
				transform: translate(1px,1px);	
			}

			.logo {
				left: 0px;
				top: 0px;
				width:52px;
				height:52px;
				background-position: center;
				background-size: contain;
				background-repeat: no-repeat;
				z-index: 4;
				background-color:var(--flow-caption-logo-bg-color,var(--flow-background-color,#232323));
				margin-left: -4px;
				padding: 4px 8px 4px 4px;
			}
			.caption{display:flex;flex-direction:column;}
			.version {
				font-size: 12px;
				/*border: 1px solid red;*/
				/*margin: 10px 8px 4px 4px;*/
				padding: 4px 8px 2px 4px;
				opacity: 0.75;
				font-family: "Consolas";
				display: flex;
				flex-direction: column;
			}
			.language-icon{position:relative;margin-right:10px;}
			.language-icon svg{cursor:pointer}
			.language-icon:after{
				content:"";
				position:absolute;
				top:12px;
				right:-5px;
				width:0px;
				height:0px;
				border:5px solid transparent;
				border-top:5px solid var(--flow-primary-color);
			}
			.logo-icon,.logo,.caption{-webkit-app-region:drag;cursor:move;}

			.caption-content { height: min-content;display:flex;flex-direction:row;  }
			*[flex] { flex: 1; }
			
		`];
	}

	render() {
		let tabs = this.tabs? this.tabs.slice(0):[];
		this.maxicon = (this.window._maximize ? 'window-restore':'window-maximize');
		return html`
			<div class='host'>
				${
					!this.icon?'':html
					`<svg class="icon" @click="${this.onIconClick}">
						<use href="${this.iconPath(this.icon)}"></use>
					</svg>`
				}
				${
					!this.logo?'':html
					`<div class="logo" @click="${this.onLogoClick}"
						style="background-image:url(${this.logo});"></div>`
				}
				<div class="caption">
					<div class="caption-content">
						<div class="title">
							${this.caption||html`<slot></slot>`}
						</div>
						<div class="version">
							<div flex></div>
							<div>
								${this.version?`v${this.version}`:html`<slot name='version'></slot>`}
							</div>
						</div>
					</div>
					<div flex>
					</div>
				</div>
				<div class="tabs">
				<flow-tabs active=${this['active-tab']} .tabs=${tabs} part="tabs"
					target-display="${this['target-display']}">
					<slot name="flow-tabs"></slot>
				</flow-tabs>
				</div>

				<div class="language-icon">
					<svg class="icon" @click="${this.onLangClick}">
						<use href="${this.iconPath('language')}"></use>
					</svg>
				</div>
				<svg class="icon" @click="${this.minimize}">
					<use href="${this.iconPath('window-minimize')}"></use>
				</svg>
				<svg class="icon" @click="${this.toggleMaximize}">
					<use href="${this.iconPath(this.maxicon)}"></use>
				</svg>
				<svg class="icon" @click="${this.close}">
					<use href="${this.iconPath('times-circle')}"></use>
				</svg>
			</div>
		`;
	}
	requestTabsUpdate(){
		this.shadowRoot.querySelector("flow-tabs").requestUpdate();
	}

	onIconClick(e){
		this.fire("flow-caption-icon-clicked", {e})
	}
	onLogoClick(e){
		this.fire("flow-caption-logo-clicked", {e})
	}
	onLangClick(e){
		this.openI18nDialog(e.target);
	}
	openI18nDialog(target){
		FlowI18nDialog.open(target);
	}
	updateMaxIcon(){
		this.maxicon = this.window._maximize?'window-restore':'window-maximize';
		this.update();
	}
	toggleMaximize(){
		if(this.window._maximize){
			this.window.restore();
		}else{
			this.window.maximize()
		}
	}
	minimize(e) { this.window.minimize(); }
	maximize(e) { this.window.maximize(); }
	close(e) { this.window.close(); }
}

FlowCaptionBar.define('flow-caption-bar');