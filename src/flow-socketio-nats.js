import {FlowSocketIO} from './flow-socketio.js';
import {dpc, UID} from './helpers.js';

export class FlowSocketIONATS extends FlowSocketIO {
	constructor(options) {
		super(options);
		this.trace = false;
		this.subscribers = new Map();
		this.subscriptionTokenMap = new Map();
		this.handlers = new Map();
	}

	initSocketHandlers() {
		this.socket.on('message', msg=>{
			this.trace && console.log("sio/message",msg);
			let {subject, data} = msg;
			if(msg.op){
				subject = msg.op;
				data = msg;
			}
			if(this.trace) {
				if(this.trace === 1 || this.trace === true)
					console.log('RPC ['+this.id+']:', subject);
				else
				if(this.trace === 2)
					console.log('RPC ['+this.id+']:', subject, data);                
			}
			this.events.emit(subject, data);
		})

		this.socket.on('publish::response', (msg)=>{
			this.trace && console.log("sio/publish::response",msg);
			let {rid, error, data} = msg;
			let info = rid && this.pending.get(rid);
			if(info)
				info.callback.call(this, error, data);
			else if(rid)
				console.log("RPC received unknown rpc callback (strange server-side retransmit?)");

			rid && this.pending.delete(rid);
		})

		this.socket.on('subscribe::response', (msg)=>{
			this.trace && console.log("sio/subscribe::response",msg);
			let {rid, error, token, subject} = msg;
			let info = rid && this.pending.get(rid);
			if(info) {
				info.callback.call(this, error, token);
				let handler = this.handlers.get(rid);
				if(!error && subject?.length && handler) {
					let subscribers = this.subscribers.get(subject);
					if(!subscribers){
						subscribers = new Map();
						this.subscribers.set(subject, subscribers)
					}
					subscribers.set(rid, {token, handler});
					this.handlers.delete(rid);
					this.subscriptionTokenMap.set(token, { subscribers, rid });
				}
			}
			else if(rid)
				console.log("RPC received unknown subscribe::response rid");

			rid && this.pending.delete(rid);
		})

		this.socket.on('unsubscribe::response', (msg)=>{
			this.trace && console.log("sio/subscribe::response",msg);
			let {rid, error, ok} = msg;
			let info = rid && this.pending.get(rid);
			if(info)
				info.callback.call(this, error, ok);
			else if(rid)
				console.log("RPC received unknown unsubscribe::response rid");

			rid && this.pending.delete(rid);
		})


		this.socket.on('request', (msg)=>{
			this.trace && console.log("sio/request",msg);
			let { req : { subject, data }, rid } = msg;
			
			// TODO - check this.events for handlers
		})


		this.socket.on('publish', (msg)=>{
			this.trace && console.log("sio/publish",msg);
			let { subject, data } = msg;
			this.events.emit(subject, data);
			const subscribers = this.subscribers.get(subject);
			if(subscribers)
				subscribers.forEach(subscriber=>subscriber.handler(data));
			// TODO - check this.events for handlers
		})

		this.socket.on('response', (msg)=>{
			this.trace && console.log("sio/response",msg);
			let {rid, error, data} = msg;
			error = error || data?.error;
			if(error?.code == "TIMEOUT" && !error.error)
				error.error = "NATS TIMEOUT";
			let info = rid && this.pending.get(rid);
			if(info)
				info.callback.call(this, error, data);
			else if(rid)
				console.log("NATS RPC received unknown rpc callback (strange server-side retransmit?)");

			rid && this.pending.delete(rid);
		})

		return Promise.resolve();
	}

	on(op, callback) {
		this.events.on(op, callback);
	}
	
	request(subject, data, callback) {
		if(typeof(data)=='function'){
			callback = data;
			data = undefined;
		}

		if(!callback)
			throw new Error(`FlowSocketIONATS::request() - callback required`);

		let rid = UID();

		this.pending.set(rid, {
			ts:Date.now(),
			callback
		})

		this.socket.emit('request', { 
			rid,
			req : {subject, data}
		});
	}

	publish(subject, data, callback) {
		return new Promise((resolve, reject) => {
			let rid = UID();

			let ack = !!callback;

			ack && this.pending.set(rid, {
				ts:Date.now(),
				callback : (err, data)=>{
					if(typeof callback == 'function')
						return callback(err, data);
					else
						return err ? reject(err) : resolve();
				}
			})

			this.socket.emit('publish', {
				req : { subject, data },
				rid,
				ack
			})
		})	
	}

	subscribe(subject, handler, opt) {
		let rid = UID();
		let p = new Promise((resolve, reject)=>{
			this.handlers.set(rid, handler);
			this.pending.set(rid, {
				ts:Date.now(),
				callback:(err, data)=>{

					// TODO - Data should be a token...
					return err?reject(err):resolve(data);
				}
			});

			this.socket.emit('subscribe', {
				req : { subject, opt },
				rid
			})
		});
		p.rid = rid;
		return p;
	}

	unsubscribe(token) {
		this.unsubscribe_local_refs(token);

		let rid = UID();
		let p = new Promise((resolve, reject)=>{
			this.pending.set(rid, {
				ts:Date.now(),
				callback:(err, ok)=>{
					return err?reject(err):resolve(ok);
				}
			});

			this.socket.emit('unsubscribe', {
				req : { token },
				rid
			})
		});
		p.rid = rid;
		return p;
	}


	unsubscribe_local_refs(token) {
		// this.subscriptionTokenMap.set(token, { subscribers, rid });
		let rec = this.subscriptionTokenMap.get(token);
		if(!rec)
			return;

		const { rid } = rec;

		this.handlers.delete(rid);
		this.pending.delete(rid);
		this.subscribers.forEach(subscribers=>{
			subscribers.delete(rid);
		})
	}

}

