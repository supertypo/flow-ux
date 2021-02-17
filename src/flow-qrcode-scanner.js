import {BaseElement, html, css, baseUrl} from './base-element.js';
import { dpc, contain} from './helpers.js';
import {jsQR} from '../resources/extern/jsQR/jsQR.js';
//console.log("jsQR", jsQR)

export class FlowQRCodeScanner extends BaseElement {
	static get properties() {
		return {
			cameras:{type:Array},
			selectedCamera:{type:Object},
			qrCode:{type:String},
			errorMessage:{type:String},
			hideCode:{type:Boolean, reflect:true},
			stoped:{type:Boolean}
		}
	}

	static get styles() {
		return css`
			:host {
				display : block;
				min-width: 100px;
				min-height: 100px;
				/*max-width: 400px;*/
				/*overflow:auto;*/
				margin:auto;
				position:relative;
				/*max-height:80vh;*/
			}
			.error{
				font-size:var(--flow-qrcode-scanner-error-font-size, 0.8rem);
				color:var(--flow-qrcode-scanner-error-color, #F00);
				padding:var(--flow-qrcode-scanner-error-padding, 10px);
			}
			.wait-msg, .select-msg{
				font-size:var(--flow-qrcode-scanner-msg-font-size, 1rem);
				text-align:center;padding:10px;
			}
			.video{border:0px solid #000000;display:none;}
			.view{
				border:1px solid #000000;display:block;margin:5px auto;
				width:var(--flow-qrcode-scanner-canvas-width, 280px);
				height:var(--flow-qrcode-scanner-canvas-height, 280px);
				object-fit:contain;
			}
			.render-canvas{
				position:absolute;border:0px solid #000;display:none
			}
			.code-box{
				display:flex;
				flex-direction:var(--flow-qrcode-scanner-code-box-flex-direction, column);
				align-items:var(--flow-qrcode-scanner-code-box-align-items, center);
			}
			.code{
				border:0px;-webkit-appearance:none;outline:none;
				margin:var(--flow-qrcode-scanner-code-margin, 10px);
				overflow:hidden;text-overflow:ellipsis;
				font-size:var(--flow-qrcode-scanner-code-font-size, 1rem);
				background-color:transparent;color:var(--flow-primary-color);
				font-family:var(--flow-qrcode-scanner-code-font-family, "Exo 2");
				word-wrap:break-word;
				max-width:100%;
				width:var(--flow-qrcode-scanner-code-width, 300px);
				height:var(--flow-qrcode-scanner-code-height, auto);
				/*max-height:var(--flow-qrcode-scanner-code-max-height, 100px);*/
				resize:none;
				display:block;
			}
			:host([hidecode]) .code-box{display:none}
			.logs{width:90%;height:100px;}
			:host(:not([logs])) .logs{display:none}
			.camera-selection{
				display:flex;
			}
			/*
			.camera-selection flow-select{
				max-width:var(--flow-qrcode-scanner-s-max-width, 400px);
				--flow-dropdown-display:var(--flow-qrcode-scanner-s-display, block);
				--flow-select-width:var(--flow-qrcode-scanner-sw, var(--flow-select-width, 100%));
				--flow-select-margin:var(--flow-qrcode-scanner-sm, var(--flow-select-margin, 10px auto));
			}
			*/
		`;
	}

	constructor() {
		super();
		this.stoped = true;
	}

	render() {
		let {cameras=[], selectedCamera='', qrCode='', errorMessage=''} = this;
		return html`
			<textarea class="logs"></textarea>
			<div class="error">${errorMessage}</div>
			${this.renderScanning()}
			${this.renderCameraSelection()}
			${this.renderCode()}
		`;
	}

	renderCameraSelection(){
		const {cameras, selectedCamera, cameraDiscovery, stoped} = this;
		if(cameraDiscovery === false || stoped)
			return '';
		if(!cameras)
			return html`<div class="wait-msg">Please wait. Getting cameras.</div>`;
		//if(selectedCamera)
		//	return html`<div>Selected cameras: ${selectedCamera.label}</div>`

		let selected = selectedCamera?.id||'';
		return html`
		<div class="camera-selection">
			<!--div class="select-msg">Select cameras</div-->
			<flow-select label="Select cameras"
				@select="${this.onCameraSelect}" selected="${selected}">
				${cameras.map(c=>{
					return html`<flow-menu-item
						value="${c.id}">${c.label}</flow-menu-item>`
				})}
			</flow-select>
		</div>
		`
	}
	renderScanning(){
		//let {selectedCamera} = this;
		//if(!selectedCamera)
		//	return ''

		return html`
			<video class="video" width="320" height="240" autoplay></video>
			<img class="view">
			<canvas class="render-canvas"></canvas>
		`
	}

	renderCode(){
		let {qrCode} = this;
		if(!qrCode)
			return '';
		return html`
			<div class="code-box">
				<!--div class="label">QR code:</div-->
				<div class="code">QR code: ${qrCode}</div>
				<flow-btn @click="${this.clearCode}">Clear</flow-btn>
			</div>
		`;
	}
	clearCode(){
		this.setQRCode("");
	}
	setQRCode(qrCode){
		this.qrCode = qrCode;
		this.fire("changed", {code: qrCode})
	}

	firstUpdated(){
		super.firstUpdated();
		this.viewImg = this.renderRoot.querySelector(".view");
		this.init();
	}
	updated(){
		super.updated();
		this.initScanning();
	}
	_log(title, data){
		let input = this.renderRoot.querySelector(".logs");
		input.value += `\n--------------\n${title}\n`+JSON.stringify(data)
	}
	stop(){
		this.stoped = true;
		let {video} = this;
		this.closeActiveStreams(video?.srcObject)
	}
	start(){
		this.stoped = false;
		this.scanning = false;
		this.init();
	}
	initScanning(){
		if(this.qrCode || this.stoped)
			return
		let canvas = this.renderRoot.querySelector(".render-canvas");
		let video = this.renderRoot.querySelector(".video")
		let {selectedCamera} = this;
		this._log("initScanning", {canvas:!!canvas, video:!!video, selectedCamera, scanning:this.scanning})
		if(!canvas || !video || !selectedCamera)
			return

		if(this.scanning == selectedCamera.id)
			return
		this.closeActiveStreams(video.srcObject)
		this.scanning = selectedCamera.id;
		this.video = video;

		const canvasCtx = canvas.getContext('2d');
		//const desiredWidth = 1280;
		//const desiredHeight = 720;

		const constraints = {
			audio: false,
			video:{deviceId: { exact: selectedCamera.id }}
			/*,
			video: {
				// the browser will try to honor this resolution,
				// but it may end up being lower.
				width: desiredWidth,
				height: desiredHeight
			}*/
		};

		// open the webcam stream
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			video.srcObject = stream;
			const track = stream.getVideoTracks()[0];
			const trackInfo = track.getSettings();
			let {width, height} = trackInfo;
			// required to tell iOS safari we don't want fullscreen
			video.setAttribute("playsinline", true);
			video.play();
			requestAnimationFrame(()=>{
				this.videoTick({
					video, trackInfo:{width, height}, canvas, canvasCtx,
					cameraId : selectedCamera.id
				})
			});

		}).catch((e) => {
			throw e
		});
	}

	setError(error){
		this.errorMessage = error;
	}

	async init(){
		if(this.stoped)
			return
		try{
			let cameras = await this.getCameras();
			this.cameras = cameras;
			let backCameras =  cameras.find(c=>!c.label.toLowerCase().includes("front"))
			if(backCameras.length){
				this.selectedCamera = backCameras[0];
			}else if(cameras.length){
				this.selectedCamera = cameras[0];
			}
			this.log("cameras", cameras)
		}catch(e){
			console.log("getCameras:error", e)
			this.setError(html`Camera discovery process failed.
				<br />Make sure you have given Camera permission.`)
			this.cameraDiscovery = false;
		}
	}
	closeActiveStreams(stream){
		if(!stream)
			return
		const tracks = stream.getVideoTracks();
		for (var i = 0; i < tracks.length; i++) {
			const track = tracks[i];
			track.enabled = false;
			track.stop();
			stream.removeTrack(track);
		}
	}

	getCameras() {
		return new Promise((resolve, reject) => {
			if (navigator.mediaDevices
				&& navigator.mediaDevices.enumerateDevices
				&& navigator.mediaDevices.getUserMedia) {
				this.log("navigator.mediaDevices used");
				navigator.mediaDevices.getUserMedia({ audio: false, video: true })
				.then(stream => {
					// hacky approach to close any active stream if they are
					// active.
					stream.oninactive
						= _ => this.log("All streams closed");

					navigator.mediaDevices.enumerateDevices()
						.then(devices => {
							const results = [];
							//alert("devices:"+JSON.stringify(devices))
							for (var i = 0; i < devices.length; i++) {
								const device = devices[i];
								if (device.kind == "videoinput") {
									if(!/front/.test(device.label) || devices.length == 1) {
										results.push({
											id: device.deviceId,
											label: device.label
										});
									}
								}
							}
							this.log(`${results.length} results found`);
							this.closeActiveStreams(stream);
							resolve(results);
						})
						.catch(err => {
							reject(`${err.name} : ${err.message}`);
						});
				})
				.catch(err => {
					reject(`${err.name} : ${err.message}`);
				})
			} else if (MediaStreamTrack && MediaStreamTrack.getSources) {
				this.log("MediaStreamTrack.getSources used");
				const callback = sourceInfos => {
					const results = [];
					for (var i = 0; i !== sourceInfos.length; ++i) {
						const sourceInfo = sourceInfos[i];
						if (sourceInfo.kind === 'video') {
							results.push({
								id: sourceInfo.id,
								label: sourceInfo.label
							});
						}
					}
					this.log(`${results.length} results found`);
					resolve(results);
				}
				MediaStreamTrack.getSources(callback);
			} else {
				this.log("unable to query supported devices.");
				reject("unable to query supported devices.");
			}
		});
	}

	stopScanning(){
		let {video} = this;
		this._log("stopScanning", 'video_srcObject:'+(!!video?.srcObject))
		if(video?.srcObject){
			this.closeActiveStreams(video.srcObject)
			video.srcObject = null;
		}
		this.scanning = false;
	}

	videoTick({video, trackInfo, canvasCtx, canvas, cameraId}) {
		if(cameraId != this.selectedCamera?.id)
			return
		let next = ()=>{
			if(this.qrCode){
				this.stopScanning()
				return
			}
			requestAnimationFrame(()=>{
				this.videoTick({video, trackInfo, canvas, canvasCtx, cameraId})
			});
		}


		//loadingMessage.innerText = "⌛ Loading video..."
		if (video.readyState !== video.HAVE_ENOUGH_DATA)
			return next();

		const drawLine = (ctx, begin, end, color="#FF3B58")=>{
			ctx.beginPath();
			ctx.moveTo(begin.x, begin.y);
			ctx.lineTo(end.x, end.y);
			ctx.lineWidth = 4;
			ctx.strokeStyle = color;
			ctx.stroke();
		}

		//console.log(actualSettings.width, actualSettings.height)
		canvas.width = trackInfo.width;//200;//actualSettings.width;
		canvas.height = trackInfo.height;//200;//actualSettings.height;

		const { 
			offsetX, offsetY, width, height
		} = contain(canvas.width, canvas.height, trackInfo.width, trackInfo.height);

		canvasCtx.drawImage(video, offsetX, offsetY, width, height);
		let imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

		let code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});

		if (code) {
			let loc = code.location;
			drawLine(canvasCtx, loc.topLeftCorner, loc.topRightCorner);
			drawLine(canvasCtx, loc.topRightCorner, loc.bottomRightCorner);
			drawLine(canvasCtx, loc.bottomRightCorner, loc.bottomLeftCorner);
			drawLine(canvasCtx, loc.bottomLeftCorner, loc.topLeftCorner);
			this.setQRCode(code.data);
		}

		this.viewImg.src = canvas.toDataURL("image/jpeg");

		next();
		
	}

	onCameraSelect(e){
		let {selected} = e.detail;
		console.log("selected", selected)
		this.selectedCamera = this.cameras.find(c=>c.id == selected);
	}

}

FlowQRCodeScanner.define('flow-qrcode-scanner');
