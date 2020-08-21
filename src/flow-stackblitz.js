import {BaseElement, html, css, baseUrl} from './base-element.js';

/**
* @class FlowStackblitz
* @extends BaseElement
* @example
*   <flow-stackblitz></flow-stackblitz>
*
*
*/

export class FlowStackblitz extends BaseElement {
	static get properties() {
		return {
		}
	}

	static get styles() {
		return css`
            :host{display:block;}
            .wrapper {

            }
		`;
	}

	constructor() {
        super();
        this.sdk = window.StackBlitzSDK;
        
        this.project = {
            files: {
              'index.html': 'hello world!'
            },
            title: 'TEST ABC - Dynamically Generated Project',
            description: 'Created with <3 by Flow UX!',
            template: 'javascript',
            tags: ['test'] ,
            dependencies: {
            }
        };        
    }

    render() {
		return html`<div class='wrapper'></div>`;
    }
    
    firstUpdated() {
        this.embedNewProject();
    } 

    openNewProject() {
        this.sdk.openProject(project);
    }
      
      // Method to embed this project
    embedNewProject() {
        this.sdk.embedProject(this.renderRoot.querySelector('.wrapper'), this.project, { height: 320 });
//        sdk.embedProject('myDiv', project, { height: 320 });
    }    
}

FlowStackblitz.define('flow-stackblitz', 
    { 'window.StackBlitzSDK' : 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js' }
);
