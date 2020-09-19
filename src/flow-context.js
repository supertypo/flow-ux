

export const FlowContextSelectorMixin = base=>{
	class FlowContextSelector extends base{
		static get properties(){
			return {
				contextgroup:{type:String, value:"group-a"},
				contexts:{type:Array, value:[]}
			}
		}
		initContextSelector(){

		}

		bindContextEvents(){
			this.registerListener("get-contexts", this.onGetContexts.bind(this));
		}

		onGetContexts(e){
			let {contexts} = this;
			if(!contexts)
				return
			e.detail.result = e.detail.result || [];
			e.detail.result = [...e.detail.result, contexts];
		}

		connectedCallback(){
			super.connectedCallback();
			this.bindContextEvents();
		}
		/*
		disconnectedCallback(){
			super.disconnectedCallback();
		}
		*/
	}

	return FlowContextSelector;
}


export const FlowContextListenerMixin = base=>{
	class FlowContextListener extends base{
		static get properties(){
			return {
				contextgroup:{type:String, value:"group-a"},
				contexts:{type:Array, value:[]}
			}
		}
		initContextListener(){

		}
		buildGetContextRequest(){
			let {contextgroup} = this;
			return {contextgroup};
		}

		bindContextEvents(){
			this.registerListener("contexts", this.onFlowContexts.bind(this));
			this.registerListener("context-selected", this.onFlowContextSelected.bind(this));
			let args = this.buildGetContextRequest();
			this.fire("get-contexts", args, {}, window);
			if(args.result)
				this.updateContexts(args.result)
		}

		onFlowContexts(e){
			console.log("onFlowContexts:e", e)

			let {contexts, contextgroup} = e.detail||{};
			if(contextgroup != this.contextgroup)
				return
			this.updateContexts(contexts);
		}
		onFlowContextSelected(e){
			//
		}
		updateContexts(contexts){
			if(!contexts)
				return
			let isNew = ctx=>{
				return !this.contexts.find(c=>c.type == ctx.type);
			}
			contexts = contexts.filter(ctx=>isNew(ctx)&&this.acceptContext(ctx));

			let map = new Map();
			contexts.forEach(ctx=>{
				if(!map.has(ctx.type))
					map.set(ctx.type, ctx);
			})
			this.contexts = map.values();
			this.onContextsUpdate();
			
			/*
			this.contexts = [...contexts].filter((v, i, a) =>{
				return a.findIndex(ctx=>ctx.type==v.type) === i
			});
			*/
		}
		acceptContext(context){
			return !!context.type;
		}
		onContextsUpdate(){
			//
		}
		connectedCallback(){
			super.connectedCallback();
			this.bindContextEvents();
		}
		/*
		disconnectedCallback(){
			super.disconnectedCallback();
		}
		*/

	}

	return FlowContextListener;
}

