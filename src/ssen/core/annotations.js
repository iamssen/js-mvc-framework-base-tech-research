///<reference path="../../lib.d.ts"/>
(function (AnnotationTarget) {
    AnnotationTarget[AnnotationTarget["CLASS"] = 0] = "CLASS";
    AnnotationTarget[AnnotationTarget["VARIABLE"] = 1] = "VARIABLE";
    AnnotationTarget[AnnotationTarget["ACCESSOR"] = 2] = "ACCESSOR";
    AnnotationTarget[AnnotationTarget["METHOD"] = 3] = "METHOD";
    AnnotationTarget[AnnotationTarget["PARAMETER"] = 4] = "PARAMETER";
})(exports.AnnotationTarget || (exports.AnnotationTarget = {}));
var AnnotationTarget = exports.AnnotationTarget;
function getAnnotationTarget(target, name, descriptor) {
    switch (typeof name) {
        // class
        case 'undefined':
            if (descriptor === undefined) {
                return 0 /* CLASS */;
            }
            break;
        // property, function, accessor
        case 'string':
            if (descriptor) {
                if (typeof descriptor['set'] === 'function' || typeof descriptor['get'] === 'function') {
                    return 2 /* ACCESSOR */;
                }
                else if (typeof descriptor['value'] === 'function') {
                    return 3 /* METHOD */;
                }
            }
            else {
                return 1 /* VARIABLE */;
            }
            break;
        // argument
        case 'number':
            if (typeof target === 'function') {
                return 4 /* PARAMETER */;
            }
            break;
    }
}
var Annotation = (function () {
    function Annotation() {
    }
    Object.defineProperty(Annotation.prototype, "name", {
        get: function () {
            throw new Error('abstract getter');
        },
        enumerable: true,
        configurable: true
    });
    return Annotation;
})();
exports.Annotation = Annotation;
var AnnotationMap = (function () {
    function AnnotationMap() {
        this.list = [];
        this.map = {};
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.has = this.has.bind(this);
        this.all = this.all.bind(this);
        this.get = this.get.bind(this);
    }
    AnnotationMap.prototype.add = function (annotation) {
        var index = this.list.push(annotation) - 1;
        var Type = annotation.constructor;
        this.map[Type] = index;
    };
    AnnotationMap.prototype.remove = function (Type) {
        delete this.map[Type];
    };
    AnnotationMap.prototype.has = function (Type) {
        return this.map[Type] !== undefined;
    };
    AnnotationMap.prototype.all = function () {
        return this.list.slice();
    };
    AnnotationMap.prototype.get = function (Type) {
        return this.list[this.map[Type]];
    };
    return AnnotationMap;
})();
exports.AnnotationMap = AnnotationMap;
// Class.annotations                        : Class
// Class.prototypes.annotations             : Variable, Accessor, Function
// Class.prototypes.{function}.annotations  : Parameter
// 
// variable
// - target.constructor 있다
// - typeof target 이 object 이다
// - descriptor 가 없다
// 
// accessor
// - target.constructor 가 있다
// - typeof target 이 object 이다
// - descriptor.set 이 function 이다
//
// function
// - target.constructor 있음
// - typeof target 이 object 이다
// - descriptor.value 가 function 이다 
// 
// class
// - propertyName 이 undefined 이다
// - descriptor 역시 undefined 이다
function addAnnotation(target, annotation, name, descriptor) {
    var annotationTarget = getAnnotationTarget(target, name, descriptor);
    var annotations = null;
    var annotationsGroup = null;
    var group = null;
    // console.log('addAnnotation : annotationTarget', annotationTarget)
    switch (annotationTarget) {
        case 0 /* CLASS */:
        case 4 /* PARAMETER */:
            annotations = (target['annotations'] || (target['annotations'] = new AnnotationMap));
            break;
        case 1 /* VARIABLE */:
            annotationsGroup = (target['annotations'] || (target['annotations'] = {}));
            group = (annotationsGroup['variables'] || (annotationsGroup['variables'] = {}));
            annotations = (group[name] || (group[name] = new AnnotationMap));
            //console.log('addAnnotation', target[name])
            //delete target[name]
            //console.log('addAnnotation', target[name])
            console.log(target);
            break;
        case 2 /* ACCESSOR */:
            annotationsGroup = (target['annotations'] || (target['annotations'] = {}));
            group = (annotationsGroup['accessors'] || (annotationsGroup['accessors'] = {}));
            annotations = (group[name] || (group[name] = new AnnotationMap));
            delete target[name];
            break;
        case 3 /* METHOD */:
            annotationsGroup = (target['annotations'] || (target['annotations'] = {}));
            group = (annotationsGroup['methods'] || (annotationsGroup['methods'] = {}));
            annotations = (group[name] || (group[name] = new AnnotationMap));
            break;
    }
    annotations.add(annotation);
    return target;
}
exports.addAnnotation = addAnnotation;
var AnnotationUtils = (function () {
    function AnnotationUtils() {
    }
    AnnotationUtils.searchType = function (Type) {
    };
    return AnnotationUtils;
})();
exports.AnnotationUtils = AnnotationUtils;
/*
 AnnotationMap
 add(Annotation)
 remove(Annotation)
 has(Annotation):boolean
 getTypes():Class[]

 Class:
 - @annotations:AnnotationMap
 - @prototype:{}
 -- @annotations:{}
 --- @variables:{}
 ---- @{name}:AnnotationMap
 --- @accessors:{}
 ---- @{name}:AnnotationMap
 --- @methods:{}
 ---- @{name}:AnnotationMap

 */
//# sourceMappingURL=annotations.js.map