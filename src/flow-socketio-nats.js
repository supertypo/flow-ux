import {FlowSocketIO} from './flow-socketio.js';
import {dpc, UID} from './helpers.js';

export class FlowSocketIONATS extends FlowSocketIO {
	constructor(options) {
		super(options);
		this.trace = true;
		this.subscribers = { }
		this.subscriberIdentMap = { }
		this.handlers = { }
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
			let {rid, error, ident, subject} = msg;
			let info = rid && this.pending.get(rid);
			if(info) {
				info.callback.call(this, error, ident);
				let handler = this.handlers[rid];
				if(!error && subject?.length && handler) {
					let subscribers = this.subscribers[subject];
					if(!subscribers)
						subscribers = this.subscribers[subject] = [];
					subscribers.push({ ident, handler });
					delete this.handlers[rid];

//					this.subscriberIdentMap[ident] = 
				}
			}
			else if(rid)
				console.log("RPC received unknown subscribe::response rid");

			rid && this.pending.delete(rid);
		})

		this.socket.on('unsubscribe::response', (msg)=>{
			this.trace && console.log("sio/subscribe::response",msg);
			let {rid, error} = msg;
			let info = rid && this.pending.get(rid);
			if(info)
				info.callback.call(this, error);
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
			const subscribers = this.subscribers[subject];
			if(subscribers?.length)
				subscribers.forEach(subscriber=>subscriber.handler(data));
			// TODO - check this.events for handlers
		})

		this.socket.on('response', (msg)=>{
			this.trace && console.log("sio/response",msg);
			let {rid, error, data} = msg;
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
		// if(subject.op){//<-- old way
		// 	callback = data;
		// 	data = subject;
		// 	subject = subject.op;
		// }else{
			if(typeof(data)=='function'){
				callback = data;
				data = undefined;
			}
		// }

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
				callback : (err)=>{
					if(typeof callback == 'function')
						return callback(err);
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
		return new Promise((resolve, reject) => {
			let rid = UID();

			this.handlers[rid] = handler;
			
			this.pending.set(rid, {
				ts:Date.now(),
				callback:(err)=>{
					return err?reject(err):resolve();
				}
			})

			this.socket.emit('subscribe', {
				req : { subject, opt },
				rid
			})
		})	
	}

}

