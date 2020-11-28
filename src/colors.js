import {dpc} from './helpers.js';

export const buildColors = ({h, s, l}, opt={})=>{
	let {
		bg='hsl(var(--h), calc(var(--s) * 1%), calc(var(--l) * 1%))',
		color='hsl(var(--h), calc(var(--s) * 1%), calc(calc((-2500 * (20 / 100 + 1)) / (var(--l) - 49.999) + var(--l)) * 1%))',
	} = opt;

	const n = `color${(Math.random()*100000).toFixed(0)}`;

	bg = bg
		.replace(/var\(--h\)/g, `var(--${n}-h)`)
		.replace(/var\(--s\)/g, `var(--${n}-s)`)
		.replace(/var\(--l\)/g, `var(--${n}-l)`);
	color = color
		.replace(/var\(--h\)/g, `var(--${n}-h)`)
		.replace(/var\(--s\)/g, `var(--${n}-s)`)
		.replace(/var\(--l\)/g, `var(--${n}-l)`);

	let el = document.createElement("div");
	el.style.setProperty(`--${n}-h`, h);
	el.style.setProperty(`--${n}-s`, s)
	el.style.setProperty(`--${n}-l`, l)
	el.style.backgroundColor = bg
	el.style.color = color;
	el.style.display = 'none';
	el.style.position = 'fixed';
	document.body.appendChild(el);
	let p = new Promise((resolve)=>{
		dpc(200, e=>{
			let style = getComputedStyle(el);
			let backgroundColor = style.backgroundColor;
			let color = style.color;
			resolve({backgroundColor, color});
			dpc(e=>{
				el.remove();
			})
		})
	});
	p.element = el;
	return p;
}

export const hexToRgb = (hex)=>{
	if(hex[0]!="#")
		hex = '#'+hex
	let a;
	if(hex.length < 7)
		a = hex
			.split('')
			.reduce((rgb, val, idx) => `${rgb}${val}0,`, '')
	else
		a = hex
			.split('')
			.reduce((rgb, val, idx) => rgb + (idx % 2 ? val : val + ','), '')

	let [r,g,b] = a.split(',').splice(1, 3).map(val => parseInt(val, 16))
	return {r,g,b};
}

export const rgbToHsl = ({r, g, b})=>{
	r /= 255, g /= 255, b /= 255
	const max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h, s, l = (max + min) / 2

	if(max == min){
		h = s = 0;
	} else {
		let d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		h = ({
			[r]: (g - b) / d,
			[g]: 2 + ( (b - r) / d),
			[b]: 4 + ( (r - g) / d),
		})[max] * 60
		if (h < 0) h +=360
	}
	s *= 100
	l *= 100
	return { h, s, l }
}

export const parseRGBA = color=>{
	let [r,g,b,a=100] = color.split("(")[1].split(")")[0].split(",");
	return {r,g,b,a};
}

export const color2hsl = (color)=>{
	if(color.h)
		return color;
	if(color.r)
		return rgbToHsl(color);
	if(color[0]=="#")
		return rgbToHsl(hexToRgb(color));
	color = color.toLowerCase();
	if(color[0]=="r")
		return rgbToHsl(parseRGBA(color));
}

export const hex2Colors = (color="#FF0000", opt={})=>{
	const hsl = color2hsl(rgb);
	return buildColors(hsl, opt);
}
export const rbg2Colors = (rgb={r:255, g:0, b:0}, opt={})=>{
	const hsl = color2hsl(rgb);
	return buildColors(hsl, opt);
}
export const hsl2Colors = (hsl={h:0, s:100, l:50}, opt={})=>{
	return buildColors(hsl, opt);
}

export const testColor = async(color="#FF0000")=>{
	const rgb = hexToRgb(color);
	const hsl = rgbToHsl(rgb);
	console.log("testColor::hexToRgb", rgb)
	console.log("testColor::rgbToHsl", hsl)
	let {backgroundColor, color:c} = await buildColors(hsl);
	console.log("testColor::backgroundColor, color", backgroundColor, c)
}

//testColor();
