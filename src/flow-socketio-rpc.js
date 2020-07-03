import {FlowSocketIO} from './flow-socketio.js';
import {dpc, UID} from './helpers.js';

export class FlowSocketIORPC extends FlowSocketIO {
	constructor(options) {
		super(options);
	}

	initSocketHandlers() {

		this.socket.on('message', msg=>{
			let {subject, data} = msg;
			// if(msg.op){
			// 	subject = msg.op;
			// 	data = msg;
			// }
			if(this.trace) {
				if(this.trace === 1 || this.trace === true)
					console.log('RPC ['+this.id+']:', subject);
				else
				if(this.trace === 2)
					console.log('RPC ['+this.id+']:', subject, data);                
			}
			this.events.emit(subject, data);
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

	dispatch(subject, data, callback) {
		if(subject.op){//<-- old way
			callback = data;
			data = subject;
			subject = subject.op;
		}else{
			if(typeof(data)=='function'){
				callback = data;
				data = undefined;
			}
		}

		if(!callback)
			return this.socket.emit('message', {subject, data});

		let rid = UID();

		this.pending.set(rid, {
			ts:Date.now(),
			callback
		})

		this.socket.emit('rpc.req', { 
			rid,
			req : {subject, data}
		});
	}

}

