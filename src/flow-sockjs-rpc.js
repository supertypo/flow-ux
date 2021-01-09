import {FlowSockjs} from './flow-sockjs.js';
import {dpc, UID} from './helpers.js';
import {AsyncQueueSubscriberMap} from './flow-async.js';

export class FlowSockjsRPC extends FlowSockjs {
	constructor(options) {
		super(options);

		this.asyncSubscribers = new AsyncQueueSubscriberMap();
	}

	initSocketHandlers() {

		this.socket.on('message', msg=>{
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

		this.socket.on('rpc::response', (msg)=>{
			let {rid, error, data} = msg;
			let info = rid && this.pending.get(rid);
			if(info)
				info.callback.call(this, error, data);
			else if(rid)
				console.log("RPC received unknown rpc callback (strange server-side retransmit?)");

			rid && this.pending.delete(rid);
		})

		return Promise.resolve();
	}

	subscribe(subject) {
		return this.asyncSubscribers.subscribe(subject);
	}

	publish(subject, data) {
		return this.socket.emit('message', {subject, data});
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

					if(err)
						reject(err);
					else
						resolve(data);
				}
			});

			this.socket.emit('rpc.req', {
				rid,
				req : {subject, data}
			});
		})
	}

}

