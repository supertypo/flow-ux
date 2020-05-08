import {BaseElement, html, css} from './base-element.js';

export class FlowFormRegion extends BaseElement {

	static get styles() {
		return css`
		`;
	}

	render() {
		return html`
			<div class='region'>
			icon
			field
			question region
			</div>
		`;
	}
}

FlowFormRegion.define('flow-form-region');