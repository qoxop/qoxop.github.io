const {observable, autorun} = require('mobx')

const obj = observable({ a: 0, b: 1, o: { c:2 }})

autorun(() => {
    if (obj.o) {
        console.log(obj.o.c)
    }
})
obj.o.d = {a: 3}

autorun(() => {
    console.log(obj.o.d.a)
})
obj.o.d.a = 99