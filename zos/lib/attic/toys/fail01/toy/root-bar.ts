import {Command} from 'commander';

let program = new Command();

program
   .arguments("<one> <two> [three] [four]")
   .command("feep <one>", "Run foo subcommand")
   .arguments("<one> <two> [three] [four]")
   // .option('-c, --cheese [type]', 'add cheese [marble]')
   .command("bar <one>", "Run bar subcommand")
   .arguments("<one> <two> [three] [four]");

program.parse(process.argv);

console.log("Ran bar", process.argv, program.one);
// console.log(program.two);
// console.log(program.three);
// console.log(program.four);
