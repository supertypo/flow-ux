import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowBtnGroup
 * @extends {BaseElement}
 * 
 * @example
 * 
 * <flow-btn-group>
 *	<flow-btn>Btn 1</flow-btn>
 *	<flow-btn>Btn 2</flow-btn>
 *	<flow-btn>Btn 3</flow-btn>
 * </flow-btn-group>

 * <flow-btn-group vertical>
 *	<flow-btn>Btn 1</flow-btn>
 *	<flow-btn>Btn 2</flow-btn>
 *	<flow-btn>Btn 3</flow-btn>
 * </flow-btn-group>
 *
 * 
 */
export class FlowBtnGroup extends BaseElement {
	createRenderRoot(){
		return this;
	}
}

FlowBtnGroup.define('flow-btn-group');