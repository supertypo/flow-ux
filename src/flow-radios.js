import { FlowMenu } from './flow-menu.js';

/**
 * @export
 * @class FlowRadios
 * @extends {BaseElement}
 * 
 * @example
 * 
 * <flow-radios selected="btn2">
 *	<flow-radio inputvalue="btn1">Btn 1</flow-radio>
 *	<flow-radio inputvalue="btn2">Btn 2</flow-radio>
 *	<flow-radio inputvalue="btn3">Btn 3</flow-radio>
 * </flow-radios>
 *
 * 
 */
export class FlowRadios extends FlowMenu {
	constructor(){
		super();
		this.valueAttr = "inputvalue";
		this.selector = "flow-radio";
	}
	updateList(){
		this.list.forEach(item=>{
			let value = item.getAttribute(this.valueAttr)
			item.onclick = ()=>{};//<--- iphone issue
			item.setChecked(this.isSelected(value));
		});
	}
}

FlowRadios.define('flow-radios');