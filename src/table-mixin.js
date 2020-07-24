import {buildPagination} from './pagination.js';
export const TableMixin = baseClass=>{
	class Table extends baseClass{

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
	}

	return Table;
}