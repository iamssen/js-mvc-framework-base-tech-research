/// <reference path="../../lib.d.ts" />
import { Annotation } from '../core/annotations';
export interface IInjector {
    createChildInjector(): IInjector;
    getInstance(Type: any): Object;
    hasMapping(Type: any): boolean;
    injectInto(obj: Object): any;
    mapClass(Type: any, Implementation?: any): any;
    mapSingleton(Type: any, Implementation?: any): any;
    mapValue(Type: any, usingValue: Object): any;
    mapFactory(Type: any, FactoryClass: any): any;
    unmap(Type: any): any;
}
export declare class $Inject extends Annotation {
    Type: any;
    constructor(Type: any);
}
export declare function Inject(Type: any): (target: any, name?: any, descriptor?: any) => any;
export declare class $PostConstruct extends Annotation {
}
export declare function PostConstruct(): (target: any, name?: any, descriptor?: any) => any;
export declare class Injector implements IInjector {
    private static typemap;
    private factoryMap;
    private parent;
    constructor();
    createChildInjector(): IInjector;
    setParent(parent: Injector): void;
    getInstance(Type: any): Object;
    hasMapping(Type: any): boolean;
    injectInto(obj: Object): void;
    mapClass(Type: any, Implementation?: any): void;
    mapSingleton(Type: any, Implementation?: any): void;
    mapValue(Type: any, usingValue: Object): void;
    mapFactory(Type: any, FactoryClass: any): void;
    unmap(Type: any): void;
}
