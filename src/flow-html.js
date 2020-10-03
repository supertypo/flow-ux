import {html} from 'lit-element';

export const flowHtml = (strings, tags, ...values)=>{
	strings = strings.slice(1).map(str=>{
		tags.forEach((value, key)=>{
			str = str.replace(new RegExp(`\{${key}\}`, 'g'), value);
		});
		return str;
	})
	//console.log("flowHtml:strings", strings)
	//console.log("flowHtml:values", values)
	return html(strings, ...values);
}
