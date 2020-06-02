import {flow, dpc} from './base-element.js';

if(!flow.samplers) {
	flow.samplers = {
		inst : { },
		get : (ident, options) => {
			let sampler = flow.samplers.inst[ident];
			if(!sampler)
				sampler = flow.samplers.inst[ident] = new FlowSampler(ident, options);
			return sampler;
		}
	}
}

export class FlowSampler {

	static get(...args) {
		return flow.samplers.get(...args);
	}

	constructor(ident, options = { }) {
		this.ident = ident;
		if(!this.ident)
			throw new Error('fatal: FlowSampler::constructor() missing options.ident');
		
		this.options = options;
		this.generator = this.options.generator;
		this.data = [ ];
		this.eventHandlers = new Map();
		this.eventHandlers.set("data", new Map())

		if(this.options.interval)
			this.start();
	}

	async start() {
		if(this.running)
			return Promise.reject('already running');

		const { interval } = options;
		this.interval = setInterval(this.poller.bind(this), interval);

		this.running = true;
	}

	stop() {
		if(this.interval) {
			clearInterval(this.interval);
			delete this.interval;
		}

		this.running = false;
	}

	poll(poller) {
		this.generator = poller;
	}

	poller() {
		if(!this.generator) {
			console.error('FlowSampler::poller() missing generator');
			return;
		}

		if(typeof this.generator != 'function') {
			console.error('FlowSampler::poller() generator must be a function');
			return;
		}

        
		this.generator(ts, lastTS);
		
	}

	put(value) {
		const date = new Date();
		this.data.push({date,value});
		let max = this.options.maxSamples || (60*5);
		while(this.data.length > max)
			this.data.shift();
		this.fire('data', {ident:this.ident, data: this.data})
    }

    lastEntry() {
        if(!this.data.length)
            return undefined;
        return this.data[this.data.length-1];
    }


    last(_default) {
        if(!this.data.length)
            return _default;
        return this.data[this.data.length-1].value;
    }

    first(_default = undefined) {
        if(!this.data.length)
            return _default;
        return this.data[0].value;
    }

	fire(name, data={}){
		let ce = new CustomEvent(`flow-sampler-${name}-${this.ident}`, {detail:data})
		document.body.dispatchEvent(ce);
		let handlers = this.eventHandlers.get(name);
		if(handlers){
			handlers.forEach((v, fn)=>{
				fn({data});
			})
		}
	}
	on(name, fn){
		let handlers = this.eventHandlers.get(name);
		if(!handlers)
			return
		handlers.set(fn, 1);
		//document.body.addEventListener(`flow-sampler-${name}-${this.ident}`, fn);
	}
	off(name, fn){
		let handlers = this.eventHandlers.get(name);
		if(!handlers)
			return
		handlers.delete(fn);
		//document.body.removeEventListener(`flow-sampler-${name}-${this.ident}`, fn);
	}
}