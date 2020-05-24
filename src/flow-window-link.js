

import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowWindowLink
* @extends BaseElement
*
* @property {String} [url]
* @property {String} [id]
* @property {String} [title]
* @property {Boolean} [disabled]
* @property {String} [icon] window icon
* @property {Number} [width]
* @property {Number} [height]
* @property {Boolean} [resizable]
* @property {Boolean} [frame]
* @property {Boolean} [transparent]
* @property {Number} [min_width]
* @property {Number} [min_height]
* @property {Number} [max_width]
* @property {Number} [max_height]
* @property {Boolean} [as_desktop]
* @property {Boolean} [always_on_top]
* @property {Boolean} [visible_on_all_workspaces] (OS X Only)
* @property {Boolean} [frame]
*
*
* @cssvar {font-family} [--font-family=var(--flow-font-family, "Open Sans")]
* @cssvar {font-weight} [--font-weight=var(--flow-font-weight, normal)]
* @cssvar {color} [--flow-link-color=var(--flow-link-color, #017b68)]
* @cssvar {color} [--flow-link-hover-color=var(--flow-link-hover-color, #017b68)]
* @cssvar {fill} [--flow-primary-color=rgba(0,151,115,1)]
*
* @example
*   <flow-window-link href="url">text</flow-window-link>
*
* http://docs.nwjs.io/en/latest/References/Manifest%20Format/#window-subfields
*
*/
export class FlowWindowLink extends BaseElement {
	static get properties() {
		return {
			disabled:{type:Boolean, reflect: true},
			icon:{type:String},
			url : { type : String },
			id : { type : String },
			title : { type : String },
			width : { type : Number },
			height : { type : Number },
			resizable : { type : Boolean },
			frame : { type : Boolean },
			transparent : { type : Boolean },
			fullscreen : { type : Boolean },
			min_width : { type : Number },
			min_height : { type : Number },
			max_width : { type : Number },
			max_height : { type : Number },
			as_desktop : { type : Boolean },
			always_on_top : { type : Boolean },
			visible_on_all_workspaces : { type : Boolean },
			frame : { type : Boolean },

		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-font-family, "Open Sans");
				font-weight:var(--flow-font-weight, normal);
			}
			:host([disabled]){
				opacity:0.5;
				cursor:default;
				pointer-events:none;
			}
			:host(:not([disabled])){
				cursor:pointer;
			}

			.link-wrapper {
				color: var(--flow-link-color, #017b68);
				display: flex;
			}

			.link-wrapper:hover {
				color: var(--flow-link-hover-color, #017b68);
			}
/*
			.icon-box {
				display: block;
				width: 16px;
				height: 16px;
				margin-bottom: -4px;
				opacity: 0.65;
			}

			.icon-box svg {
				fill: var(--flow-primary-color, #017b68);
				width: 100%;
				height: 100%;
			}
*/
			.content {
				display: block;
			}
		`;
	}

	constructor(){
		super();

		this.width = 1024;
		this.height = 768;
		this.resizable = true;
		this.frame = true;
		this.transparent = false;
		this.fullscreen = false;
		this.icon = undefined;
		this.min_width = undefined;
		this.min_height = undefined;
		this.max_width = undefined;
		this.max_height = undefined;
		this.as_desktop = false;
		this.always_on_top = false;
		this.visible_on_all_workspaces = false;
		this.frame = true; 
		this.show = true;
		this.url = '';

		if(!window.flow)
			window.flow = { };
		if(!window.flow['flow-window-link'])
			window.flow['flow-window-link'] = { windows : [ ] };
	}

	render() {
		//let iconSrc = this.iconPath(this.linkicon || `external-link-square-alt`);
		return html`
		<div class="link-wrapper" @click=${this.click}>
			<div class="content"><slot></slot></div>
		</div>
			`;
			//${ this.icon ? html`<div class="icon-box"><svg><use href="${iconSrc}"></use></svg></div>` : '' }
	}

	click() {
		this.fire("flow-window-link-click", {el:this})
		console.log("opening url:",this.url);
		//require('nw.gui').Shell.openExternal( this.href );

		const { id, title, width, height, resizable, frame, transparent, show, fullscreen, icon, min_width, min_height, max_width, max_height, as_desktop, always_on_top, visible_on_all_workspaces, frame } = this;

        if(this.url && typeof nw != 'undefined') {
            nw.Window.open(this.url, {
				id, title, width, height, resizable, frame, transparent, show, fullscreen, icon, min_width, min_height, max_width, max_height, as_desktop, always_on_top, visible_on_all_workspaces, frame, 
                //new_instance: true,
                // id: this.id,
                // title: this.title,
                // width: 1027,
                // height: 768,
                // resizable: true,
                // frame: true,
                // transparent: false,
                // show: true,
                // http://docs.nwjs.io/en/latest/References/Manifest%20Format/#window-subfields
            }, (win, b) => {

				window.flow['flow-window-link'].windows.push(win);

				//this.window = win;
				

                // console.log("win", win)
                // win.app = this;
                // global.abcapp = "123";
                // resolve();
            });
        }

	}
}

FlowWindowLink.define('flow-window-link');