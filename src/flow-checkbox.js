import {BaseElement, html, css} from './base-element.js';

/**
 * @export
 * @class FlowCheckbox
 * @extends {BaseElement}
 * @prop {Boolean} checked is ckecbox checked?
 * 
 * @example
 * <flow-checkbox></flow-checkbox>
 *
 * @cssvar {color} [--flow-checkbox-color=var(--flow-border-color, rgba(0,0,0,.54))]
 * @cssvar {background-color} [--flow-checkbox-bg=var(--flow-input-bg, inherit))]
 * @cssvar {background|border-color} [--flow-checkbox-checked-color=var(--flow-border-color, var(--flow-primary-color, #3f51b5))]
 * @cssvar {background-color} [--flow-checkbox-bg=var(--flow-input-bg, inherit)]
 * @cssvar {width} [--flow-checkbox-outer-width=24px]
 * @cssvar {height} [--flow-checkbox-outer-height=24px]
 * @cssvar {margin} [--flow-checkbox-outer-margin=0px 10px 0px 0px]
 * @cssvar {border} [--flow-checkbox-outer-border=2px solid rgba(0,0,0,.54)]
 * @cssvar {border-color} [--flow-checkbox-color=var(--flow-border-color, rgba(0,0,0,.54))]
 * @cssvar {background-color} [--flow-checkbox-bg=var(--flow-input-bg, inherit)]
 * @cssvar {height} [--flow-checkbox-outline-height=100%]
 * @cssvar {width} [--flow-checkbox-outline-width=100%]
 * @cssvar {border-color} [--flow-checkbox-checked-color=var(--flow-border-color, var(--flow-primary-color, #3f51b5))]
 * @cssvar {background-color} [--flow-checkbox-checked-bg=var(--flow-input-bg, inherit)]		 
 *  
 */
export class FlowCheckbox extends BaseElement {
	static get properties() {
		return {
			checked:{type:Boolean, reflect: true},
			readonly:{type:Boolean, reflect: true},
			name:{type:String},
			inputValue:{type:String}
		}
	}
	static get styles() {
		return css`
			:host{
				display:inline-block;
			}
			:host(.block){
				display: block;
				width: max-content;
				margin-bottom: var(--flow-checkbox-margin-bottom);
			}
			:host(:not([disabled]):not([readonly])) .checkbox{
				cursor:pointer;
			}
			.checkbox{
				display:flex;align-items:center;
			    user-select:none;position:relative;
			}
			.checkbox-input{
			    position:absolute;
			    opacity:0;
			    z-index:0;
				top:0px;
			}
			.checkbox-outer{
				position:relative;
			    top:0px;
			    left:0;
			    display:inline-block;
			    box-sizing:border-box;
			    width: var(--flow-checkbox-outer-width,24px);
			    height: var(--flow-checkbox-outer-height,24px);
			    margin: var(--flow-checkbox-outer-margin, 0px 10px 0px 0px);
			    cursor:pointer;
			    overflow:hidden;
			    border: var(--flow-checkbox-outer-border,2px solid rgba(0,0,0,.54));
			    border-color:var(--flow-checkbox-color, var(--flow-border-color, rgba(0,0,0,.54)));
			    border-radius:2px;
			    z-index:2;
			    background-color:var(--flow-checkbox-bg, var(--flow-input-bg, inherit));
			    transition-duration: .28s;
			    transition-timing-function: cubic-bezier(.4,0,.2,1);
			    transition-property: background;
			}
			.outline{
				position: absolute;
			    top: 0;
			    left: 0;
			    height: var(--flow-checkbox-outline-height, 100%);
			    width: var(--flow-checkbox-outline-width,100%);
			    -webkit-mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");
			    mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");
			    background: 0 0;
			    transition-duration: .28s;
			    transition-timing-function: cubic-bezier(.4,0,.2,1);
			    transition-property: background;
			}
			.checkbox-input:checked+.checkbox-outer{
				border: 2px solid #3f51b5;
				border-color:var(--flow-checkbox-checked-color, var(--flow-border-color, var(--flow-primary-color, #3f51b5)));
			}
			.checkbox-input:checked+.checkbox-outer .outline{
				background:var(--flow-checkbox-checked-color, var(--flow-border-color, var(--flow-primary-color, #3f51b5))) url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K");
			}
			.checkbox-input:checked+.checkbox-outer{
				background-color:var(--flow-checkbox-checked-bg, var(--flow-input-bg, inherit));
			}

		`;
	}
	render(){
		return html`
		<label class="checkbox">
			<input class="checkbox-input" type="checkbox" @change="${this.onChange}" 
				?disabled=${this.readonly} .checked="${this.checked}"
				.name="${this.name}" .value="${this.inputValue||'ON'}">
			<div class="checkbox-outer"><div class="outline"></div></div>
			<slot></slot>
		</label>
		`;
	}
	get value(){
		return !!this.checked;
	}
	set value(checked){
		this.setChecked(checked)
	}
	onChange(e){
		this.setChecked(e.target.checked);
	}
	toggle(){
		this.setChecked(!this.checked)
	}
	setChecked(checked){
		let lastChecked = this.checked;
		this.checked = !!checked;
		if(lastChecked != this.checked)
			this.fireChangeEvent();
	}
	fireChangeEvent(){
		this.fire("changed", {checked: this.checked, name:this.name}, {bubbles:true})
	}
}

FlowCheckbox.define('flow-checkbox');