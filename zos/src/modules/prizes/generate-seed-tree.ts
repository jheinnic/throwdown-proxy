import {sprintf} from "sprintf-js";
import {zip, asapScheduler, from, range, Observable, Subject, asyncScheduler} from 'rxjs';
import {map, mapTo, take, bufferCount, tap, flatMap, observeOn} from "rxjs/operators";
import * as fs from "fs";

const floor = Math.floor;
const ceil  = Math.ceil;
const log2  = Math.log2;

function log2UpperBound(value: number): number
{
   return ceil(
     log2(value));
}

export function generateSeedTree(seedSource: Iterable<Buffer>, ticketCount: number, fileName: string) {
    const bitsPerWrite = 16384;

    const bitsPerLeafRecord = 128;
    const bitsPerLeafBlock = 512;
    const bitsPerLeafWrite = bitsPerWrite;

    const bitsPerInnerDigest = 256;
    const bitsPerInnerWrite = bitsPerWrite;

    const digestsPerInnerWrite = floor(bitsPerInnerWrite / bitsPerInnerDigest);
    const recordsPerLeafWrite = floor(bitsPerLeafWrite / bitsPerLeafRecord);
    const blocksPerLeafWrite = floor(bitsPerLeafWrite / bitsPerLeafBlock);
    const recordsPerBlock = floor(bitsPerLeafBlock / bitsPerLeafRecord);

    console.log(blocksPerLeafWrite, recordsPerBlock);

    // The root node will contain one fewer than |digestsPerWrite| digests, and will account
    // for the top log(2, |digestsPerWrite|) levels of the overall tree.  The second node will
    // accommodate all of the (1 + log(2, |digestsPerWrite|)) layer's digests in exactly one write
    // node.  Every layer from that point will require twice as many write nodes as the one
    // just before it, presuming a full tree.  Incomplete trees will sometimes be able to use
    // fewer write nodes, but they will still copy into the same region of concatenated tree
    // space--there is just no reason to allocate storage for the zero-padding here.

    const digestLevelsPerFullTree = log2UpperBound(ticketCount);
    const digestLevelsPerStorageLevel = log2UpperBound(digestsPerInnerWrite);
    const digestLevelsPerWriteLevel = log2UpperBound(digestsPerInnerWrite);
    // const storageLevelsPerFullTree = ;
    const filesPerDir = digestsPerInnerWrite;
    const recordsPerDir = filesPerDir * recordsPerLeafWrite;
    const leafDirCount = ticketCount / recordsPerDir;
    const directoryDepth = 1 + log2UpperBound(leafDirCount);

    console.log(digestLevelsPerFullTree, digestLevelsPerStorageLevel, digestLevelsPerWriteLevel, directoryDepth);

    // Calculate the offset to begin writing leaf records in order to accommodate the full span of
    // intermediate hash records that will be required for its minimal depth.
    const treeDepth = log2UpperBound(ticketCount);
    const leafOffset = (1 << treeDepth) - 1;
    const firstLeafByte = leafOffset * 256;
    const writeOffsets =
        range(0, ceil(ticketCount/recordsPerLeafWrite) - 1).pipe( //, queueScheduler).pipe(
          map( (value: number) => firstLeafByte + (value * bitsPerLeafRecord * recordsPerLeafWrite))
        );
    const directoryContentCount: Observable<number> =
     range(0, ceil(filesPerDir));
    const directoryCreateCount: Observable<number> =
        range(0, ceil(ticketCount/filesPerDir)).pipe(
          tap((dirIdx: number) => {fs.mkdirSync(`myPool/seedBlocks/${dirIdx}`)}),
          flatMap((dirIdx: number) => directoryContentCount.pipe(mapTo(dirIdx)))
        );
    const computeSeedBits = from(seedSource, asapScheduler)
        .pipe(
          take(ticketCount), bufferCount(recordsPerLeafWrite)
        );

   // const concurrentWrites = 4;
   const toWriteGuard: Subject<string> = new Subject<string>();
   const fromWriteGuard = toWriteGuard.pipe(observeOn(asyncScheduler));

   // Access output file.
    // const openFlags =
    //   fs.constants.O_WRONLY | fs.constants.O_CREAT |
    //   fs.constants.O_NONBLOCK | fs.constants.O_NOATIME;
    // const seedFd = fs.openSync(fileName, openFlags, 400);
    console.log(fileName);

    const retVal = zip(computeSeedBits, directoryCreateCount, writeOffsets, fromWriteGuard).subscribe(
        (input: [Buffer[], number, number, string]) => {
           const buffers = input[0];
           const directoryIndex = input[1];
           const writeOffset = input[2];
           const writeGuardKey = input[3];
           const iterCount = (
             buffers.length < recordsPerLeafWrite
           ) ? buffers.length : recordsPerLeafWrite;

           for (let ii = 0; ii < iterCount; ii++) {
              // fs.writeSync(
              //   seedFd, buffers[ii], 0, bitsPerSeedEntry,
              //   writeOffset + (ii * bitsPerSeedEntry)
              // handleWriteReturn
              // );
              const file = sprintf("./mypool/seedBlocks/%d/block_%08d-%02d.dat", directoryIndex, writeOffset, ii);
              fs.writeFile(file, buffers[ii], {flag: 'w+'}, (err: NodeJS.ErrnoException) => {
                 if (!!err) {
                    console.error(err);
                 }

                 if(ii == 0) {
                    toWriteGuard.next(writeGuardKey);
                 }
              });
              // console.log(buffers[ii].length, writeOffset);
              // fs.writeFileSync(file, buffers[ii], {flag: 'w+'});
           }
        }
    );

    toWriteGuard.next("ThreadOne");
    toWriteGuard.next("ThreadTwo");
    toWriteGuard.next("ThreadThree");
    toWriteGuard.next("ThreadFour");

    return retVal;
}

// function handleWriteReturn( a: any, b: any, c: any ): void {
//    console.log(a, b, c);
// }