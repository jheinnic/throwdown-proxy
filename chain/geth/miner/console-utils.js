function ula() {
    personal.listAccounts.forEach( function (acct) {
        personal.unlockAccount(acct, 'abcd1234');
    });
    setTimeout( ula, 22500 );
}

var traceHolder = {
    trace: undefined
};

function getTrace(err, data) {
    if (!! err) { 
        console.error(err);
    } else {
        traceHolder.trace = data;
        console.log(data.failed);
    }
}

function traceTx(txHashId) {
    debug.traceTransaction(txHashId, getTrace);
}

var utils = {
    ula: ula,
    traceHolder: traceHolder,
    getTrace: getTrace,
    traceTx: traceTx
};
