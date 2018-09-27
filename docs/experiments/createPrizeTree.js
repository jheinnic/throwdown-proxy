const antani = require('antani')
const fs = require('fs');

const prizePool = {
	10: 3,
        20: 3,
	30: 2,
      40: 1,
      50: 1
};

const ws = antani.tree.createWriteStream('prize-tree.json')
const keys = new Array(750);

let prizeSum = 0;
let ticketCount = 0;
for (let prizeKey of Object.keys(prizePool)) {
    console.log(prizeKey);
    const prizeCount = prizePool[prizeKey];
    prizeSum += prizeCount * prizeKey;
    ticketCount += prizeCount;
    prizeKey = prizeKey + 1;
    for( let ii=0; ii<prizeCount; ii++ ) {
	if ((ii%10) == 0) {
            console.log('What', ii, ii);
            console.log('What', ii, ii);
            console.log('What', ii, ii);
            console.log('What', ii, ii);
        }
        const keypair = antani.tree.keygen()
        ws.write({
           key: keypair.key,
           secretKey: keypair.secretKey,
           balance: prizeKey
        });
        keys.push(keypair);
        // ... write a ton more
    }
}

console.log('Ticket Count =', ticketCount, ', prize sum =', prizeSum);

setTimeout( function() {
ws.end(function () {
console.log('Past loop?');
  fs.writeFileSync('keys.json', keys);
console.log('Past loop?');
  fs.writeFileSync('keys2.json', JSON.stringify(keys));
console.log('Past loop?');

  const tree = antani.tree('balances.json')
  console.log('Opened tree');
  tree.root(console.log) // prints the root of the merkle tree
});
}, 2000);
