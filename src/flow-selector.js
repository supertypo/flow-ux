import {FlowSelect} from './flow-select.js';
import {html, css} from './base-element.js';


class FlowSelector extends FlowSelect{

    
    static get properties(){
        return {
            mergeProps:{type:String}
        }
    }

    static get styles(){
        return [FlowSelect.styles, css`
            :host{
                --flow-select-input-height:var(--flow-selector-input-height, auto);
            }
            .selected{
                min-height:var(--flow-selector-selected-min-height, 50px);
                min-width:var(--flow-selector-selected-min-width, 10px);
                font-size:0px;display:flex;align-items:center;
                padding:var(--flow-selector-selected-padding, 16px 30px 10px 10px);
                flex-wrap:var(--flow-selector-selected-flex-wrap, wrap);
            }
            .selected::after{
                top:calc(50% - 2px);
            }
            .selected .item{
                margin:var(--flow-selector-item-margin, 0px);
                font-size:var(--flow-selector-item-line-height, 1rem);
                line-height:var(--flow-selector-item-line-height, 1.1);
            }
            :host([multiple]) .selected .item{
                margin:var(--flow-selector-multiple-item-margin, 0px 5px);
            }
        `]
    }

    constructor(){
        super();
        this.mergeProps = "";
    }

    renderSelected(){
        let map = new Map();
        this.list.forEach(item=>{
            map.set(item.getAttribute(this.valueAttr), item)
        })
        return this._selected.map(value=>{
            let item = map.get(value)
            if(!item)
                return
            let clone = item.cloneNode();
            clone.classList.remove("menu-item", "selected");
            clone.classList.add("item")
            return this.mergeNobeProperties(clone, item);
        }).filter(item=>!!item)
    }

    mergeNobeProperties(clone, org){
        let props = [];
        if(this.mergeProps){
            props = this.mergeProps.split(",")
        }else if(org.constructor?.properties){
            props = Object.keys(org.constructor?.properties||{})
        }
        props.forEach(p=>{
            clone[p] = org[p];
        })
        return clone;
    }
}

FlowSelector.define('flow-selector');