import {BaseElement, html, css} from './base-element.js';

/**
* @class FlowDownloadBadge
* @extends BaseElement
* @property {String} [file]
* @property {String} [icon]
* @property {String} [title]
* @property {String} [descr]
* @property {String} [sha1]
* @example
*   <flow-download-badge icon="" title=""></flow-download-badge>
*
*
*/
export class FlowDownloadBadge extends BaseElement {
	static get properties() {
		return {
			file:{type:String},
			icon:{type:String},
			title:{type:String},
			descr:{type:String},
			sha1:{type:String}
		}
	}

	static get styles() {
		return css`
			:host{display:flex;flex-direction:row;align-items:center;}
			.title{min-width:var(--flow-download-badge-title-min-width, 230px);}
			.icon{
			    min-width:var(--flow-download-badge-icon-size, 24px);
			    min-height:var(--flow-download-badge-icon-size, 24px);
			    background-position:center;
			    background-repeat:no-repeat;background-size:contain;margin-bottom:-10px;
			    margin:var(--flow-download-badge-icon-margin, 0px 14px 0px 0px);
			}
			.file-link{
				display:flex;flex-direction:row;
				align-items:var(--flow-download-badge-file-link-align-items, center);
				padding:var(--flow-download-badge-file-link-padding, 6px);
				font-size:var(--flow-download-badge-file-link-font-size, 16px);
			}
			[disable]{pointer-event:none}
			a{color: var(--flow-link-color, #017b68);}
			a:not([disable]):hover{
				color: var(--flow-link-hover-color, #017b68);
			}
			[hide]{display:none}
			[row]{display:flex;flex-direction:row;}
			[col]{display:flex;flex-direction:column;}
		`;
	}

	render() {
		return html`
			<div class="file-link" href="${this.file}">
				<div class="icon" style="background-image:url(${this.icon})"></div>
				<div col>
					<div class="title">${this.title}</div>
					<div class="descr">${this.descr}</div>
				</div>
            	<slot></slot>
        	</div>
        	<div class="sha-link" href="${this.sha1}" ?hide="${!this.sha1}">
        		<div class="sha">SHA1</div>
        	</div>
    	</div>`;
	}
}

FlowDownloadBadge.define('flow-download-badge');
