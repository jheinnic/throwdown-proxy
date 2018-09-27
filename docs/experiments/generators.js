let a = [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 22, 23, 24, 27, 28, 29, 31, 32, 33, 35, 36, 37, 40, 41, 42, 44, 45, 46, 48, 49, 50]
let b = [4, 8, 12, 17, 21, 25, 30, 34, 38, 43, 47, 51]
let c = [13, 26, 39, 52]

const makeIter = function*(seq, width, parent) {
    while (seq.length > 0) {
        yield parent.next().value;
        yield parent.next().value;
        yield parent.next().value;
        yield seq.shift();
    }
}

const makeTerm = function*(seq) {
    while( seq.length > 0) {
        yield seq.shift();
    }
}

aa = makeTerm(a);
bb = makeIter(b, 3, aa);
cc = makeIter(c, 3, bb);

for (ii of cc) {
   console.log(ii);
}

let a = [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 22, 23, 24, 27, 28, 29, 31, 32, 33, 35, 36, 37, 40, 41, 42, 44, 45, 46, 48, 49, 50]
let b = [4, 8, 12, 17, 21, 25, 30, 34, 38, 43, 47, 51]
let c = [13, 26, 39, 52]

function Foo(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.width = 3;

    return this;
}

Foo.prototype.runC = function* () {
    while( this.c.length > 0 ) {
        for (let ii=0; ii<this.width; ii++) {
            yield* this.runB();
        }
        yield this.c.shift();
    }
}


Foo.prototype.runB = function* () {
    const nextB = this.b.splice(0, 3);
    while( nextB.length > 0 ) {
        for (let ii=0; ii<this.width; ii++) {
            yield* this.runA();
        }
        yield nextB.shift();
    }
}

Foo.prototype.runA = function* () {
    if( this.a.length > 0 ) {
        yield this.a.shift();
    }
}

Foo.prototype[Symbol.iterator] = function() {
    return this.runC();
}

const foo = new Foo(a, b, c);
for (ii of foo) {
    console.log(ii);
}

