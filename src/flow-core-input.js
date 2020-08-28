export class FlowCoreInput extends HTMLInputElement{
	connectedCallback(){
		this.initState();
		this.initEvents();
	}
	initState(){
		//console.log("this.dataset.allowedPattern", this.dataset.allowedPattern)
		this.__state = {
			value: this.value,
			start: this.selectionStart,
			end: this.selectionEnd,
			allowedPattern: this.dataset.allowedPattern ? RegExp(`^${this.dataset.allowedPattern}$`): null
		};
	}
	initEvents(){
		this.addEventListener('focus', this._onFocus.bind(this));
		this.addEventListener('input', this._onInput.bind(this));
		this.addEventListener('keydown', this._onKeyDown.bind(this));
	}

	getState(){
		return this.__state;
	}

	_onInput(e){
		let state = this.getState();
		if (!state.allowedPattern || state.allowedPattern.test(this.value)) {
			state.value = this.value;
		}else{
			//console.log("input FAIL:", state.allowedPattern, this.value)
			this.value = state.value;
			this.setSelectionRange(state.start, state.end);
		}
	}
	_onFocus(){
		let state = this.getState()
		state.value = this.value;
		state.start = this.selectionStart;
		state.end = this.selectionEnd
	}
	_onKeyDown(e){
		let state = this.getState();
		state.start = this.selectionStart;
		state.end = this.selectionEnd
	}
}

customElements.define('flow-core-input', FlowCoreInput, {extends:'input'});
