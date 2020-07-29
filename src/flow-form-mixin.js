import { finfr } from "../../finfr-ux/src/base";

export const FlowFormValidators = {
    email : (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

export const FormMixin = baseClass => {
	class Form extends baseClass {



        declareSchema(prefix, schema, validators) {
            this.schema = schema;
            this.validators = validators;

            const sampleSchema = {
                'email' : { type : String, validator : FlowFormValidators.email },
                'lastname' : { type : String, length : 128 }
            }
        }

        gatherInputs() {

            const data = { };
            Object.keys(this.schema).forEach((key) => {
                let el = this.getElementById(`${key}`);
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

            const keys = Object.keys(data);
            Object.keys(this.schema).forEach((key) => {
                let el = this.getElementById(`${key}`);
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

        set(prefix) {

        }

        // FINFR USER
        get(prefix) {
            finfr.nats.request(`FDXI.${prefix}.get`, (err, data) => {
                let fields = Object.keys(data);
                this.fillInputs(data);
            })
        }

/*        
		buildFetchRequest(options, name=""){
			return {}//api.getRecords(options);
		}

		async loadRecords(options={}, name=""){
			//this.log("loadRecords", this)
			let {req, params} = this.buildFetchRequest(options, name);
			if(!req)
				return
			let {result, error} = await req;
			if(error)
				return

			let {total, items} = result;
			let {skip, limit} = params;
			let prefix = name?name+'_':'';
			this[`${prefix}pagination`] = buildPagination(total, skip, limit);
			this[`${prefix}pagination`].type = name;
			this[`${prefix}state`] = {params};
			this[`${prefix}items`] = items;
			this.setLoading(false, name);
			return result;
		}
		onPaginationClick(e){
			const target = e.target;
			if(target.matches(".disabled, .active"))
				return

			let paginationEl = target.closest("[data-pagination]");
			let pageEl = target.closest('[data-skip]');
			if(!paginationEl || !pageEl)
				return
			let name = paginationEl.getAttribute('data-pagination');
			let skip = pageEl.getAttribute('data-skip');
			let prefix = name?name+'_':'';

			let {params={}} = this[`${prefix}state`];
			params.skip = skip;
			//console.log("params", params)
			this.setLoading(true, name);
			this.loadRecords(params, name);
		}

		setLoading(isLoading, listName=""){
			let el = listName?this.querySelector(`.${listName}-holder`):this;
			(el || this).classList.toggle("loading", !!isLoading)
        }
        
*/        
	}

	return Table;
}