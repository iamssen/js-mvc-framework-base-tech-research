var Test = (function () {
    function Test() {
        this.message = 'hello world';
        this.func = this.func.bind(this);
    }
    Test.prototype.func = function () {
        console.log(this.message);
    };
    return Test;
})();
var test = new Test;
setTimeout(test.func, 100);
//# sourceMappingURL=learn-bind.js.map