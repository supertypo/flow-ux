import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowFolderInput
* @extends BaseElement

* @property {Boolean} [disabled]
* @property {String} [btnText]
* @property {String} [value]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {background-color|border} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background|border} [--flow-border-hover-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {border-top-left-radius} [--flow-folder-input-tlbr=4px]
* @cssvar {border-bottom-left-radius} [--flow-folder-input-blbr, 4p]
* @cssvar {border-top-right-radius} [--flow-folder-input-trbr=4px]
* @cssvar {border-bottom-right-radius} [--flow-folder-input-brbr=4px]
* @cssvar {color} [--flow-border-invert-color=var(--flow-primary-invert-color, #FFF))]
* @cssvar {margin-right} [--flow-folder-input-vmr=2px]
* @cssvar {background-color} [--flow-input-bg=inherit]

* @example
*   <flow-folder-input></flow-folder-input>
*
*/
export class FlowFolderInput extends BaseElement {
	static get properties() {
		return {
			btnText:{type: String},
			value:{type:String},
			disabled:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-font-family, "Julius Sans One");
				font-weight:var(--flow-font-weight, bold);
				width:var(--flow-folder-input-width, 100%);
				min-width:var(--flow-folder-input-min-width, 100px);
				max-width:var(--flow-folder-input-max-width, 500px);
			}
			:host(:not([disabled])) label,
			:host(:not([disabled])) label input{
				cursor:pointer;
			}
			
			.wrapper{
				display:flex;
				align-items:stretch;
				min-width:50px;
				text-align:center;
				justify-content:center;
			}
			label{
				position:relative;
				padding:5px;
				background-color:var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				overflow:hidden;
				border-radius:8px;
				border-top-left-radius: var(--flow-folder-input-tlbr, 4px);
    			border-bottom-left-radius: var(--flow-folder-input-blbr, 4px);
    			color:var(--flow-border-invert-color, var(--flow-primary-invert-color, #FFF));
			}
			:host(:not([disabled])) label:hover{
				background-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)))
			}
			label input{
			    position: absolute;
			    left: 0px;
			    top: 0px;
			    right: 0px;
			    bottom: 0px;
			    font-size: 200px;
			    height: 63px;
			    background: #F00;
			    opacity:0;
			    z-index:-1;
			}
			label .text{
				z-index:1;
			}
			.value{
				position:relative;
			    display: flex;
			    align-items: center;
			    padding: 0px 30px 0px 5px;
				box-sizing: border-box;
				margin-right:var(--flow-folder-input-vmr, 2px);
				width:150px;flex:1;
				min-height:32px;
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
				border-top-right-radius: var(--flow-folder-input-trbr, 4px);
    			border-bottom-right-radius: var(--flow-folder-input-brbr, 4px);
    			background-color:var(--flow-input-bg, inherit);
			}
			.value>span{
				overflow:hidden;text-overflow:ellipsis;flex:1;white-space:nowrap;
				text-align:left;
			}
			:host([disabled]) .value{
				padding-right:10px;
			}
			.clear-btn{
				font-style: normal;
			    font-size: 25px;
			    padding: 0px 10px 0px 10px;
			    cursor: pointer;
			    display:none;
			    position: absolute;
			    right: 0px;
			    z-index: 1;
			}
			:host(:not([disabled])) [has-value] .clear-btn{display:block;}
		`;
	}
	render() {
		return html`
		<div class="wrapper" @click=${this.onClick} ?has-value=${!!this.value}>
			<slot name="prefix"></slot>
			<div class="value">
				<span>${this.value}</span>
				<i class="clear-btn" title="Clear" @click=${this.setClear}>&times;</i>
			</div>
			<label class="btn">
				<input type="file" ?disabled=${this.disabled} nwdirectory @change=${this.onChange} />
				<div class="text"><flow-i18n text="${this.btnText || 'Select Folder'}"></flow-i18n></div>
			</label>
			<slot name="sufix"></slot>
		</div>
		`;
	}

	setClear(){
		this.setValue("");
	}

	onClick() {
		this.fire("flow-folder-input-click", {el:this})
	}

	onChange(e) {
		let value = this.shadowRoot.querySelector("input").value;
		if(!value)
			return
		this.value = value;
		this.fire("changed", {el:this, value})
	}

	setValue(value){
		this.value = value;
		this.shadowRoot.querySelector("input").value = "";
		this.fire("changed", {el:this, value:this.value})
	}
}

FlowFolderInput.define('flow-folder-input');