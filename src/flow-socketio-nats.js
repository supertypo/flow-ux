import {FlowSocketIO} from './flow-socketio.js';
import {dpc, UID} from './helpers.js';

export class FlowSocketIONATS extends FlowSocketIO {
	constructor(options) {
		super(options);
		// this.trace = true;
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


		this.socket.on('request', (msg)=>{
			this.trace && console.log("sio/request",msg);
			let { req : { subject, data }, rid } = msg;
			
			// TODO - check this.events for handlers
		})


		this.socket.on('publish', (msg)=>{
			this.trace && console.log("sio/publish",msg);
			let { req : { subject, data } } = msg;
			this.events.emit(subject, data);
			
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

	publish(subject, msg, callback) {
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


	subscribe(subject, msg) {
		return new Promise((resolve, reject) => {
			let rid = UID();

			let ack = !!callback;

			ack && this.pending.set(rid, {
				ts:Date.now(),
				callback : (err)=>{
					return err ? reject(err) : resolve();
				}
			})

			this.socket.emit('subscribe', {
				req : { subject, data },
				rid,
				ack
			})
		})	
	}

}

