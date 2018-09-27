
let a = [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 22, 23, 24, 27, 28, 29, 31, 32, 33, 35, 36, 37, 40, 41, 42, 44, 45, 46, 48, 49, 50]
let b = [4, 8, 12, 17, 21, 25, 30, 34, 38, 43, 47, 51]
let c = [13, 26, 39, 52]

function FooTree(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.series = [a, b, c];

    this.width = 3;

    return this;
}

FooTree.prototype.runSeq = function* (levels, isRoot) {
    const myLevel = levels.shift(levels);
    console.log('Recursion:', isRoot, myLevel, levels);

    if (levels.length > 0) {
	if (! isRoot) {
            for (let ii = 0; ii < this.width; ii++ ) {
                yield* this.runSeq(levels, false);
	    }

	    yield myLevel.shift();
        } else {
	    while(myLevel.length > 0) {
                for (let ii = 0; ii < this.width; ii++ ) {
                    yield* this.runSeq(levels, false);
	        }

	        yield myLevel.shift();
            }
	}
    } else if (myLevel.length > 0) {
        yield myLevel.shift();
    } else {
        throw Error('Unexpected call with one empty level to runSeq()');
    }
}

FooTree.prototype[Symbol.iterator] = function() {
    return this.runSeq(this.series, true);
}

const foo = new FooTree(a, b, c);
for (ii of foo) {
    console.log(ii);
}

