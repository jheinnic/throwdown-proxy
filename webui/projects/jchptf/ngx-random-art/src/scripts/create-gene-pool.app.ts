import * as program from 'commander';

program.version('0.0.1')
  .command('resolution create <name>')
  .option('--width <width>')
  .option('--height <width>')
  .option('--shape [shape]', 'fit or fill for rectangular cases.  default=fill', function(value) {
    if (value === 'default') { return 'fill'; }
  }, 'default')
  .option('--fill')
  .option('--prefix <min>,<max>,<salt>')
  .option('--suffix <min>,<max>,<salt>')
  .command('')
  .option('--foci [min],[max]')
  .option('--operations [min],[max]')
  // .action(function(file, options) {
  .parse(process.argv);



