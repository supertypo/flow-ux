import { FlowMenu } from './flow-menu.js';

/**
 * @export
 * @class FlowRadioBtns
 * @extends {BaseElement}
 * 
 * @example
 * 
 * <flow-radio-btns selected="btn2">
 *	<flow-radio-btn inputvalue="btn1">Btn 1</flow-radio-btn>
 *	<flow-radio-btn inputvalue="btn2">Btn 2</flow-radio-btn>
 *	<flow-radio-btn inputvalue="btn3">Btn 3</flow-radio-btn>
 * </flow-radio-btns>
 *
 * 
 */
export class FlowRadioBtns extends FlowMenu {
	constructor(){
		super();
		this.valueAttr = "inputvalue";
        this.selector = "flow-radio-btn";
	}
    connectedCallback(){
        this.classList.add("flow-btn-group");
        super.connectedCallback();
    }
	updateList(){
		this.list.forEach(item=>{
			let value = item.getAttribute(this.valueAttr)
			item.setActive(this.isSelected(value));
		});
	}
}

FlowRadioBtns.define('flow-radio-btns');