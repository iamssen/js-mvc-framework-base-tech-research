// @formatter:off
import {Inject, Injector} from '../src/ssen/mvc/di'
// @formatter:off

//Function.prototype.getPrimaryKey = function():number {
//	if (typeof this['primaryKey'] != 'number') {
//		if (typeof Function['primaryCount'] != 'number') {
//			Function['primaryCount'] = 0
//		} else {
//			Function['primaryCount'] += 1
//		}
//		this['primaryKey'] = Function['primaryCount']
//	}
//}

class LeftArm {
	//@Inject(Hand) hand:Hand
}

class RightArm {
	//@Inject(Hand) hand:Hand
}

class LeftLeg {

}

class RightLeg {

}

class Hand {

}

class LeftHand extends Hand {

}

class RightHand extends Hand {

}

class Robot {
	@Inject(LeftArm)
	public leftArm:LeftArm = 'a'

	@Inject(RightArm)
	public rightArm:RightArm

	@Inject(LeftLeg)
	public leftLeg:LeftLeg

	@Inject(RightLeg)
	public rightLeg:RightLeg

	constructor() {
		//console.log('constructor', this)
		//this.toString = this.toString.bind(this)
		//console.log('constructor??????', this.leftArm)
		//console.log('constructor', this.toString())
	}

	toString() {
		//console.log('toString!!!!', this.leftArm, this.rightArm)
		return `[Robot leftArm=${this.leftArm} rightArm=${this.rightArm} leftLeg=${this.leftLeg} rightLeg=${this.rightLeg}]`
	}
}

var injector:Injector = new Injector
injector.mapClass(LeftArm)
injector.mapClass(RightArm)
injector.mapClass(LeftLeg)
injector.mapClass(RightLeg)
injector.mapClass(Robot)

console.log('------------------------------------------------------------------------------------------')
console.log(Object.getOwnPropertyDescriptor(Robot.prototype, 'leftLeg'))

var robot:Robot = <Robot> injector.getInstance(Robot)
var robot2:Robot = new Robot()

console.log('robot', robot.toString())
