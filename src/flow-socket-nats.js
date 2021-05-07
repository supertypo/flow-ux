import {FlowSocket} from './flow-socket.js';
import {dpc, UID} from './helpers.js';
import {AsyncQueueSubscriberMap} from './flow-async.js';

export class FlowSocketNATS extends FlowSocket {
	constructor(options) {
		super(Object.assign({},options,{websocketMode:'NATS'}));
		this.trace = false;
		this.subscribers = new Map();
		this.subscriptionTokenMap = new Map();
		this.handlers = new Map();

		this.asyncSubscribers = new AsyncQueueSubscriberMap();
	}

	initSocketHandlers() {

		this.on('connect', ()=>{
			// reconnect subscribers
			this.connectSubscribers(this.asyncSubscribers);
		});

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
					//subscribers.set(rid, {token, handler});
					subscribers.set(token, {token, handler});
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
			let { subject, data,  token} = msg;

//			console.log("PUBLISH",msg);

			//this.events.emit(subject, data);
			const subscribers = this.subscribers.get(subject);
			if(subscribers){
				const target = subscribers.get(token);
				if(target){
					//console.log("PUBLISHING     SUBJECT::::", subject, "  TOKEN:", token, "    DATA:", data);
					target.handler(data);
				}
				//subscribers.forEach(subscriber=>subscriber.handler(data));
			}
			// TODO - check this.events for handlers

			this.asyncSubscribers.post(subject, {data});
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
		return new Promise((resolve, reject) => {
			if(typeof(data)=='function'){
				callback = data;
				data = undefined;
			}

			let rid = UID();
			this.pending.set(rid, {
				ts:Date.now(),
				callback : (error, data)=>{
					callback && callback(error, data);
					if(error) {
						console.log('NATS request error - Subject:',subject,'Error:',error)
						reject(error);
					}
					else
						resolve(data);
				}
			})

			this.socket.emit('request', {
				rid,
				req : {subject, data}
			});
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
		});
	}


	subscribe(subject, opt) {

		//this.create_nats_subscription_(subject);

		let subscriber = this.asyncSubscribers.subscribe(subject);

		subscriber.on('subscribe',(subject)=>{
			this.registerSubscriptionWithNATS_(subject, subscriber, opt);	
		})

		subscriber.on('unsubscribe',(subject)=>{
			this.unsubscribe(subscriber);	
		})

//		this.registerSubscriptionWithNATS_(subject, subscriber, opt);
		// console.log("NATS SUBSCRIPTION:", subject);
		return subscriber;
	}

	connectSubscribers(subscribers) {

		// this.asyncSubscribers
		subscribers.forEach((subscriber)=>{
			const { subject } = subscriber;
			subscriber.ready = this.registerSubscriptionWithNATS_(subject, subscriber);
		});

	}


	registerSubscriptionWithNATS_(subject, subscriber, opt = { }) {
		subscriber.state = 'connecting';
		let rid = UID();
		let p = new Promise((resolve, reject)=>{
			// if(handler)
			// 	this.handlers.set(rid, handler);
			this.pending.set(rid, {
				ts:Date.now(),
				callback:(err, token)=>{
					if(err)
						console.error('subscribe failure for subject:',subject);
					subscriber.token = token;
					subscriber.state = 'connected';
					//console.log("NATS - SUCCESSFUL SUBSCRIPTION to",subject,token,subscriber.state);
					return err?reject(err):resolve(subscriber);
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


	unsubscribe(subscriber) {
//		this.unsubscribe_local_refs(token);
//		if(subscriber.state == 'connecting')

		const { token } = subscriber;
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

/*
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
*/
}

