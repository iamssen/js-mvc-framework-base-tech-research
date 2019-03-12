///<reference path="../../lib.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// @formatter:off
var _annotations = require('../core/annotations');
//==========================================================================================
// util classes
//==========================================================================================
var InstanceFactoryMap = (function () {
    function InstanceFactoryMap() {
        // {[key:Type]:InstanceFactory}
        this.map = {};
        this.setFactory = this.setFactory.bind(this);
        this.unsetFactory = this.unsetFactory.bind(this);
    }
    InstanceFactoryMap.prototype.setFactory = function (Type, factory) {
        this.map[Type] = factory;
    };
    InstanceFactoryMap.prototype.unsetFactory = function (Type) {
        if (this.map[Type] != undefined) {
            delete this.map[Type];
        }
    };
    InstanceFactoryMap.prototype.getFactory = function (Type) {
        return this.map[Type];
    };
    InstanceFactoryMap.prototype.hasFactory = function (Type) {
        return this.map[Type] != undefined;
    };
    return InstanceFactoryMap;
})();
var TypeMap = (function () {
    function TypeMap() {
        // {[type:Class]:InjectionTarget[]}
        this.types = {};
        // {[type:Class]:string}
        this.havePostConstructor = {};
        this.has = this.has.bind(this);
        this.map = this.map.bind(this);
        this.getInjectionTargets = this.getInjectionTargets.bind(this);
        this.mapProperty = this.mapProperty.bind(this);
        this.getPostConstruct = this.getPostConstruct.bind(this);
    }
    TypeMap.prototype.has = function (source) {
        var Type = (typeof source == 'function') ? source : source.constructor;
        return this.types[Type] != undefined;
    };
    TypeMap.prototype.mapProperty = function (injectionTargets, name, inject) {
        var injectionTarget = new Property;
        injectionTarget.propertyName = name;
        injectionTarget.Type = inject.Type;
        injectionTargets.push(injectionTarget);
    };
    TypeMap.prototype.map = function (target) {
        var Type = (typeof target == 'function') ? target : target.constructor;
        if (this.types[Type] || !Type.prototype['annotations']) {
            return;
        }
        var variables = Type.prototype['annotations']['variables'];
        var accessors = Type.prototype['annotations']['accessors'];
        var injectionTargets = [];
        var map;
        var propertyInjectionTarget;
        var inject;
        if (variables) {
            for (var name in variables) {
                map = variables[name];
                if (!map.has($Inject))
                    continue;
                inject = map.get($Inject);
                if (!inject)
                    continue;
                this.mapProperty(injectionTargets, name, inject);
            }
        }
        if (accessors) {
            for (var name in accessors) {
                map = accessors[name];
                if (!map.has($Inject))
                    continue;
                inject = map.get($Inject);
                if (!inject)
                    continue;
                this.mapProperty(injectionTargets, name, inject);
            }
        }
        this.types[Type] = injectionTargets;
    };
    TypeMap.prototype.getInjectionTargets = function (instance) {
        var Type = (typeof instance == 'function') ? instance : instance.constructor;
        var targets = this.types[Type];
        return (targets) ? targets : [];
    };
    TypeMap.prototype.getPostConstruct = function (instance) {
        var Type = instance.constructor;
        return this.havePostConstructor[Type];
    };
    return TypeMap;
})();
//==========================================================================================
// Annotations
//==========================================================================================
var $Inject = (function (_super) {
    __extends($Inject, _super);
    function $Inject(Type) {
        _super.call(this);
        this.Type = Type;
    }
    return $Inject;
})(_annotations.Annotation);
exports.$Inject = $Inject;
function Inject(Type) {
    return function (target, name, descriptor) {
        var inject = new $Inject(Type);
        return _annotations.addAnnotation(target, inject, name, descriptor);
    };
}
exports.Inject = Inject;
var $PostConstruct = (function (_super) {
    __extends($PostConstruct, _super);
    function $PostConstruct() {
        _super.apply(this, arguments);
    }
    return $PostConstruct;
})(_annotations.Annotation);
exports.$PostConstruct = $PostConstruct;
function PostConstruct() {
    return function (target, name, descriptor) {
        return _annotations.addAnnotation(target, new $PostConstruct(), name, descriptor);
    };
}
exports.PostConstruct = PostConstruct;
//==========================================================================================
// Injector
//==========================================================================================
var Injector = (function () {
    function Injector() {
        this.factoryMap = new InstanceFactoryMap;
        this.createChildInjector = this.createChildInjector.bind(this);
        this.setParent = this.setParent.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.hasMapping = this.hasMapping.bind(this);
        this.injectInto = this.injectInto.bind(this);
        this.mapClass = this.mapClass.bind(this);
        this.mapSingleton = this.mapSingleton.bind(this);
        this.mapValue = this.mapValue.bind(this);
        this.mapFactory = this.mapFactory.bind(this);
        this.unmap = this.unmap.bind(this);
    }
    Injector.prototype.createChildInjector = function () {
        var child = new Injector;
        child.parent = this;
        return child;
    };
    Injector.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    Injector.prototype.getInstance = function (Type) {
        var injector = this;
        while (true) {
            if (injector.factoryMap.hasFactory(Type)) {
                var instance = injector.factoryMap.getFactory(Type).getInstance();
                //console.log('getInstance case1', instance)
                return instance;
            }
            else if (injector.parent) {
                //console.log('getInstance case2')
                injector = injector.parent;
                continue;
            }
            else {
                //console.log('getInstance case3')
                return undefined;
            }
        }
        return undefined;
    };
    Injector.prototype.hasMapping = function (Type) {
        var injector = this;
        while (true) {
            if (injector.factoryMap.hasFactory(Type)) {
                return true;
            }
            else if (injector.parent) {
                injector = injector.parent;
                continue;
            }
            else {
                return false;
            }
        }
        return false;
    };
    Injector.prototype.injectInto = function (obj) {
        if (!Injector.typemap.has(obj)) {
            Injector.typemap.map(obj);
        }
        var injectionTargets = Injector.typemap.getInjectionTargets(obj);
        //console.log(obj.toString(), injectionTargets)
        injectionTargets.forEach(function (injectionTarget) {
            injectionTarget.mapping(obj, this);
        }.bind(this));
        var postConstructor = Injector.typemap.getPostConstruct(obj);
        if (typeof postConstructor == 'function') {
            obj[postConstructor]();
        }
    };
    Injector.prototype.mapClass = function (Type, Implementation) {
        if (!Implementation) {
            Implementation = Type;
        }
        var instantiate = new Instantiate;
        instantiate.injector = this;
        instantiate.Type = Implementation;
        this.factoryMap.setFactory(Type, instantiate);
    };
    Injector.prototype.mapSingleton = function (Type, Implementation) {
        if (!Implementation) {
            Implementation = Type;
        }
        var singleton = new Singleton;
        singleton.injector = this;
        singleton.Type = Implementation;
        this.factoryMap.setFactory(Type, singleton);
    };
    Injector.prototype.mapValue = function (Type, usingValue) {
    };
    Injector.prototype.mapFactory = function (Type, FactoryClass) {
    };
    Injector.prototype.unmap = function (Type) {
        this.factoryMap.unsetFactory(Type);
    };
    Injector.typemap = new TypeMap;
    return Injector;
})();
exports.Injector = Injector;
var Property = (function () {
    function Property() {
        this.mapping = this.mapping.bind(this);
    }
    Property.prototype.mapping = function (instance, injector) {
        var dependency = injector.getInstance(this.Type);
        instance[this.propertyName] = dependency;
        //console.log('Property.mapping', instance.toString(), this.propertyName, instance.hasOwnProperty(this.propertyName))
    };
    return Property;
})();
var Factory = (function () {
    function Factory() {
        this.getInstance = this.getInstance.bind(this);
    }
    Factory.prototype.getInstance = function () {
        var factory = new this.FactoryClass;
        this.injector.injectInto(factory);
        var instance = factory.newInstance();
        this.injector.injectInto(instance);
        return instance;
    };
    return Factory;
})();
var Instantiate = (function () {
    function Instantiate() {
        this.getInstance = this.getInstance.bind(this);
    }
    Instantiate.prototype.getInstance = function () {
        var instance = new this.Type;
        this.injector.injectInto(instance);
        return instance;
    };
    return Instantiate;
})();
var Singleton = (function () {
    function Singleton() {
        this.getInstance = this.getInstance.bind(this);
    }
    Singleton.prototype.getInstance = function () {
        if (!this.instance) {
            this.instance = new this.Type;
            this.injector.injectInto(this.instance);
        }
        return this.instance;
    };
    return Singleton;
})();
var Value = (function () {
    function Value() {
        this.getInstance = this.getInstance.bind(this);
    }
    Value.prototype.getInstance = function () {
        return this.instance;
    };
    return Value;
})();
//# sourceMappingURL=di.js.map