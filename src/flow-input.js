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
* @cssvar {border-input} [--flow-input-border=2px]
* @cssvar {border-label} [--flow-input-border-label=2px]
* @cssvar {color} [--flow-border-invert-color=var(--flow-primary-invert-color, #FFF))]
* @cssvar {margin} [--flow-input-margin=5px 0px]
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
			placeholder:{type:String},
			label:{type:String}
		}
	}

	static get styles(){
		return css`
			:host{
				display:inline-block;vertical-align:middle;
				font-family:var(--flow-font-family, "Julius Sans One");
				font-weight:var(--flow-font-weight, bold);
				width:var(--flow-input-width, 100%);
				min-width:var(--flow-input-min-width, 100px);
				max-width:var(--flow-input-max-width, 500px);
				margin:var(--flow-input-margin, 5px 0px);
			}
			:host(:not([disabled])) .btn{
				cursor:pointer;
			}
			
			:host(:not([apply-btn])) .btn{
				display: none;
			}
			
			.wrapper{
				display:flex;
				align-items:stretch;
				min-width_:50px;
				text-align:center;
				justify-content:center;
			    margin-top:-0.5rem;
			}
			label{
				font-size:0.7rem;padding:2px 5px;
				/*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-input-border-label, 2px) solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
    			margin-left:10px;z-index:1;
    			position:relative;background-color:var(--flow-input-bg, inherit);
			}
			.btn{
				position:relative;
				padding:5px;
				background-color:var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border: 2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				overflow:hidden;
				border-radius:8px;
				border-top-left-radius: var(--flow-input-btn-tlbr, 0px);
    			border-bottom-left-radius: var(--flow-input-btn-blbr, 0px);
    			color:var(--flow-border-invert-color, var(--flow-primary-invert-color, #FFF));
    			display: flex;
			    justify-content: center;
			    align-items: center;
			}
			:host(:not([disabled])) .btn:hover{
				background-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)))
			}
			.input{
				width:100px;flex:1;box-sizing:border-box;
				/*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-input-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				/*
				border-top-left-radius: 8px;
				border-bottom-left-radius: 8px;
				*/
				border-radius: 8px;
    			margin:0px;
    			padding:16px 30px 10px 10px;
				background-color:var(--flow-input-bg, inherit);
				color:var(--flow-input-color, inherit);
				font-size:var(--flow-input-font-size, 1rem);
				font-weight:var(--flow-input-font-weight, 400);
				line-height:var(--flow-input-line-height, 1.2);
			}

			:host([apply-btn]) .input{
			    border-right-width:0px;
				border-top-right-radius: 0px;
				border-bottom-right-radius: 0px;
			}


			.input:focus{outline:none}
			.input::-webkit-input-placeholder { color: var(--flow-input-placeholder, #888 ); }
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
		<label ?hidden=${!this.label}>${this.label||""}</label>
		<div class="wrapper" @click=${this.onClick} ?has-value=${!!this.value}>
			<slot name="prefix"></slot>
			<input class="input" type="${this.type}" 
				placeholder="${this.placeholder || ''}"
				pattern="${this.pattern}"
				?disabled=${this.disabled} @change=${this.onChange} value="${this.value}" />
			<div class="btn">
				<div class="text"><flow-i18n text="${this.btnText || 'Apply'}"></flow-i18n></div>
			</div>
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