class Test {
    message = 'hello world'

    constructor() {
        this.func = this.func.bind(this)
    }

    func() {
        console.log(this.message)
    }
}

var test:Test = new Test

setTimeout(test.func, 100)