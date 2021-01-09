
const deferred = () => {
    let methods = {};
    const p = new Promise((resolve, reject) => {
        methods = { resolve, reject };
    });
    return Object.assign(p, methods);
}

export class AsyncQueue {
	constructor(opt) {
		this.pending = [];
        this.processed = 0;
        this.inflight = 0;
		this.signal = deferred();
		this.done = false;
		this.max = opt?.max || 0;
	}
	[Symbol.asyncIterator]() { return this.iterator(); }
	post(v) {
		if(this.done)
			return;
		if(this.max) {
			while(this.pending.length >= this.max)
				this.pending.shift();
		}
		this.pending.push(v);
		this.signal.resolve();
	}
	stop(err) {
		this.err = err;
		this.abort = true;
		this.done = true;
		if(!this.inflight) {
			this.signal.resolve();
		}
	}
	clear() {
		this.pending = [];
		if(this.inflight) {
			this.abort = true;
			this.reset_ = true;
		}
	}
    get length() {
        return this.pending.length+this.inflight;
    }
	async *iterator() {

		if(this.done) {
			this.done = false;
			if(!this.pending.length)
				this.signal = deferred();
		}

		while(true) {
			if(this.pending.length === 0) {
				await this.signal;
			}
			if (this.err)
				throw this.err;

			const pending = this.pending;
			this.inflight = pending.length;
			this.pending = [];
			let processed = 0;
			for (; processed < pending.length && !this.abort; processed++) {
                this.processed++;
                yield pending[processed];
				this.inflight--;
			}


			if(this.reset_) {
				this.abort = false;
				this.reset_ = false;
				pending.length = 0;
			}

			if(this.done) {
				this.abort = false;
				const incoming = this.pending.length;
				if(incoming)
					this.pending = processed ? pending.slice(processed).concat(this.pending) : pending.concat(this.pending);
				else
					this.pending = processed ? pending.slice(processed) : pending;
				this.inflight = 0;
				break;
			}
			else if (this.pending.length === 0) {
				this.inflight = 0;
				pending.length = 0;
				this.pending = pending;
				this.signal = deferred();
			}
		}
	}
}

export class AsyncQueueSubscriberMap {
	constructor() {
		this.map = new Map();
	}

	subscribe(subject, opt) {
		let subscribers = this.map.get(subject);
		if(!subscribers) {
			subscribers = [];
			this.map.set(subject,subscribers);
		}
		let queue = new AsyncQueue();
		subscribers.push(queue);
		return queue;
	}

	post(subject, msg) {
		let subscribers = this.map.get(subject);
		if(subscribers)
			for(const subscriber of subscribers)
				subscriber.post(msg);
	}

	shutdown() {
		this.map.forEach((subscribers) => {
			subscribers.forEach(queue => {
				queue.stop();
				queue.clear();
			});
		});
		this.map.clear();
	}
}
