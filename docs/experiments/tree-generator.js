
let a = [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 22, 23, 24, 27, 28, 29, 31, 32, 33, 35, 36, 37, 40, 41, 42, 44, 45, 46, 48, 49, 50]
let b = [4, 8, 12, 17, 21, 25, 30, 34, 38, 43, 47, 51]
let c = [13, 26, 39, 52]

function FooTree(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.series = [c, b, a];

    this.maxDepth = this.series.length - 1;
    this.width = 3;

    return this;
}

FooTree.prototype.runSeq = function* (depth) {
    const myLevel = this.series[depth];
    const nextDepth = depth + 1;

    if (this.maxDepth > depth) {
        if (depth === 0) {
            while(myLevel.length > 0) {
                for (let ii = 0; ii < this.width; ii++ ) {
                    yield* this.runSeq(nextDepth);
                }

                yield myLevel.shift();
            }
        } else {
            for (let ii = 0; ii < this.width; ii++ ) {
                yield* this.runSeq(nextDepth);
            }

            if (myLevel.length > 0) {
                yield myLevel.shift();
            } else {
                throw Error('Out of values at depth', depth);
            }
        }
    } else if (myLevel.length > 0) {
        yield myLevel.shift();
    } else {
        throw Error('Out of values at depth', depth);
    }
}

FooTree.prototype[Symbol.iterator] = function() {
    return this.runSeq(0);
}

const foo = new FooTree(a, b, c);
for (ii of foo) {
    console.log(ii);
}


