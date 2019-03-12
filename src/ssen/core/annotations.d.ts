/// <reference path="../../lib.d.ts" />
export declare enum AnnotationTarget {
    CLASS = 0,
    VARIABLE = 1,
    ACCESSOR = 2,
    METHOD = 3,
    PARAMETER = 4,
}
export declare class Annotation {
    name: string;
}
export declare class AnnotationMap {
    private list;
    private map;
    constructor();
    add(annotation: Annotation): void;
    remove(Type: any): void;
    has(Type: any): boolean;
    all(): Annotation[];
    get(Type: any): Annotation;
}
export declare function addAnnotation(target: any, annotation: any, name?: any, descriptor?: any): any;
export declare class AnnotationUtils {
    static searchType(Type: any): void;
}
