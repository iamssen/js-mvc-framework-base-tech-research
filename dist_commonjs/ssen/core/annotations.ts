///<reference path="../../lib.d.ts"/>

export enum AnnotationTarget {
	CLASS,
	VARIABLE,
	ACCESSOR,
	METHOD,
	PARAMETER
}

function getAnnotationTarget(target:any, name:any, descriptor:any):AnnotationTarget {
	switch (typeof name) {
		// class
		case 'undefined':
			if (descriptor === undefined) {

				return AnnotationTarget.CLASS
			}
			break
		// property, function, accessor
		case 'string':
			if (descriptor) {
				if (typeof descriptor['set'] === 'function' || typeof descriptor['get'] === 'function') {
					return AnnotationTarget.ACCESSOR
				} else if (typeof descriptor['value'] === 'function') {
					return AnnotationTarget.METHOD
				}
			} else {
				return AnnotationTarget.VARIABLE
			}
			break
		// argument
		case 'number':
			if (typeof target === 'function') {

				return AnnotationTarget.PARAMETER
			}
			break
	}
}

export class Annotation {
	get name():string {
		throw new Error('abstract getter')
	}
}

export class AnnotationMap {
	private list:Annotation[] = []
	private map = {}

	constructor() {
		this.add = this.add.bind(this)
		this.remove = this.remove.bind(this)
		this.has = this.has.bind(this)
		this.all = this.all.bind(this)
		this.get = this.get.bind(this)
	}

	add(annotation:Annotation) {
		var index:number = this.list.push(annotation) - 1
		var Type:any = annotation.constructor
		this.map[Type] = index
	}

	remove(Type:any) {
		delete this.map[Type]
	}

	has(Type:any):boolean {
		return this.map[Type] !== undefined
	}

	all():Annotation[] {
		return this.list.slice()
	}

	get(Type:any):Annotation {
		return this.list[this.map[Type]]
	}
}

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

export function addAnnotation(target:any, annotation:any, name?:any, descriptor?:any) {
	var annotationTarget:AnnotationTarget = getAnnotationTarget(target, name, descriptor)
	var annotations:AnnotationMap = null
	var annotationsGroup:any = null
	var group:any = null

	// console.log('addAnnotation : annotationTarget', annotationTarget)
	switch (annotationTarget) {
		case AnnotationTarget.CLASS:
		case AnnotationTarget.PARAMETER:
			annotations = (target['annotations'] || (target['annotations'] = new AnnotationMap))
			break
		case AnnotationTarget.VARIABLE:
			annotationsGroup = (target['annotations'] || (target['annotations'] = {}))
			group = (annotationsGroup['variables'] || (annotationsGroup['variables'] = {}))
			annotations = (group[name] || (group[name] = new AnnotationMap))
			//console.log('addAnnotation', target[name])
			//delete target[name]
			//console.log('addAnnotation', target[name])
			console.log(target)
			break
		case AnnotationTarget.ACCESSOR:
			annotationsGroup = (target['annotations'] || (target['annotations'] = {}))
			group = (annotationsGroup['accessors'] || (annotationsGroup['accessors'] = {}))
			annotations = (group[name] || (group[name] = new AnnotationMap))

			delete target[name]
			break
		case AnnotationTarget.METHOD:
			annotationsGroup = (target['annotations'] || (target['annotations'] = {}))
			group = (annotationsGroup['methods'] || (annotationsGroup['methods'] = {}))
			annotations = (group[name] || (group[name] = new AnnotationMap))
			break
	}

	annotations.add(annotation)
	return target
}

export class AnnotationUtils {
	static searchType(Type:any) {

	}
}

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









