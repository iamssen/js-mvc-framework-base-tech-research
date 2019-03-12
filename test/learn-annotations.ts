import {Annotation, addAnnotation} from '../dist_commonjs/ssen/core/annotations'
import {Ref, Ref2} from './test/ssen/Ref'
import {getRef} from './test/getRef'

module name.space {
    export class Type {
        a: string = 'a...'
        b: number = 123

        constructor() {
            // console.log('type...')
        }
    }
}

var refx: Ref2 = new Ref2

var group: any = { a: 1, b: 2, c: 3 }

var {a, b} = group

var ref1: Ref = new Ref
var ref2: Ref = getRef()

// console.log(ref1.constructor == ref2.constructor)
// console.log(ref1.constructor.toString())
// console.log(ref2.constructor.toString())

import m = name.space

var type1: m.Type = new m.Type()
// type1.d = 123

enum typeis {
    CLASS,
    PROPERTY,
    SETTER,
    ARGUMENT,
    METHOD
}

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
class SampleAnnotationClass extends Annotation {
    a: string
    b: number
    t: typeis
    
    get name(): string {
        return 'SampleAnnotationClass'
    }

    constructor(a: string, b: number, t: typeis) {
        super()
        
        this.a = a
        this.b = b
        this.t = t
    }
    
    toString(): string {
        return `[SampleAnnotationClass name=${this.name} a=${this.a} b=${this.b} t=${this.t}]`
    } 
}

// 실제 SampleAnnotation은 Class 형식이 아니라
// `function(c:Class) { return c }` 의 decorator function 형태를 가진다
function SampleAnnotation(arg: { a: string, b: number, t: typeis }) {
    // return function (c) {
    //    addSampleAnnotation(c, new SampleAnnotationClass(a, b))
    // }
    return function(c, propertyName, descriptor) {
        // console.log('!!!', typeof c, propertyName, descriptor, arg.t)
        console.log('------------------------')
        console.log(propertyName, typeof propertyName)
        console.log(typeof c)
        //console.log(c)
        console.log(c.constructor.name)
        console.log(descriptor)
        return addAnnotation(c, new SampleAnnotationClass(arg.a, arg.b, arg.t), propertyName, descriptor)
    }
}

// AtScript 스펙에 있던 
// Class.properties
// Class.annotate
// Class.parameters
// 등은 삭제가 된듯 하다. (소스에 반영이 안된다)
// 현재 annotations 이외의 모든 스펙을 확인할 수 없다
// 스펙이 어느 정도 축소되었음을 알 수 있다 (아마도 ES5, ES6, Typescript, Dart 모두를 지원하기 위해?)
class ParamClass {
}

module ssen.annotations {
    export class TestAnnotationTemplate {
    }

    export function TestAnnotation():Function {
        return function (target:any):any {
            return addAnnotation(target, new TestAnnotationTemplate())
        } 
    }
}

// 작성된 Annotation function은 이와 같이 사용할 수 있다
@SampleAnnotation({ a: 'class a', b: 123, t: typeis.CLASS })
class Sample {
    constructor(param: ParamClass) {
    }

    @SampleAnnotation({ a: 'prop a', b: 456, t: typeis.PROPERTY })
    prop1: ParamClass

    @SampleAnnotation({ a: 'func a', b: 234, t: typeis.METHOD })
    fun1(): ParamClass {
        return new ParamClass
    }

    fun2(@SampleAnnotation({ a: 'args a', b: 234, t: typeis.ARGUMENT }) arg: ParamClass) {

    }

    @SampleAnnotation({ a: 'setter a', b: 234, t: typeis.SETTER })
    set setter(value: ParamClass) {
    }
}

@ssen.annotations.TestAnnotation()
class Sample2 {

}

console.log('==================================================')
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'prop1'))
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'fun1'))
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'fun2'))
console.log(Object.getOwnPropertyDescriptor(Sample.prototype, 'setter'))















