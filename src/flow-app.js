import {dpc, UID} from './helpers.js';
import {FlowSocketIORPC} from './flow-socketio-rpc.js';
import {FlowSocketIONATS} from './flow-socketio-nats.js';

export class FlowApp {

	constructor(name) {
		this.name = name;
		this.uid = UID();
	}

	init_SocketIO_RPC(){

		this.rpc = new FlowSocketIORPC({
			path:"/rpc"
		});

		this.rpc.on("init", ()=>{
			this.log("RPC:init")
			// this.rpc.dispatch("rpc-test-1", {key:"value-1"});
			// this.rpc.dispatch("rpc-test-2", {key:"value-2"}, (err, data)=>{
			// 	console.log("rpc-test-2: err, data", err, data)
			// })
		})
	}

	init_SocketIO_NATS(){

		this.nats = new FlowSocketIONATS({
			path:"/nats"
		});

		this.nats.on("init", ()=>{
			this.log("NATS:init");
			// this.rpc.dispatch("rpc-test-1", {key:"value-1"});
			// this.nats.request("nats.hello", {key:"origin-client-init"}, (err, data)=>{
			// 	console.log("nats-test-reponse: err, data", err, data);
			// })
		})
	}

	setLoading(isLoading=true, el=null){
		(el || this.bodyEl).classList.toggle("loading", isLoading)
	}

	initLog(){
		const name = this.constructor.name;
		this.log = Function.prototype.bind.call(
			console.log,
			console,
			`%c[${name}]`,
			`font-weight:bold;color:#41c7ef`
		);
	}

}

