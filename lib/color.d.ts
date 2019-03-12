declare class ColorObject {
	// set colors
	public rgb(red:number, green:number, blue:number):ColorObject;
	public rgb(values:Array<number>):ColorObject;

	public hsl(hue:number, saturation:number, lightness:number):ColorObject;
	public hsl(values:Array<number>):ColorObject;

	public hsv(hue:number, saturation:number, value:number):ColorObject;
	public hsv(values:Array<number>):ColorObject;

	public hwb(hue:number, whiteness:number, blackness:number):ColorObject;
	public hwb(values:Array<number>):ColorObject;

	public cmyk(cyan:number, magenta:number, yellow:number, black:number):ColorObject;
	public cmyk(values:Array<number>):ColorObject;

	// set properties
	public alpha(value:number):ColorObject;

	public red(value:number):ColorObject;

	public green(value:number):ColorObject;

	public blue(value:number):ColorObject;

	public red(value:number):ColorObject;

	public green(value:number):ColorObject;

	public blue(value:number):ColorObject;

	public hue(value:number):ColorObject;

	public saturation(value:number):ColorObject;

	public lightness(value:number):ColorObject;

	public saturationv(value:number):ColorObject;

	public whiteness(value:number):ColorObject;

	public blackness(value:number):ColorObject;

	public value(value:number):ColorObject;

	public cyan(value:number):ColorObject;

	public magenta(value:number):ColorObject;

	public yellow(value:number):ColorObject;

	public black(value:number):ColorObject;

	// to css string
	public hexString():string;

	public rgbString():string;

	public rgbaString():string;

	public percentString():string;

	public hslString():string;

	public hslaString():string;

	public hwbString():string;

	public keywordString():string;

	public rgbNumber():number;

	// mix
	public luminosity():number;

	public contrast(color2:ColorObject):number;

	public level(color2:ColorObject):string;

	public dark():boolean;

	public light():boolean;

	public negate():ColorObject;

	public lighten(ratio:number):ColorObject;

	public darken(ratio:number):ColorObject;

	public saturate(ratio:number):ColorObject;

	public desaturate(ratio:number):ColorObject;

	public whiten(ratio:number):ColorObject;

	public blacken(ratio:number):ColorObject;

	public grayscale():ColorObject;

	public clearer(ratio:number):ColorObject;

	public opaquer(ratio:number):ColorObject;

	public rotate(degrees:number):ColorObject;

	public mix(color2:ColorObject, weight:number):ColorObject;

	public toJSON():Object;

	public clone():ColorObject;
}

declare function Color(color?:any):ColorObject;