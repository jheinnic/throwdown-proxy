"use strict";
exports.__esModule = true;
var program = require("commander");
var parsed = program.version('0.0.1')
    .command('resolution <name>')
    .option('--width <width>')
    .option('--height <width>')
    .option('--shape [shape]', 'fit or fill for rectangular cases.  default=fill', function (value) {
    if (value === 'default') {
        return 'fill';
    }
}, 'default')
    .action(function(name, options) {
      console.log(name, options);
    })
    .command('byteseq <name>')
    .option('--prefix <min>,<max>,<salt>')
    .option('--suffix <min>,<max>,<salt>')
    .command('generator <name>')
    .option('--foci [min],[max]')
    .option('--operations [min],[max]')
    .action(function(name, options) {
      console.log(name, options);
    })
    .command('pool <name>')
    .option('--resolution <name>')
    .option('--byteseq <name>')
    .option('--generator <name>')
    .action(function(name, options) {
      console.log(name, options);
    })
    .command('publish')
    .action(function(name, options) {
      console.log(name, options);
    })
    .parse(process.argv);

console.log(parsed);
