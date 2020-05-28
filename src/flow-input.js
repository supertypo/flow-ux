import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowInput
* @extends BaseElement

* @property {Boolean} [disabled]
* @property {String} [btnText]
* @property {String} [value]
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {background-color|border} [--flow-border-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background|border} [--flow-border-hover-color=var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {border-top-left-radius} [--flow-input-tlbr=4px]
* @cssvar {border-bottom-left-radius} [--flow-input-blbr, 4p]
* @cssvar {border-top-right-radius} [--flow-input-trbr=4px]
* @cssvar {border-bottom-right-radius} [--flow-input-brbr=4px]
* @cssvar {color} [--flow-border-invert-color=var(--flow-primary-invert-color, #FFF))]
* @cssvar {margin-right} [--flow-input-vmr=2px]
* @cssvar {background-color} [--flow-input-bg=inherit]

* @example
*   <flow-input></flow-input>
*
*/
export class FlowInput extends BaseElement {
	static get properties() {
		return {
			btnText:{type: String},
            value:{type:String},
            type:{type:String},
			disabled:{type:Boolean}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;
				font-family:var(--flow-font-family, "Julius Sans One");
				font-weight:var(--flow-font-weight, bold);
				min-width:400px;
			}
			:host(:not([disabled])) label,
			:host(:not([disabled])) label input{
				cursor:pointer;
			}
			
			.wrapper{
				display:flex;
				align-items:center;
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
				border-top-left-radius: var(--flow-input-tlbr, 4px);
    			border-bottom-left-radius: var(--flow-input-blbr, 4px);
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
				margin-right:var(--flow-input-vmr, 2px);
				flex:1;
				height:32px;
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
				border-top-right-radius: var(--flow-input-trbr, 4px);
    			border-bottom-right-radius: var(--flow-input-brbr, 4px);
    			background-color:var(--flow-input-bg, inherit);
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
    constructor() {
        super();
        this.type = 'text';
        this.value = '';
    }
	render() {
		return html`
		<div class="wrapper" @click=${this.onClick} ?has-value=${!!this.value}>
			<slot name="prefix"></slot>
			<div class="value">
				${this.value}
				<i class="clear-btn" title="Clear" @click=${this.setClear}>&times;</i>
			</div>
			<label class="btn">
				<input type="${this.type}" ?disabled=${this.disabled} nwdirectory @change=${this.onChange} />
				<div class="text"><flow-i18n text="${this.btnText || 'Apply'}"></flow-i18n></div>
			</label>
			<slot name="sufix"></slot>
		</div>
		`;
	}

	setClear(){
		this.setValue("");
	}

	onClick() {
		this.fire("flow-input-click", {el:this})
	}

	onChange(e) {
		let value = this.shadowRoot.querySelector("input").value;
		if(!value)
			return
		this.value = value;
		this.fire("change", {el:this, value})
	}

	setValue(value){
		this.value = value;
		this.shadowRoot.querySelector("input").value = "";
		this.fire("change", {el:this, value:this.value})
	}
}

FlowInput.define('flow-input');