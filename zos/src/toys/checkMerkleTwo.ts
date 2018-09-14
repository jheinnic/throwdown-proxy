import {BitOutputStream} from "@thi.ng/bitstream";
import * as merkleLib from "merkle-lib";
import * as readline from "readline";
import {SHA256Compress} from "./SHA256Compress";

const merkle =  merkleLib.default;

let inputs: string[] = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  if (line && (line.length > 0)) {
     inputs.push(
         parse(line)
     );
  } else {
     buildPrintTree(inputs);
  }
});

function buildPrintTree(data: Buffer[]) {
   var tree = merkle(data, SHA256Compress);
   console.log(tree.map(x => x.toString('hex')))
}

function parse(bits: string): Buffer {
    const writer: BitOutputStream = new BitOutputStream();

    bits.split('').forEach( (bit: string) => {
        if (bit === '1') {
            writer.writeBit(1);
        } else {
            writer.writeBit(0);
        }
    });

    return Buffer.from(writer.bytes());
}
