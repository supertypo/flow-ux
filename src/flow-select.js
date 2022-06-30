import {BaseElement, html, css, dpc} from './base-element.js';
import {FlowMenu} from './flow-menu.js';

/**
 * @export
 * @class FlowSelect
 * @extends {FlowMenu}

* @cssvar {font-family} [--flow-font-family="Julius Sans One"]
* @cssvar {font-size} [--flow-select-font-size-label=0.7rem]
* @cssvar {font-weight} [--flow-input-font-weight=400]
* @cssvar {font-size} [--flow-input-font-size=1rem]
* @cssvar {height} [--flow-select-input-height]
* @cssvar {line-height} [--flow-input-line-heigh=1.2]
* @cssvar {min-height} [--flow-select-selected-min-height=44px]
* @cssvar {min-width} [--flow-select-selected-min-width=100px]
* @cssvar {max-width} [--flow-select-selected-max-width=500px]
* @cssvar {background-color} [--flow-input-bg=inherit]
* @cssvar {border} [--flow-select-border-label=2px solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {border} [--flow-select-border=2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)))]
* @cssvar {color} [--flow-input-color=inherit]
* @cssvar {color} [--flow-input-placeholder=#888]
* @cssvar {padding} [--flow-select-padding-label=2px 5px]
* @cssvar {padding} [--flow-select-padding=5px]
* @cssvar {margin} [--flow-select-filter-input-margin=0px 0px 5px]
* @cssvar {color} [--flow-select-trigger-bg=transparent]
* @cssvar {color} [--flow-select-trigger-color= var(--flow-color, #000)]
* @cssvar {padding} [--flow-select-trigger-padding=0px]
* @cssvar {color} [--flow-select-trigger-hover-bg=transparent]
* @cssvar {color} [--flow-select-trigger-hover-color=var(--flow-dropdown-trigger-color)]
* @cssvar {height} [--flow-select-trigger-line-height=1]
* @cssvar {margin} [--flow-select-input-margin=0px]

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
			showfilter:{type:Boolean},
			backdrop:{type:Boolean},
			modal:{type:Boolean},
			filterText:{type:String},
			searchIcon:{type:String},
			disabled:{type:Boolean, reflect:true},
			placeholder:{type:String},
			"right-align":{type:Boolean}
		}
	}

	static get styles() {
		return [super.styles, css`
			:host{
				display:var(--flow-select-display, inline-block);vertical-align:middle;
				font-family:var(--flow-font-family, "Julius Sans One");
				padding:var(--flow-select-padding, 0px);
				margin:var(--flow-select-margin, 5px);
				width:var(--flow-select-width);
				max-width:var(--flow-select-max-width, 100%);
				height:var(--flow-select-height);
				--flow-dropdown-border:var(--flow-select-dropdown-border, 1px solid var(--flow-primary-color, #000));
				--flow-dropdown-trigger-bg:var(--flow-select-trigger-bg, transparent);
				--flow-dropdown-trigger-color:var(--flow-select-trigger-color, var(--flow-color, #000));
				--flow-dropdown-trigger-padding:var(--flow-select-trigger-padding, 0px);
				--flow-dropdown-trigger-hover-bg:var(--flow-select-trigger-hover-bg, transparent);
				--flow-dropdown-trigger-hover-color:var(--flow-select-trigger-hover-color, var(--flow-dropdown-trigger-color));
				--flow-dropdown-trigger-line-height:var(--flow-select-trigger-line-height, 1);
				--flow-dropdown-top:var(--flow-select-dropdown-border-top, -8px);
				--flow-dropdown-trigger-font-size:0px;
			}
			flow-dropdown{margin:0px;}
			.wrapper{
				display:flex;
				align-items:stretch;
				min-width:50px;
				text-align:center;
				/*justify-content:center;*/
				margin-top:var(--flow-select-wrapper-margin-top,-0.5rem);
				
				
			}
			label{
				/*font-size:0.7rem;
				padding:2px 5px;*/
				font-size:var(--flow-select-label-font-size, 0.7rem);
				padding:var(--flow-select-label-padding,2px 5px);
				/*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-select-label-border, 2px) solid  var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:8px;
				margin-left:var(--flow-select-label-margin-left,10px);
				margin-right: var(--flow-input-label-margin-right,20px);
				z-index:1;
    			position:relative;background-color:var(--flow-input-bg, inherit);
    			font-weight:var(--flow-font-weight, bold);
			}
			.input{
				
				flex:1;box-sizing:border-box;
			    /*border:2px solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));*/
				border: var(--flow-select-border, 2px) solid var(--flow-border-color, var(--flow-primary-color, rgba(0,151,115,1)));
				border-radius:var(--flow-select-input-border-radius, var(--flow-input-border-radius, 8px));
    			margin:var(--flow-select-input-margin, 0px);
    			padding:var(--flow-select-input-padding,16px 30px 10px 10px);
				background-color:var(--flow-select-input-bg, var(--flow-input-bg, inherit));
				color:var(--flow-input-color, inherit);
				font-size:var(--flow-input-font-size, 1rem);
				font-weight:var(--flow-input-font-weight, 400);
				line-height:var(--flow-input-line-height, 1.2);
				text-align:left;
				height:var(--flow-select-input-height);
				width:var(--flow-select-input-width);
			}
			:host(.no-border) .input.selected{
				border:0px;
			}
			[no-label] .input.selected{
				padding-top:var(--flow-select-no-label-input-padding-top, 10px);
			}
			.input:focus{outline:none}
			.input::-webkit-input-placeholder { color: var(--flow-input-placeholder, #888 ); }
			.input.selected{
				min-width:var(--flow-select-selected-min-width, 100px);
				max-width:var(--flow-select-selected-max-width, 500px);
				min-height:var(--flow-select-selected-min-height, 44px);
				position:relative;
				box-shadow:var(--flow-input-box-shadow);
				height:var(--flow-select-selected-height);	
				width:var(--flow-select-selected-width);
				overflow: hidden;
    			text-overflow: ellipsis;
			}
			.placeholder{
				color: var(--flow-input-placeholder, #888 );
			}
			[multiple] .input.selected span.item{
				margin:var(--flow-select-selected-item-margin, 2px 4px 2px 0);
				padding:var(--flow-select-selected-item-padding, 1px 5px);
				border-radius:var(--flow-select-selected-item-border-radius, 5px);
				border:var(--flow-select-selected-item-border, 1px solid var(--flow-primary-color, #DDD));
				line-height:var(--flow-input-line-height, 1.3);
			}
			[multiple] .input.selected{
				display:var(--flow-select-selection-display, flex);
				flex-wrap:var(--flow-select-selection-flex-wrap, wrap);
				min-height:var(--flow-select-selected-min-height, 60px);
				align-items:var(--flow-select-selection-align-items, center);
			}

			:host(:not([disabled])) .input.selected::after{
				content:"";display:inline-block;
				position:absolute;right:10px;
				top:var(--flow-select-dropdown-arrow, calc(50% - 2px));
				width:0px;height:0px;
				border:5px solid var(--flow-primary-color, #000);
				border-left-color:transparent;
				border-bottom-color:transparent;
				border-right-color:transparent;
			}
			flow-dropdown:not([multiple]) .input.selected{white-space:nowrap}
			.filter{
				padding-top:10px;border-radius:3px;
			}
			.filter-box{
				position:relative;display:flex;align-items:center;
				margin:var(--flow-select-filter-input-margin, 0px 0px 5px);
			}
			.filter-box[hidden]{display:none}
			.filter-box .clear-btn{
				position:absolute;right:10px;cursor:pointer;display:none;
				font-size:1.5rem;color:var(--flow-input-color, inherit);
			}
			.filter-box input[has-content]+.clear-btn{display:inline-block}
			.filter-box input{
				padding-left:30px;
			}
			.filter-box .icon{
				width:15px;height:15px;fill:var(--flow-primary-color);
				position:absolute;left:10px;
			}

			.dd ::slotted([flow-select-filtred]){display:none}
		`];
	}
	constructor(){
		super();
		this.textAttr = "data-text";
	}
	render() {
		let iconSrc = this.iconPath(this.searchIcon || "search");
		let isLabel = !!this.label;
		return html
		`<flow-dropdown ?multiple="${this.multiple}" ?backdrop="${this.backdrop}"
			?modal="${this.modal}"
			?disabled=${this.disabled}
			?no-label=${!isLabel}
			?right-align=${this["right-align"]}>
			<div slot="trigger">
				<label ?hidden=${!isLabel}>${this.label||""}</label>
				<div class="wrapper" @click=${this.onWrapperClick}>
					<slot name="prefix"></slot>
					<div class="input selected">
						${this.renderSelected()}&nbsp;
					</div>
					<slot name="sufix"></slot>
				</div>
				
			</div><div class="dd">
				<div class="filter-box" ?hidden=${!this.showfilter}>
					<svg class="icon">
						<use href="${iconSrc}"></use>
					</svg>
					<input class="input filter" type="text" 
						placeholder="${this.placeholder || 'Search...'}"
						?has-content=${this.filterText}
						.value="${this.filterText||''}"
						@keyup=${this.onSearch} />
					<a class="clear-btn" @click=${this.clearFilter}>&times;</a>
				</div>
				<div class="menu-list-container">
				<slot class="menu-list"></slot>
				${this.renderItems()}
				</div>
			</div>
		</flow-dropdown>`;
	}
	onWrapperClick(){
		//
	}

	renderItems(){
		return '';
	}

	renderSelected(){
		let map = new Map();
		this.list.forEach(item=>{
			let text = item.getAttribute(this.textAttr) || item.innerText;
			map.set(item.getAttribute(this.valueAttr), text)
		});

		let items = this._selected.map(s=>{
			if(!s)
				return '';
			return html`<span class="item" value="${s}">${map.get(s) || s}</span>`
		}).filter(a=>!!a);

		if(items.length)
			return items
		return html`<span class="placeholder">${this.placeholder||""}</span>`;
	}

	selectionChanged(){
		super.selectionChanged();
		if(!this.multiple && this.dropdown)
			this.dropdown.close();
	}

	firstUpdated(){
		super.firstUpdated();
		if(this.classList.contains("right-align"))
			this["right-align"] = true;
		this.dropdown = this.renderRoot.querySelector("flow-dropdown");
		let slot = this.renderRoot.querySelector('slot.menu-list');
		this.listSlot = slot;
		slot.addEventListener('slotchange', (e)=>{
			this.updateList();
		});
		this.parseSelected();
		this.requestUpdate("_selected", [])
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
		const rg = new RegExp(`${text}`, 'i');
		console.log("this.list", this.list);
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
