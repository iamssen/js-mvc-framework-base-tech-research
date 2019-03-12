var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = this.__decorate || function (t, p, a, d) {
        console.log('decorate1', p, d)
    d = d || Object.getOwnPropertyDescriptor(t, p);
        console.log('decorate1-1', p, d)
    for (var i = a.length - 1; i >= 0; i--) {
        d = (void 0, a[i])(t, p, d) || d;
    }
    d && Object.defineProperty(t, p, d);
        console.log('decorate2', p, d)
};
var _annotations = require('../dist_commonjs/ssen/core/annotations');
var _Ref = require('./test/ssen/Ref');
var _getRef = require('./test/getRef');
var name;
(function (name) {
    var space;
    (function (space) {
        var Type = (function () {
            function Type() {
                this.a = 'a...';
                this.b = 123;
                // console.log('type...')
            }
            return Type;
        })();
        space.Type = Type;
    })(space = name.space || (name.space = {}));
})(name || (name = {}));
var refx = new _Ref.Ref2;
var group = { a: 1, b: 2, c: 3 };
var a = group.a, b = group.b;
var ref1 = new _Ref.Ref;
var ref2 = _getRef.getRef();
// console.log(ref1.constructor == ref2.constructor)
// console.log(ref1.constructor.toString())
// console.log(ref2.constructor.toString())
var m = name.space;
var type1 = new m.Type();
// type1.d = 123
var typeis;
(function (typeis) {
    typeis[typeis["CLASS"] = 0] = "CLASS";
    typeis[typeis["PROPERTY"] = 1] = "PROPERTY";
    typeis[typeis["SETTER"] = 2] = "SETTER";
    typeis[typeis["ARGUMENT"] = 3] = "ARGUMENT";
    typeis[typeis["METHOD"] = 4] = "METHOD";
})(typeis || (typeis = {}));
// @param c typeof Class : target class
// @param annotation typeof any : some annotation object
// 
// c.annotations = [annotation]
// 
// Class에 annotations 배열을 만들고 annotation을 기록해준다
//function addAnnotation(c: any, annotation: any): any {
//    (c.annotations || (c.annotations = [])).push(annotation)
//    return c
//}
// annotation object
var SampleAnnotationClass = (function (_super) {
    __extends(SampleAnnotationClass, _super);
    function SampleAnnotationClass(a, b, t) {
        _super.call(this);
        this.a = a;
        this.b = b;
        this.t = t;
    }
    Object.defineProperty(SampleAnnotationClass.prototype, "name", {
        get: function () {
            return 'SampleAnnotationClass';
        },
        enumerable: true,
        configurable: true
    });
    SampleAnnotationClass.prototype.toString = function () {
        return "[SampleAnnotationClass name=" + this.name + " a=" + this.a + " b=" + this.b + " t=" + this.t + "]";
    };
    return SampleAnnotationClass;
})(_annotations.Annotation);
// 실제 SampleAnnotation은 Class 형식이 아니라
// `function(c:Class) { return c }` 의 decorator function 형태를 가진다
function SampleAnnotation(arg) {
    // return function (c) {
    //    addSampleAnnotation(c, new SampleAnnotationClass(a, b))
    // }
    return function (c, propertyName, descriptor) {
        // console.log('!!!', typeof c, propertyName, descriptor, arg.t)
        console.log('------------------------');
        console.log(propertyName, typeof propertyName);
        console.log(typeof c);
        //console.log(c)
        console.log(c.constructor.name);
        console.log(descriptor);
        return _annotations.addAnnotation(c, new SampleAnnotationClass(arg.a, arg.b, arg.t), propertyName, descriptor);
    };
}
// AtScript 스펙에 있던 
// Class.properties
// Class.annotate
// Class.parameters
// 등은 삭제가 된듯 하다. (소스에 반영이 안된다)
// 현재 annotations 이외의 모든 스펙을 확인할 수 없다
// 스펙이 어느 정도 축소되었음을 알 수 있다 (아마도 ES5, ES6, Typescript, Dart 모두를 지원하기 위해?)
var ParamClass = (function () {
    function ParamClass() {
    }
    return ParamClass;
})();
var ssen;
(function (ssen) {
    var annotations;
    (function (annotations) {
        var TestAnnotationTemplate = (function () {
            function TestAnnotationTemplate() {
            }
            return TestAnnotationTemplate;
        })();
        annotations.TestAnnotationTemplate = TestAnnotationTemplate;
        function TestAnnotation() {
            return function (target) {
                return _annotations.addAnnotation(target, new TestAnnotationTemplate());
            };
        }
        annotations.TestAnnotation = TestAnnotation;
    })(annotations = ssen.annotations || (ssen.annotations = {}));
})(ssen || (ssen = {}));
// 작성된 Annotation function은 이와 같이 사용할 수 있다
var Sample = (function () {
    function Sample(param) {
    }
    Sample.prototype.fun1 = function () {
        return new ParamClass;
    };
    Sample.prototype.fun2 = function (arg) {
    };
    Object.defineProperty(Sample.prototype, "setter", _a = {
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    __decorate(Sample.prototype, "prop1", [SampleAnnotation({ a: 'prop a', b: 456, t: 1 /* PROPERTY */ })]);
    __decorate(Sample.prototype, "fun1", [SampleAnnotation({ a: 'func a', b: 234, t: 4 /* METHOD */ })]);
    SampleAnnotation({ a: 'args a', b: 234, t: 3 /* ARGUMENT */ })(Sample.prototype.fun2, 0);
    console.log('$$$$$$', _a)
    __decorate(Sample.prototype, "setter", [SampleAnnotation({ a: 'setter a', b: 234, t: 2 /* SETTER */ })], _a);
    Sample = SampleAnnotation({ a: 'class a', b: 123, t: 0 /* CLASS */ })(Sample) || Sample;
    var _a;
    return Sample;
})();
var Sample2 = (function () {
    function Sample2() {
    }
    Sample2 = ssen.annotations.TestAnnotation()(Sample2) || Sample2;
    return Sample2;
})();
console.log('==================================================');
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'prop1'));
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'fun1'));
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'fun2'));
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'setter'));
//# sourceMappingURL=learn-annotations.js.map