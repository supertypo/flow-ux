import {FlowToggleBtn} from './flow-toggle-btn.js';

/**
 * @export
 * @class FlowRadioBtn
 * @extends {FlowToggleBtn}
 * @prop {Boolean} active is btn active?
 * @prop {Boolean} inputValue is value for multiple radio btn
 * 
 * @example
 * <flow-radio-btn inputvalue="xyz"></flow-radio-btn>
 * 
 */
export class FlowRadioBtn extends FlowToggleBtn {
	constructor(){
		super();
        this.radio = true;
	}
}

FlowRadioBtn.define('flow-radio-btn');