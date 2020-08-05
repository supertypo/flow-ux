// import { finfr } from "../../finfr-ux/src/base";

export const FlowFormValidators = {
    email : (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

export const FlowFormMixin = baseClass => {
	class FlowFormIface extends baseClass {



        declareSchema(prefix, schema, validators) {
            this.schema = schema;
            this.validators = validators;

            const sampleSchema = {
                'email' : { type : String, validator : FlowFormValidators.email },
                'lastname' : { type : String, length : 128 }
            }
        }

        gatherInputs(list) {
            let ctls = { };
            list.forEach(item => {
                const [id, property] = item.split('.');
                ctls[id] = this.renderRoot.getElementById(id)[property||'value'];
            });
            return ctls;
        }

        async gatherInputData(schema, resolve) {

            if(!schema)
                schema = this.schema;
            if(!schema) {
                return Promise.reject(`missing schema in ${this.constructor.name}`);
            }

            if(Array.isArray(schema)) {
                const src = schema;
                schema = { };
                src.forEach(t => { schema[t] = { type : String }; });
            }


            const data = { };
            Object.keys(schema).forEach((key) => {
                let el = this.renderRoot.getElementById(`${key}`);
                if(!el)
                    return console.error(`unknown field ${key} in data`,data,`occurred in`,this);

                let value = null;
                switch(el.tagName.toLowerCase()) {
                    case 'flow-input': {
                        value = el.value;
                    } break;

                    default: {
                        console.error(`Unknown flow form input control type ${el.tagName}`, el, 'error occurred in:',this);
                    } break;
                }

                data[key] = value;
            })

            return data;
        }

        fillInputs(data) {

            if(!schema)
                schema = this.schema;
            if(!schema) {
                return Promise.reject(`missing schema in ${this.constructor.name}`);
            }

            if(Array.isArray(schema)) {
                const src = schema;
                schema = { };
                src.forEach(t => { schema[t] = { type : String }; });
            }

            const keys = Object.keys(data);
            Object.keys(schema).forEach((key) => {
                let el = this.renderRoot.getElementById(`${key}`);
                if(!el)
                    return console.error(`unknown field ${key} in data`,data,`occurred in`,this);
                
                switch(el.tagName.toLowerCase()) {
                    case 'flow-input': {
                        el.value = value;
                    } break;

                    default: {
                        console.error(`Unknown flow form input control type ${el.tagName}`, el, 'error occurred in:',this);
                    } break;
                }

                data[field] = value;
            })

            return data;
        }

        // validateInput(data) {
        //     let fields = Object.keys(this.schema);
        //     gatherInput
        // }
	}

	return FlowFormIface;
}