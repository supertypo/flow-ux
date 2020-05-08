const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const utils = require('./flow-utils');
const {FlowRPC} = require('./flow-rpc');
const EventEmitter = require('events');


class FlowApp extends EventEmitter{
	constructor(options={}){
		super();
		this.options = Object.assign({
			ident:'flow-app',
			initlizeDataFolder: false,
			rpc:{}
		}, options);

		let {rpc} = this.options;
		if(rpc && !rpc.bcastChannel)
			rpc.bcastChannel = this.options.ident;

		this.isNw = utils.isNw;
		this.ident = this.options.ident;
		this.utils = utils;
		this.appFolder = options.appFolder;
		this.init();
	}

	/**
	* initlizing starts here
	*/
	init(){
		this.flags = {};
		this.initFlags();
		this.initConfig();
		if(this.isNw && utils.isObject(this.options.rpc)){
			this.initRPC();
		}
	}

	/**
	* initlize flags from process.argv or nw.App.fullArgv
	*/
	initFlags(){
		let args;
		if (this.isNw){
			args = nw.App.fullArgv;
		}else{
			args = process.argv.slice(2);
		}
		this.flags = utils.args(args);
	}

	/**
	* initlize config object
	*/
	initConfig(){
		this.configFolder = this.getConfigFolderPath();
		fs.ensureDirSync(this.configFolder);
		this.config = {};
		this.configFile = this.getConfigFilePath();
		if(!fs.existsSync(this.configFile) || this.flags['reset-config']){
			this.initConfigFromDefault();
		}else{
			this.config = this.getConfig();
			this.loadConfig(this.config);
		}
		if(this.options.initlizeDataFolder)
			this.initDataFolder();
	}

	/**
	* @return {String} config folder path
	*/
	getConfigFolderPath(){
		return path.join(os.homedir(), `.${this.ident}`);
	}

	/**
	* @return {String} config file path
	*/
	getConfigFilePath(){
		return path.join(this.getConfigFolderPath(), "config.json");
	}

	/**
	* @return {String} default path to data folder 
	*/
	getDefaultDataFolderPath(){
		return this.getConfigFolderPath();
	}

	/**
	* @return {Object} default config
	*/
	getDefaultConfig(){
		let file = path.join(this.appFolder, "default-config.json");
		return fs.readJSONSync(file, {throws:false}) || {};
	}

	/**
	* initlize config from defaults
	*/
	initConfigFromDefault(){
		this.config = this.getDefaultConfig();
		this.loadConfig(this.config);
	}

	/**
	* config initlizing
	*/
	loadConfig(config){
		this.setConfig(config)
	}

	/**
	* initlize data folder
	*/
	initDataFolder(){
		if(typeof this.config.dataDir == 'undefined' && !this.flags.init)
			return this.dataDirInitError();

		let {init} = this.flags;
		if(init && init != '<default>' && init != '.')
			this.config.dataDir = init;

		if(this.config.dataDir){
			let dataDir = this.config.dataDir.replace('~', os.homedir());
			if(!path.isAbsolute(dataDir))
				return `config.dataDir (${this.config.dataDir}) is not a absolute path.`;
			this.dataFolder = dataDir;
		}else{
			this.dataFolder = this.getDefaultDataFolderPath();
			this.config.dataDir = '';
		}

		if(init)
			this.setConfig(this.config);

		this.log("DataFolder", this.dataFolder)
		fs.ensureDirSync(this.dataFolder);
		this.onDataDirInit();
	}

	/**
	* initlizing data folder error handler
	*/
	dataDirInitError(){
		console.log(`Please start app with --init=/path/to/data/dir [or] --init=~/.flow-app [or] --init=<default>`);
		this.exit();
	}

	onDataDirInit(){
		//placeholder
	}

	/**
	* @return {String} path to Binaries Folder 
	*/
	getBinaryFolder(){
		return path.join(this.appFolder, 'bin', utils.platform);
	}

	/**
	* set dataDir
	* @param {String} dataDir dataDir
	*/
	setDataDir(dataDir){
		this.config.dataDir = dataDir;
		this.setConfig(this.config);
	}

	/**
	* save theme
	* @param {String} theme theme name (dark/light)
	*/
	setTheme(theme){
		this.config.theme = theme;
		this.setConfig(this.config);
	}

	/**
	* save config
	* @param {Object} config JSON config
	*/
	setConfig(config){
		if(typeof config == 'object')
			config = JSON.stringify(config, null, "\t")
		fs.writeFileSync(this.configFile, config);
		this.config = this.getConfig();
	}

	/**
	* read config file and return config as JSON object
	* @param {Object} [defaults={}] default config object
	* @return {Object} config as JSON
	*/
	getConfig(defaults = {}){
		let text = fs.readFileSync(this.configFile, 'utf-8');
		return eval(`(${text})`);
		// return fs.readJSONSync(this.configFile, {throws:false}) || defaults;
	}

	/**
	* initilize FlowRPC
	*/
	initRPC(){
		let klass = this.options.RPC || FlowRPC;
		let rpc = new klass(this.options.rpc);
		this.rpc = rpc;

		rpc.on("get-config", (args, callback)=>{
			console.log("get-config:args", args)
			callback(null, this.config)
		});
		rpc.on("set-config", (args)=>{
			let {config} = args;
			if(!config || !config.modules)
				return
			this.setConfig(config);
		});

		rpc.on("get-init-data", (args, callback)=>{
			console.log("get-init-data: args")
			let {config, configFolder, appFolder, dataFolder} = this;
			let {modules} = config;
			callback(null, {config, configFolder, modules, appFolder, dataFolder})
		});

		rpc.on("set-theme", (args)=>{
			let {theme} = args;
			if(!theme)
				return
			this.setTheme(theme);
		});

		rpc.on("set-data-dir", (args, callback)=>{
			let {dataDir, restartDelay} = args;
			//return callback({error: "Invalid directory"});
			if(dataDir === ""){
				this.setDataDir(dataDir, restartDelay||2000);
				return
			}
			if(dataDir == undefined || !fs.existsSync(dataDir))
				return callback({error: "Invalid directory"})
			fs.stat(dataDir, (err, stats)=>{
				if(err)
					return callback(err);
				if(!stats.isDirectory())
					return callback({error: "Invalid directory"});

				this.setDataDir(dataDir, restartDelay||2000);
			})
		});

		rpc.on("set-i18n-entries", (args, callback)=>{
			let {entries} = args;
			if(!entries)
				return callback({error:"Invalid entries"});
			this.saveI18nEntries(entries);
		})

		rpc.on("get-i18n-entries", (args, callback)=>{
			let entries = this.getI18nEntries();
			console.log("get-i18n-entries", entries)
			callback(null, {entries});
		})
	}

	/**
	* @return {String} path i18n entries file
	*/
	getI18nFilePath(){
		return path.join(this.appFolder, 'i18n.data');
	}

	/**
	* @return {Array} i18n entries
	*/
	getI18nEntries(){
		let file = this.getI18nFilePath();
		if(!fs.existsSync(file))
			return [];

		let data = (fs.readFileSync(file)+"").trim();
		if(!data.length)
			return [];
		try{
			data = JSON.parse(data);
		}catch(e){
			return [];
		}

		return data || [];
	}

	/**
	* saves i18n entries
	* @param {Array} i18n entries
	*/
	saveI18nEntries(entries){
		fs.writeFileSync(this.getI18nFilePath(), JSON.stringify(entries, null, "\t"))
	}

	/**
	* Logs given variables
	* @param {...*} args
	*/
	log(...args) {
		args.unshift('TT:');
		console.log(args);
	}

	/**
	* Exit App
	*/
	exit(){
		process.exit(0);
	}

	/**
	* Reload App
	*/
	reload(){
		if(this.isNw)
			chrome.runtime.reload();
	}
}

module.exports = FlowApp;