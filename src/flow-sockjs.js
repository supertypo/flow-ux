import {FlowEvents} from './flow-events.js';
import {dpc, UID} from './helpers.js';

export * from './flow-events.js';
export class FlowSockjs {
	constructor(options){
		this.online = false;
		

		this.options = Object.assign({
			path:'/rpc',
			id:UID(),
			timeout:30,
			origin:window.location.origin
		}, options || {});

		this.timeout  = this.options.timeout;
		this.id = this.options.id;

		this.init();
	}

	init() {
		this.initEvent();
		this.connected = false;
		if (this.options.path)
			this.connect();
	}

	initEvent() {
		this.pending = new Map();
		this.events = new FlowEvents();
	}

	async connect(){
		if (this._connected || !this.options.path)
			return;
		this._connected = true;
		this.events.emitAsync('rpc-connecting');
		let io = this.options.io || window.SockJS;
		this.socket = new FlowEvents();
		this.sockjs = io(this.options.origin+this.options.path, this.options.args || {});
		this.sockjs.onopen=(event)=>{
			this.online = true;
			console.log("RPC connected");
			this.events.emit('connect');
		}
		this.sockjs.onerror=(err)=>{
			console.log("RPC connect_error", err);
			this.events.emit('connect.error', err);
		}
		this.sockjs.onmessage=(msg)=>{
			let [ event, data ] = JSON.parse(msg.data);
			this.socket.emit(event, data);
		}
		this.socket.on('auth::setcookie', (msg)=>{
			document.cookie = msg.cookie;
		})
		this.socket.on('auth::getcookie', ()=>{
			let cookie = (document.cookie.length === 0) ? null : document.cookie;
			let response = {
				cookie: cookie
			}
			this.sockjs.send(JSON.stringify(['auth::cookie', response]));
		})
		this.socket.on('message', (message)=>{
			this.sockjs.send(JSON.stringify(['message', message]));
		})
		this.socket.on('request', (request)=>{
			this.sockjs.send(JSON.stringify(['request', request]));
		})
		this.socket.on('publish', (publish)=>{
			this.sockjs.send(JSON.stringify(['publish', publish]));
		})
		this.socket.on('unsubscribe', (unsubscribe)=>{
			this.sockjs.send(JSON.stringify(['unsubscribe', unsubscribe]));
		})
		this.socket.on('rpc.req', (req)=>{
			this.sockjs.send(JSON.stringify(['rpc.req', req]));
		})
		this.sockjs.onclose=(event)=>{
			this.online = false;
			console.log("RPC disconnected", arguments);
			this.events.emit('disconnect');

			this.pending.forEach((info, id)=>{
				info.callback({ error : "Connection Closed"});
			});

			this.pending.clear();
		};

		await this.initSocketHandlers();

		let timeoutMonitor = ()=>{
			let ts = Date.now();
			let purge = [ ]
			this.pending.forEach((info, id)=>{
				if(ts - info.ts > this.timeout * 1000) {
					info.callback({ error : "Timeout "});
					purge.push(id);
				}
			});
			purge.forEach(id=>{
				this.pending.delete(id);
			});
			dpc(1000, timeoutMonitor);
		}
		dpc(1000, timeoutMonitor);

	}

	close(){
		if(this.socket)
			this.socket.close();
	}

    
	on(op, callback) {
		this.events.on(op, callback);
	}


	initSocketHandlers() { return Promise.resolve(); }
}

