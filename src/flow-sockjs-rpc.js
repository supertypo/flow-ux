import {FlowSockjs} from './flow-sockjs.js';
import {dpc, UID} from './helpers.js';
import {AsyncQueueSubscriberMap} from './flow-async.js';

export class FlowSockjsRPC extends FlowSockjs {
	constructor(options) {
		super(Object.assign({},options,{websocketMode:'RPC'}));

		this.asyncSubscribers = new AsyncQueueSubscriberMap();
	}

	initSocketHandlers() {

		this.socket.on('publish', msg=>{
			let {subject, data} = msg;
			if(this.trace) {
				if(this.trace === 1 || this.trace === true)
					console.log('RPC ['+this.id+']:', subject);
				else
				if(this.trace === 2)
					console.log('RPC ['+this.id+']:', subject, data);
			}
			this.asyncSubscribers.post(subject, {data});
		})

		this.socket.on('response', (msg)=>{
			let {rid, error, data} = msg;
			let info = rid && this.pending.get(rid);
			if(info) {
				try {
					info.callback.call(this, error, data);
				} catch(ex) {
					console.error('RPC handler error:', msg);
					console.error(ex);
				}
			}
			else if(rid) {
				console.log("RPC received unknown rpc callback (strange server-side retransmit?)");
			}

			rid && this.pending.delete(rid);
		})

		return Promise.resolve();
	}

	subscribe(subject) {
		return this.asyncSubscribers.subscribe(subject);
	}

	publish(subject, data) {
		return this.socket.emit('publish', {subject, data});
	}

	request(subject, data, callback) {
		return new Promise((resolve, reject) => {

			if(typeof(data)=='function') {
				callback = data;
				data = undefined;
			}

			let rid = UID();

			this.pending.set(rid, {
				ts:Date.now(),
				callback : (err, resp) => {
					if(callback)
						callback(err,resp);
					else
					if(err)
						reject(err);
					else
						resolve(data);
				}
			});

			this.socket.emit('request', {
				rid,
				req : {subject, data}
			});
		})
	}

}

