import {Command} from 'commander';

let program = new Command();

program
   .command("foo <num>", "Run foo subcommand")
   // .option('-c, --cheese [type]', 'add cheese [marble]')
   // .arguments("<one> <two> [three] [four]")
   .command("bar feep abc", "Run bar subcommand")
   // .arguments("<one> <two> [three] [four]");


program.parse(process.argv);

console.log('Ran root', process.argv);

/*
console.log('R: ', program.cheese);
console.log('S: ', program.one);
console.log('T: ', program.two);
console.log('V: ', program.three);
console.log('Z: ', program.four);
*/