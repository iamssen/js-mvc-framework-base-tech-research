///<reference path="../../lib.d.ts"/>

// @formatter:off
import {addAnnotation, Annotation, AnnotationMap} from '../core/annotations'
// @formatter:on

export interface IInjector {
	createChildInjector():IInjector
	getInstance(Type:any):Object
	hasMapping(Type:any):boolean
	injectInto(obj:Object)
	mapClass(Type:any, Implementation?:any)
	mapSingleton(Type:any, Implementation?:any)
	mapValue(Type:any, usingValue:Object)
	mapFactory(Type:any, FactoryClass:any)
	unmap(Type:any)
}

//==========================================================================================
// util classes
//==========================================================================================
class InstanceFactoryMap {
	// {[key:Type]:InstanceFactory}
	map:Object = {}

	constructor() {
		this.setFactory = this.setFactory.bind(this)
		this.unsetFactory = this.unsetFactory.bind(this)
	}

	setFactory(Type:any, factory:InstanceFactory) {
		this.map[Type] = factory
	}

	unsetFactory(Type:any) {
		if (this.map[Type] != undefined) {
			delete this.map[Type]
		}
	}

	getFactory(Type:any):InstanceFactory {
		return this.map[Type]
	}

	hasFactory(Type:any):boolean {
		return this.map[Type] != undefined
	}
}

class TypeMap {
	// {[type:Class]:InjectionTarget[]}
	private types:any = {}

	// {[type:Class]:string}
	private havePostConstructor:any = {}

	constructor() {
		this.has = this.has.bind(this)
		this.map = this.map.bind(this)
		this.getInjectionTargets = this.getInjectionTargets.bind(this)
		this.mapProperty = this.mapProperty.bind(this)
		this.getPostConstruct = this.getPostConstruct.bind(this)
	}

	public has(source:any):boolean {
		var Type:any = (typeof source == 'function') ? source : source.constructor
		return this.types[Type] != undefined
	}

	private mapProperty(injectionTargets:InjectionTarget[], name:string, inject:$Inject) {
		var injectionTarget:Property = new Property
		injectionTarget.propertyName = name
		injectionTarget.Type = inject.Type

		injectionTargets.push(injectionTarget)
	}

	public map(target:any) {
		var Type:any = (typeof target == 'function') ? target : target.constructor

		if (this.types[Type] || !Type.prototype['annotations']) {
			return
		}

		var variables:{[name:string]:AnnotationMap} = Type.prototype['annotations']['variables']
		var accessors:{[name:string]:AnnotationMap} = Type.prototype['annotations']['accessors']

		var injectionTargets:InjectionTarget[] = []
		var map:AnnotationMap
		var propertyInjectionTarget:Property
		var inject:$Inject

		if (variables) {
			for (var name in variables) {
				map = variables[name]

				if (!map.has($Inject)) continue
				inject = <$Inject> map.get($Inject)
				if (!inject) continue

				this.mapProperty(injectionTargets, name, inject)
			}
		}

		if (accessors) {
			for (var name in accessors) {
				map = accessors[name]

				if (!map.has($Inject)) continue
				inject = <$Inject> map.get($Inject)
				if (!inject) continue

				this.mapProperty(injectionTargets, name, inject)
			}
		}

		this.types[Type] = injectionTargets
	}

	public getInjectionTargets(instance:Object):InjectionTarget[] {
		var Type:any = (typeof instance == 'function') ? instance : instance.constructor
		var targets:InjectionTarget[] = this.types[Type]
		return (targets) ? targets : []
	}

	public getPostConstruct(instance:Object):string {
		var Type:any = instance.constructor
		return this.havePostConstructor[Type]
	}
}

//==========================================================================================
// Annotations
//==========================================================================================
export class $Inject extends Annotation {
	constructor(public Type:any) {
		super()
	}
}

export function Inject(Type:any) {
	return function (target, name?:any, descriptor?:any) {
		var inject:$Inject = new $Inject(Type)
		return addAnnotation(target, inject, name, descriptor)
	}
}

export class $PostConstruct extends Annotation {
}

export function PostConstruct() {
	return function (target, name?:any, descriptor?:any) {
		return addAnnotation(target, new $PostConstruct(), name, descriptor)
	}
}

//==========================================================================================
// Injector
//==========================================================================================
export class Injector implements IInjector {
	private static typemap:TypeMap = new TypeMap

	private factoryMap:InstanceFactoryMap = new InstanceFactoryMap
	private parent:Injector

	constructor() {
		this.createChildInjector = this.createChildInjector.bind(this)
		this.setParent = this.setParent.bind(this)
		this.getInstance = this.getInstance.bind(this)
		this.hasMapping = this.hasMapping.bind(this)
		this.injectInto = this.injectInto.bind(this)
		this.mapClass = this.mapClass.bind(this)
		this.mapSingleton = this.mapSingleton.bind(this)
		this.mapValue = this.mapValue.bind(this)
		this.mapFactory = this.mapFactory.bind(this)
		this.unmap = this.unmap.bind(this)
	}

	createChildInjector():IInjector {
		var child:Injector = new Injector
		child.parent = this
		return child
	}

	setParent(parent:Injector) {
		this.parent = parent
	}

	getInstance(Type:any):Object {
		var injector:Injector = this

		while (true) {
			if (injector.factoryMap.hasFactory(Type)) {
				var instance:Object = injector.factoryMap.getFactory(Type).getInstance()
				//console.log('getInstance case1', instance)
				return instance
			} else if (injector.parent) {
				//console.log('getInstance case2')
				injector = injector.parent
				continue
			} else {
				//console.log('getInstance case3')
				return undefined
			}
		}

		return undefined
	}

	hasMapping(Type:any):boolean {
		var injector:Injector = this

		while (true) {
			if (injector.factoryMap.hasFactory(Type)) {
				return true
			} else if (injector.parent) {
				injector = injector.parent
				continue
			} else {
				return false
			}
		}

		return false
	}

	injectInto(obj:Object) {
		if (!Injector.typemap.has(obj)) {
			Injector.typemap.map(obj)
		}

		var injectionTargets:InjectionTarget[] = Injector.typemap.getInjectionTargets(obj)

		//console.log(obj.toString(), injectionTargets)

		injectionTargets.forEach(function (injectionTarget:InjectionTarget) {
			injectionTarget.mapping(obj, this)
		}.bind(this))

		var postConstructor:string = Injector.typemap.getPostConstruct(obj)
		if (typeof postConstructor == 'function') {
			obj[postConstructor]()
		}
	}

	mapClass(Type:any, Implementation?:any) {
		if (!Implementation) {
			Implementation = Type
		}

		var instantiate:Instantiate = new Instantiate
		instantiate.injector = this
		instantiate.Type = Implementation

		this.factoryMap.setFactory(Type, instantiate)
	}

	mapSingleton(Type:any, Implementation?:any) {
		if (!Implementation) {
			Implementation = Type
		}

		var singleton:Singleton = new Singleton
		singleton.injector = this
		singleton.Type = Implementation

		this.factoryMap.setFactory(Type, singleton)
	}

	mapValue(Type:any, usingValue:Object) {

	}

	mapFactory(Type:any, FactoryClass:any) {

	}

	unmap(Type:any) {
		this.factoryMap.unsetFactory(Type)
	}
}

//==========================================================================================
// injection targets
//==========================================================================================
interface InjectionTarget {
	mapping(instance:Object, injector:Injector)
}

class Property implements InjectionTarget {
	public propertyName:string
	public Type:any

	constructor() {
		this.mapping = this.mapping.bind(this)
	}

	public mapping(instance:Object, injector:Injector) {
		var dependency:Object = injector.getInstance(this.Type)
		instance[this.propertyName] = dependency
		//console.log('Property.mapping', instance.toString(), this.propertyName, instance.hasOwnProperty(this.propertyName))
	}
}


//==========================================================================================
// instance factories
//==========================================================================================
interface InstanceFactory {
	getInstance():Object
}

class Factory implements InstanceFactory {
	public injector:Injector
	public FactoryClass:any

	constructor() {
		this.getInstance = this.getInstance.bind(this)
	}

	public getInstance():Object {
		var factory:any = new this.FactoryClass
		this.injector.injectInto(factory)

		var instance:Object = factory.newInstance()
		this.injector.injectInto(instance)

		return instance
	}
}

class Instantiate implements InstanceFactory {
	public injector:Injector
	public Type:any

	constructor() {
		this.getInstance = this.getInstance.bind(this)
	}

	public getInstance():Object {
		var instance:Object = new this.Type
		this.injector.injectInto(instance)

		return instance
	}
}

class Singleton implements InstanceFactory {
	public injector:Injector
	public Type:any

	private instance:Object

	constructor() {
		this.getInstance = this.getInstance.bind(this)
	}

	public getInstance():Object {
		if (!this.instance) {
			this.instance = new this.Type
			this.injector.injectInto(this.instance)
		}

		return this.instance
	}
}

class Value implements InstanceFactory {
	public instance:Object

	constructor() {
		this.getInstance = this.getInstance.bind(this)
	}

	public getInstance():Object {
		return this.instance
	}
}


