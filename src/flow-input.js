import {BaseElement, html, css} from './base-element.js';


/**
* @class FlowInput
* @extends BaseElement

* @property {Boolean} [disabled]
* @property {String} [btnText]
* @property {String} [value]
*
*
* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-weight} [--flow-font-weight=bold]
* @cssvar {font-weight} [--flow-input-font-weight=400]
* @cssvar {font-size} [--flow-input-font-size-label=0.7rem]
* @cssvar {font-size} [--flow-input-font-size=1rem]
* @cssvar {width} [--flow-input-width=100%]
* @cssvar {min-width} [--flow-input-min-width=100px]
* @cssvar {max-width} [--flow-input-max-width=500px]
* @cssvar {height} [--flow-input-height]
* @cssvar {line-height} [--flow-input-line-height=1.2]
* @cssvar {background-color} [--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background-color} [--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {background-color} [--flow-input-bg=inherit]
* @cssvar {border} [--flow-input-border-label=2px solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {border} [--flow-input-border=2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1))]
* @cssvar {border-top-left-radius} [--flow-input-btn-tlbr=0px]
* @cssvar {border-bottom-left-radius} [--flow-input-btn-blbr=0px]
* @cssvar {border-color} [--flow-border-hover-color, var(--flow-primary-color, rgba(0,151,115,1)]
* @cssvar {color} [--flow-border-invert-color, var(--flow-primary-invert-color, #FFF)]
* @cssvar {color} [--flow-input-color=inherit]
* @cssvar {color} [--flow-input-placeholder=#888]
* @cssvar {color} [--flow-input-invalid-color=red]
* @cssvar {padding} [--flow-input-padding-label=2px 5px]
* @cssvar {margin} [--flow-input-margin=5px 0px]
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
			label:{type:String},
			readonly:{type:Boolean},
			"clear-btn":{type:Boolean, reflect:true}
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
				font-size:0px;
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
				text-align:left;
				justify-content:center;
				margin-top:var(--flow-input-wrapper-margin-top,-0.5rem);
				height:var(--flow-input-wrapper-height);
			}
			label{		
				font-size:var(--flow-input-label-font-size, 0.7rem);
				padding:var(--flow-input-label-padding,2px 5px);
				border: var(--flow-input-label-border, 2px) solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-input-label-border-radius, 8px);
				margin-left: var(--flow-input-label-margin-left,10px);
				z-index: var(--flow-input-label-z-index, 1);
				position: var(--flow-input-label-position, relative);
				background-color:var(--flow-input-bg, inherit);
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
				width:var(--flow-input-input-width,100px);
				flex:1;box-sizing:border-box;
				height:var(--flow-input-height);
				border: var(--flow-input-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-input-border-radius, 8px);
    			margin:0px;
    			padding:var(--flow-input-padding,10px);
				background-color:var(--flow-input-bg, inherit);
				color:var(--flow-input-color, inherit);
				font-size:var(--flow-input-font-size, 1rem);
				font-weight:var(--flow-input-font-weight, 400);
				font-family:var(--flow-input-font-family);
				line-height:var(--flow-input-line-height, 1.2);
				box-shadow:var(--flow-input-box-shadow);
				text-align:var(--flow-input-text-align);
				min-width:var(--flow-input-input-min-width, 10px);
			}

			:host([apply-btn]) .input,
			:host([sufix-btn]) .input{
			    border-right-width:0px;
				border-top-right-radius: 0px;
				border-bottom-right-radius: 0px;
			}
			:host([sufix-btn]) ::slotted([slot="sufix"]){
				border-top-left-radius: 0px;
				border-bottom-left-radius: 0px;
				margin-bottom:0px;
			}

			:host([outer-border]) .input,
			:host([clear-btn]) .input{
				border:0px;
				height:calc(var(--flow-input-height) - 4px);
				background-color:transparent;
				box-shadow:none;
			}
			:host([outer-border]) .wrapper,
			:host([clear-btn]) .wrapper{
				border:var(--flow-input-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-input-border-radius, 8px);
				background-color:var(--flow-input-bg, inherit);
				color:var(--flow-input-color, inherit);
				box-shadow:var(--flow-input-box-shadow);
			}


			.input:focus{outline:none}
			.input::-webkit-input-placeholder { color: var(--flow-input-placeholder, #888 ); }
			:host([disabled]) .value{
				padding-right:10px;
			}
			.clear-btn{margin:5px 10px;align-self:center;cursor:pointer}
			:host(.invalid) .input{color:var(--flow-input-invalid-color, red)}
			.wrapper:not([has-value]) ::slotted([hide-on-empty]),
			.wrapper:not([has-value]) .clear-btn{
				display:none
			}
		`;
    }
    constructor() {
        super();
        this.type = 'text';
        this.value = '';
        this.renderRoot.addEventListener("click", (e)=>{
        	this._onClick(e);
        })
    }
	render() {
		return html`<label ?hidden=${!this.label}>${this.label||""}</label>
		<div class="wrapper" @click=${this.onClick} ?has-value=${!!this.value}>
			<slot name="prefix"></slot>
			<input class="input" type="${this.type}" spellcheck="false"
				placeholder="${this.placeholder || ''}"
				pattern="${this.pattern||''}"
				?readonly=${this.readonly}
				?disabled=${this.disabled} 
				@change=${this.onChange}
				@input=${this.onInput}
				.value="${this.value}" />
			<div class="btn">
				<div class="text"><flow-i18n text="${this.btnText || 'Apply'}"></flow-i18n></div>
			</div>
			${this['clear-btn']?html`
				<fa-icon clear-input class="clear-btn"
						slot="sufix" icon="times"></fa-icon>
			`:''}
			<slot name="sufix"></slot>
		</div>
		`;
	}

	setClear(){
		this.setValue("");
	}

	_onClick(e){
		if(e.target.closest("[clear-input]")){
			this.clear();
		}
	}

	onClick(e) {
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

	clear(){
		let value = "";
		this.value = value;
		this.fire("changed", {el:this, value});
		this.fire("inputted", {el:this, value})
	}

	onChange(e) {
		let value = this.renderRoot.querySelector("input").value;
		if(!this.validate(value)){
			this.classList.add("invalid")
			return
		}
		this.classList.remove("invalid")
		//this.log("value", value)

		this.value = value;
		this.fire("changed", {el:this, value})
	}
	onInput(e) {
		let value = this.renderRoot.querySelector("input").value;
		if(!this.validate(value)){
			this.classList.add("invalid")
			return
		}
		this.classList.remove("invalid")
		//this.log("value", value)

		this.value = value;
		this.fire("inputted", {el:this, value})
	}

	setValue(value){
		this.value = value;
		this.renderRoot.querySelector("input").value = "";
		this.fire("changed", {el:this, value:this.value})
	}
	getInputValue(){
		return this.renderRoot.querySelector("input").value
	}
}

FlowInput.define('flow-input');