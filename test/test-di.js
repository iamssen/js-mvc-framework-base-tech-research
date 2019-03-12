var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = this.__decorate || function (t, p, a, d) {
    d = d || Object.getOwnPropertyDescriptor(t, p);
    for (var i = a.length - 1; i >= 0; i--) d = (void 0, a[i])(t, p, d) || d;
    d && Object.defineProperty(t, p, d);
};
// @formatter:off
var _di = require('../src/ssen/mvc/di');
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
var LeftArm = (function () {
    function LeftArm() {
    }
    return LeftArm;
})();
var RightArm = (function () {
    function RightArm() {
    }
    return RightArm;
})();
var LeftLeg = (function () {
    function LeftLeg() {
    }
    return LeftLeg;
})();
var RightLeg = (function () {
    function RightLeg() {
    }
    return RightLeg;
})();
var Hand = (function () {
    function Hand() {
    }
    return Hand;
})();
var LeftHand = (function (_super) {
    __extends(LeftHand, _super);
    function LeftHand() {
        _super.apply(this, arguments);
    }
    return LeftHand;
})(Hand);
var RightHand = (function (_super) {
    __extends(RightHand, _super);
    function RightHand() {
        _super.apply(this, arguments);
    }
    return RightHand;
})(Hand);
var Robot = (function () {
    function Robot() {
        this.leftArm = 'a';
        //console.log('constructor', this)
        //this.toString = this.toString.bind(this)
        //console.log('constructor??????', this.leftArm)
        //console.log('constructor', this.toString())
    }
    Robot.prototype.toString = function () {
        //console.log('toString!!!!', this.leftArm, this.rightArm)
        return "[Robot leftArm=" + this.leftArm + " rightArm=" + this.rightArm + " leftLeg=" + this.leftLeg + " rightLeg=" + this.rightLeg + "]";
    };
    __decorate(Robot.prototype, "leftArm", [_di.Inject(LeftArm)]);
    __decorate(Robot.prototype, "rightArm", [_di.Inject(RightArm)]);
    __decorate(Robot.prototype, "leftLeg", [_di.Inject(LeftLeg)]);
    __decorate(Robot.prototype, "rightLeg", [_di.Inject(RightLeg)]);
    return Robot;
})();
var injector = new _di.Injector;
injector.mapClass(LeftArm);
injector.mapClass(RightArm);
injector.mapClass(LeftLeg);
injector.mapClass(RightLeg);
injector.mapClass(Robot);
console.log('------------------------------------------------------------------------------------------');
console.log(Object.getOwnPropertyDescriptor(Robot.prototype, 'leftLeg'));
var robot = injector.getInstance(Robot);
var robot2 = new Robot();
console.log('robot', robot.toString());
//# sourceMappingURL=test-di.js.map