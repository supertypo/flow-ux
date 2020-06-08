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
			disabled:{type:Boolean},
			pattern:{type:String},
			validator:{type:Function},
			placeholder:{type:String}
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
				border-top-left-radius: var(--flow-input-label-tlbr, 0px);
    			border-bottom-left-radius: var(--flow-input-label-blbr, 0px);
    			color:var(--flow-border-invert-color, var(--flow-primary-invert-color, #FFF));
			}
			:host(:not([disabled])) label:hover{
				background-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)))
			}
			.input{
				border:0px;flex:1;
			    padding:0px 5px;box-sizing:border-box;
			    border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
			    border-right-width:0px;
			    border-top-left-radius: 8px;
    			border-bottom-left-radius: 8px;
			}
			.input:focus{outline:none}
			.input::-webkit-input-placeholder { color: var(--flow-input-placeholder, #888 ); }
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
			:host(.invalid) .input{color:var(--flow-input-invalid-color, red)}
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
			<input class="input" type="${this.type}" 
				placeholder="${this.placeholder || ''}"
				pattern="${this.pattern}"
				?disabled=${this.disabled} @change=${this.onChange} value="${this.value}" />
			<label class="btn">
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

	validate(value){
		let {pattern} = this;
		if(pattern){
			try{
				pattern = new RegExp(pattern)
			}catch(e){
				this.log("pattern error:", e)
				return false;
			}
			if(!pattern.test(value))
				return false;
		}
		if(typeof this.validator == 'function'){
			return this.validator(value, this);
		}
		return true;
	}

	onChange(e) {
		let value = this.shadowRoot.querySelector("input").value;
		if(!value)
			return
		if(!this.validate(value)){
			this.classList.add("invalid")
			return
		}
		this.classList.remove("invalid")
		//this.log("value", value)

		this.value = value;
		this.fire("changed", {el:this, value})
	}

	setValue(value){
		this.value = value;
		this.shadowRoot.querySelector("input").value = "";
		this.fire("changed", {el:this, value:this.value})
	}
}

FlowInput.define('flow-input');