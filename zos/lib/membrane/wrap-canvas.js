var Canvas = require('canvas').Canvas;
var makeMembrane = require('./revoke').makeMembrane;
var fs = require('fs');

var wetCvs = new Canvas(120, 120);
var membrane = makeMembrane(wetCvs);
var dryCvs = membrane.target;

var dryCtxt = dryCvs.getContext('2d');
dryCtxt.fillStyle = 'rgb(255, 0, 10)';
dryCtxt.fillRect(20, 70, 10, 10);
console.log(wetCvs.toDataURL());

membrane.revoke();

var dryCtxt = dryCvs.getContext('2d');
dryCtxt.fillStyle = 'rgb(50, 128, 128)';
dryCtxt.fillRect(70, 20, 10, 10);
console.log(wetCvs.toDataURL());

// var filePath = './temp.png';
// taskContext = { canvas: 1 };
//
// try {
//    const out = fs.createWriteStream(filePath);
//    const stream = wetCvs.createPNGStream();
//    return new Promise((resolve, reject) => {
//       out.on('end', () => {
//          console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
//          resolve(wetCvs);
//       });
//
//       stream.on('error', function (err) {
//          console.error('Brap!', err);
//          reject(err);
//          out.close();
//       });
//
//       stream.pipe(out);
//    });
// } catch (err) {
//    return Promise.reject(
//      new Error(`I/O error while attempting to output to ${filePath}: ${err}`)
//    );
// }
