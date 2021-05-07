import { dpc, UID } from './helpers.js';

const deferred = () => {
    //let methods = {};
	let resolve;
	let reject;
    const p = new Promise((resolve_, reject_) => {
		resolve = resolve_;
		reject = reject_;
        //methods = { resolve, reject };
    });
	p.resolve = resolve;
	p.reject = reject;
	return p;
//    return Object.assign(p, methods);
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

export class AsyncQueueSubscriber {
	constructor(manager, subject) {
		this.uid = UID();
		this.queue = new AsyncQueue();
		this.manager = manager;
		this.subject = subject;
		this.events = { };
//		this.ready = false;
//		this.connectHandlers = [];
	}

	[Symbol.asyncIterator]() { return this.queue.iterator(); }


	subscribe(subject) {
		this.unsubscribe();
		this.subject = subject;
		this.manager.subscribe(subject, this);
	}

	unsubscribe() {
		this.manager.remove(this);
		let { subject, uid, queue } = this;
		queue.clear();
//		queue.stop();

		this.event('unsubscribe');
		// for(const handler of this.events.unsubscribe||[])
		// 	handler();
	}

	resubscribe() {
		this.manager.subscribe(this.subject, this);
	}

	close() {
		this.unsubscribe();
		//queue.clear();
		this.queue.stop();
	}

	// changeSubject(subject) {
	// 	this.manager.changeSubject(this, subject);
	// }

	// connect(connectHandler) {

	// }

	on(event, handler) {
		if(!this.events[event])
			this.events[event] = [];
		this.events[event].push(handler);
	}

	event(name, subject) {
		//console.log('EVENT:', name, subject);
		dpc(()=>{
			for(const handler of this.events[name]||[])
				handler(subject);
		})
	}
}

export class AsyncQueueSubscriberMap {
	constructor() {
		this.map = new Map();
	}

	subscribe(subject, subscriber = null) {
		let subscribers = this.map.get(subject);
		if(!subscribers) {
			subscribers = new Map();
			this.map.set(subject,subscribers);
		}
//		let queue = new AsyncQueue();
		//let subscriber = 
		if(!subscriber)
			subscriber = new AsyncQueueSubscriber(this, subject);
		else
			subscriber.manager = this;
		subscribers.set(subscriber.uid,subscriber);
		subscriber.event('subscribe', subject);
		return subscriber;
	}

	remove(subscriber) {
		let { subject, uid } = subscriber;
		let subscribers = this.map.get(subject);
		if(subscribers) {
			subscribers.delete(uid);
			if(!subscribers.size)
				this.map.delete(subject);
		} else {
			// console.trace('WARNING - no previous subscription for subject',subject,'uid:',uid);
			console.log('note','no previous subscription for subject',subject);
		}
		
		// let subscriber_ = this.subscribers.get(subscriber.uid);
		// if(subscriber_) {
		// 	this.subscribers.delete(subscriber.uid);
		// }
	}

	post(subject, msg) {
		let subscribers = this.map.get(subject);
		if(subscribers && subscribers.size)
			subscribers.forEach((subscriber)=>{
				subscriber.queue.post(msg);
			});
	}

	shutdown() {
		this.map.forEach((subscribers) => {
			subscribers.forEach(subscriber => {
				const { uid, queue } = subscriber;
				// ???????????
				queue.stop();
				queue.clear();
			});
		});
		this.map.clear();
	}

	forEach(iter) {
		this.map.forEach((subscribers, subject)=>{
			subscribers.forEach((subscriber)=>{
				iter(subscriber);
			})
		});
	}

	/*
	changeSubject(subscriber, newSubject) {
		const { uid, subject } = subscriber;
		let subscribers = this.map.get(subject);
		if(subscribers)
			subscribers.delete(uid);
		subscribers = this.map.get(newSubject);
		if(!subscribers) {
			subscribers = new Map();
			this.map.set(newSubject, subscribers);
		}
		subscribers.set(subscriber.uid, subscriber);
	}
	*/
}
