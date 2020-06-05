import {flow, dpc} from './base-element.js';

export class FlowFormat {
	static 'duration'(v) {
		let hrs = Math.floor(v/60/60);
		let min = Math.floor(v/60%60);
		let sec = Math.floor(v%60);
		if(!hrs && !min && !sec)
			return _C(v);
		let t = '';
		if(hrs) t += (hrs < 10 ? '0'+hrs : hrs) + ' h ';
		if(hrs || min) t += (min < 10 ? '0'+min : min) + ' m ';
		if(hrs || min || sec) t += (sec < 10 ? '0'+sec : sec) + ' s ';
		return t;
	}
	static 'commas'(v, precision = 0) {
		var parts = parseFloat(v).toFixed(parseInt(precision)).toString().split('.');
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join('.');
	}
		
	static 'cs'(v, ctx) {
		const { precision } = ctx;
		return FlowFormat.commas(v, precision || 0);
	}
	static 'fiat'(v) { return this.commas(v,2); }
	static 'crypto'(v) { return this.commas(v,8); }
	static 'int'(v) { return this.commas(parseInt(v)); }
	static 'file-size-si'(v) { return parseFloat(v).toFileSize(true); }
	static 'file-size'(v) { return parseFloat(v).toFileSize(); }
	static 'hash-rate'(v, ctx) { return parseFloat(v).toHashMetric(ctx.precision, ctx.unit, ctx.commas) + "H/s"; }
	static 'default'(v, ctx) {
		return FlowFormat.cs(v, ctx);
		// const { precision } = ctx;
		// if(precision)
		// 	return parseFloat(v).toFixed(parseInt(precision));
		// return parseInt(v);
	}
}

if(!Number.prototype.toFileSize)
	Object.defineProperty(Number.prototype, 'toFileSize', {
		value: function(a, asNumber){
			var b,c,d;
			var r = (
				a=a?[1e3,'k','B']:[1024,'K','iB'],
				b=Math,
				c=b.log,
				d=c(this)/c(a[0])|0,this/b.pow(a[0],d)
			).toFixed(2)

			if(!asNumber){
				r += ' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
			}
			return r;
		},
		writable:false,
		enumerable:false
	});

if(!Number.prototype.toHashMetric)
	Object.defineProperty(Number.prototype, 'toHashMetric', {
		value: function(precision, unit, commas) {

			var l = [
				[1e24, 'Y'],
				[1e21, 'Z'],
				[1e18, 'E'],
				[1e15, 'P'],
				[1e12, 'T'],
				[1e9, 'G'],
				[1e6, 'M'],
				[1e3, 'k']
			];

			var i = 0;
			if(unit) {
				while(i < l.length-1 && unit != l[i][1])
					i++;

			}
			else {
				while(i < l.length-1 && (this) < l[i][0])
					i++;
				unit = l[i][1];
			}

			var v = this / l[i][0];
			
			precision = _.isUndefined(precision) ? 2 : parseInt(precision);
			if(commas) {
				var parts = v.toFixed(precision).toString().split('.');
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return parts.join('.') + ' ' + unit;
			}
			else {
				return v.toFixed(precision) + ' ' + unit;
			}
		},
		writable:false,
		enumerable:false
	});	