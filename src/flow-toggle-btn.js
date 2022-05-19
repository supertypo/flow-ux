import {css} from './base-element.js';
import {FlowBtn} from './flow-btn.js';

/**
 * @export
 * @class FlowToggleBtn
 * @extends {FlowBtn}
 * @prop {Boolean} active is btn active?
 * @prop {Boolean} radio is btn a radio control?, will be effective using name property
 * @prop {Boolean} inputValue is value for multiple radio btn
 * 
 * @example
 * <flow-toggle-btn></flow-toggle-btn>
 * 
 */
export class FlowToggleBtn extends FlowBtn {
	static get properties() {
		return {
			active:{type:Boolean, reflect: true},
            radio:{type:Boolean, reflect: true},
			readonly:{type:Boolean, reflect: true},
			name:{type:String},
			inputValue:{type:String}
		}
	}
    static get styles(){
		return [FlowBtn.styles, css`
            :host([active]){
				background-color:var(--flow-btn-active-bg-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-color:var(--flow-btn-active-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				color:var(--flow-btn-active-invert-color, var(--flow-primary-invert-color, #FFF));
				--fa-icon-color:var(--flow-btn-active-invert-color, var(--flow-primary-invert-color, #FFF));
			}
			:host([active]:not([disabled]):hover){
				background-color:var(--flow-btn-hover-active-bg-color, var(--flow-btn-hover-border-color, var(--flow-primary-color, rgba(0,151,115,1))));
				border-color:var(--flow-btn-hover-active-border-color, var(--flow-btn-hover-border-color, var(--flow-primary-color, rgba(0,151,115,1))));
                color: var(--flow-btn-hover-active-color, var(--flow-btn-hover-color, inherit));
			}
			:host([active][radio]){
				cursor:default;
			}
        `]
    }
	constructor(){
		super();
		this.active = false;
	}
	get value(){
		return !!this.active;
	}
	set value(active){
		this.setActive(active)
	}
	click(e){
        super.click(e);
		this.toggle();
	}
	toggle(){
        if(this.radio && this.active)//radio btn cant be deactivated
            return
		this.setActive(!this.active)
	}
	setActive(active){
		let lastActive = this.active;
		this.active = !!active;
		if(lastActive != this.active)
			this.fireChangeEvent();
	}
	fireChangeEvent(){
		this.fire("changed", {
			active: this.active,
			name:this.name,
			value:this.inputValue||'ON'
		}, {bubbles:true});

		if(this.active && this.radio)
			this.fire("flow-toogle-btn-active", {
				name: this.name,
				el:this
			}, {}, window);
	}
	firstUpdated(...args){
		super.firstUpdated(...args);
        if(this.radio){
            this.registerListener("flow-toogle-btn-active", (e)=>{
                let {name, el} = e.detail||{};
                if(name == this.name && el!=this){
                    //console.log("el, name", el, name)
                    this.setActive(false);
                }
            });
        }
	}
}

FlowToggleBtn.define('flow-toggle-btn');