var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _annotations = require('./dist/ssen/core/annotations');
var TestAnnotation = (function (_super) {
    __extends(TestAnnotation, _super);
    function TestAnnotation() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TestAnnotation.prototype, "name", {
        get: function () { return 'TestAnnotation'; },
        enumerable: true,
        configurable: true
    });
    return TestAnnotation;
})(_annotations.Annotation);
function main() {
    console.log('main');
}
exports.main = main;
