import {Annotation, addAnnotation} from './dist/ssen/core/annotations'

class TestAnnotation extends Annotation {
    get name() : string { return 'TestAnnotation' }
}

export function main() {
    console.log('main')
}