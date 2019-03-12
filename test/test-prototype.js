'use strict'

var CLS = (function () {
	function CLS() {
	}

	CLS.prototype.func = function () {
		console.log(this.message);
	}

	//CLS.prototype.hello = undefined

	Object.defineProperty(CLS.prototype, 'hello', {
		value: 101,
		writable: true,
		enumerable: true,
		configurable: true
	})

	return CLS;
})()

console.log('test-prototype.js..()', Object.getOwnPropertyDescriptor(CLS.prototype, 'hello'))

var ins = new CLS
//ins.hello = 34

console.log('ins', ins.hello)