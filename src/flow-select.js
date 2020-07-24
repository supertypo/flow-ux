import {BaseElement, html, css, dpc} from './base-element.js';
import {FlowMenu} from './flow-menu.js';

/**
 * @export
 * @class FlowSelect
 * @extends {FlowMenu}

 * @cssvar {margin} [--flow-select-margin=5px 0px]
 * @cssvar {border-select} [--flow-input-border=2px]
 * @cssvar {border-label} [--flow-select-border-label=2px]
 * 
 * @example
 * <flow-select label="menu" selected="0">
 *		<flow-menu-item value="0">Menu Item 1</flow-menu-item>
 *	 	<flow-menu-item value="1">Menu Item 2</flow-menu-item>
 * </flow-select>
 */
export class FlowSelect extends FlowMenu {
	static get properties() {
		return {
			label:{type:String},
			textAttr:{type:String},
			hidefilter:{type:Boolean},
			filterText:{type:String}
		}
	}

	static get styles() {
		return [super.styles, css`
			:host{
				display:inline-block;vertical-align:middle;
				font-family:var(--flow-font-family, "Julius Sans One");
				--flow-dropdown-trigger-bg:var(--flow-select-trigger-bg, transparent);
				--flow-dropdown-trigger-color:var(--flow-select-trigger-color, var(--flow-color, #000));
				--flow-dropdown-trigger-padding:var(--flow-select-trigger-padding, 5px 5px);
				--flow-dropdown-trigger-hover-bg:var(--flow-select-trigger-hover-bg, transparent);
				--flow-dropdown-trigger-hover-color:var(--flow-select-trigger-hover-color, var(--flow-dropdown-trigger-color));
				--flow-dropdown-trigger-line-height:var(--flow-select-trigger-line-height, 1);
				/*padding:0px;*/
			}
			flow-dropdown{margin:0px;}
			.wrapper{
				display:flex;
				align-items:stretch;
				/*min-width:50px;*/
				text-align:center;
				justify-content:center;
			    margin-top:-0.5rem;
			}
			label{
				font-size:0.7rem;padding:2px 5px;
				/*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-select-border-label, 2px) solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
    			margin-left:10px;z-index:1;
    			position:relative;background-color:var(--flow-input-bg, inherit);
    			font-weight:var(--flow-font-weight, bold);
			}
			.input{
				flex:1;box-sizing:border-box;
			    /*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-select-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius: 8px;
    			margin:0px;
    			padding:16px 30px 10px 10px;
				background-color:var(--flow-input-bg, inherit);
				color:var(--flow-input-color, inherit);
				font-size:var(--flow-input-font-size, 1rem);
				font-weight:var(--flow-input-font-weight, 400);
				line-height:var(--flow-input-line-height, 1.2);
				text-align:left;
			}
			.input:focus{outline:none}
			.input::-webkit-input-placeholder { color: var(--flow-input-placeholder, #888 ); }
			.selected{
				min-width:var(--flow-select-selected-min-width, 100px);
				max-width:var(--flow-select-selected-max-width, 500px);
				min-height:var(--flow-select-selected-min-height, 44px);
			}
			flow-dropdown:not([multiple]) .selected{white-space:nowrap}
			.filter{
				padding-top:10px;border-radius:3px;
			}
			.filter-box{
				position:relative;display:flex;align-items:center;
				margin:var(--flow-select-filter-input-margin, 0px 0px 5px);
			}
			.filter-box .clear-btn{
				position:absolute;right:10px;cursor:pointer;display:none;
				font-size:1.5rem;color:var(--flow-input-color, inherit);
			}
			.filter-box input[has-content]+.clear-btn{display:inline-block}

			::slotted([flow-select-filtred]){display:none}
		`];
	}
	constructor(){
		super();
		this.textAttr = "data-text";
	}
	render() {
		return html
		`<flow-dropdown ?multiple="${this.multiple}">
			<div slot="trigger">
				<label ?hidden=${!this.label}>${this.label||""}</label>
				<div class="wrapper" @click=${this.onClick}>
					<slot name="prefix"></slot>
					<div class="input selected">
						${this.renderSelected()}&nbsp;
					</div>
					<slot name="sufix"></slot>
				</div>
				
			</div><div>
				<div class="filter-box">
					<input class="input filter" type="text" 
						placeholder="${this.placeholder || 'Search...'}"
						?hidden=${this.hidefilter}
						?has-content=${this.filterText}
						.value="${this.filterText||''}"
						@keyup=${this.onSearch} />
					<a class="clear-btn" @click=${this.clearFilter}>&times;</a>
				</div>
				<slot class="menu-list"></slot>
			</div>
		</flow-dropdown>`;
	}

	renderSelected(){
		let map = new Map();
		this.list.forEach(item=>{
			let text = item.getAttribute(this.textAttr) || item.innerText;
			map.set(item.getAttribute(this.valueAttr), text)
		})
		return this._selected.map(s=>html
			`<span class="item" value="${s}">${map.get(s) || s}</span>`
		)
	}

	firstUpdated(){
		super.firstUpdated();
		let slot = this.renderRoot.querySelector('slot.menu-list');
		this.listSlot = slot;
		slot.addEventListener('slotchange', (e)=>{
			this.updateList();
		});
	}

	updateList(changes){
		super.updateList();
		if(!changes)
			this.requestUpdate("_selected", this._selected.slice(0))
	}

	clearFilter(){
		this.filterText = "";
		this.filterList("");
	}

	onSearch(e){
		let text = e.target.value;

		this.filterText = text;
		this.debounce('onSearch', ()=>{
			this.filterList(text);
		}, 200)
	}
	filterList(text){
		const rg = new RegExp(`^${text}`, 'i');
		this.list.forEach(item=>{
			let text = item.getAttribute(this.textAttr) || item.innerText;
			let value = item.getAttribute(this.valueAttr);
			if(!text || rg.test(value) || rg.test(text)){
				item.removeAttribute('flow-select-filtred')
			}else{
				item.setAttribute('flow-select-filtred', true)
			}
		})
	}


	/*
	onWindowResize(){
		this.updateDropdownSize();
	}
	onParentScroll(){
		this.updateDropdownSize();
	}
	
	connectedCallback(){
    	super.connectedCallback();
    	
    }
	disconnectedCallback(){
    	super.disconnectedCallback();
    	
    }
    */
}

FlowSelect.define('flow-select');
