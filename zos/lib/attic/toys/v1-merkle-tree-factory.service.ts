import {asapScheduler, asyncScheduler, from, Observable, range, Subject, zip} from 'rxjs';
import {bufferCount, map, mapTo, flatMap, observeOn, take, tap} from 'rxjs/operators';
import * as fs from "fs";
import {sprintf} from 'sprintf-js';
import {UniqueValueSource} from '../../../src/infrastructure/randomize/sources/unique-value-source';

export class V1MerkleTreeFactory
{
   generateSeedTree(seedSource: UniqueValueSource, recordCount: number, fileName: string)
   {
      const log2UpperBound = function log2UpperBound(value: number): number
      {
         return Math.ceil(
           Math.log2(value));
      };
      const log2LowerBound = function log2LowerBound(value: number): number
      {
         return Math.floor(
           Math.log2(value));
      };

      // Definitions for terms with a length that is measured in bits:
      // -- A "write" is a unit of sequential file I/O.  Currently, the same I/O unit size is used for
      //    both
      // -- A "record" is a collection of values that define an entity we wish to prove zero-knowledge
      //    SNARKs regarding its entity's presence in a Merkle Digest Tree created for some set of
      //    entities (using their associated records).
      // -- A "block" is a fixed size collection of "records" that are grouped such that creating a proof
      //    requires use of information from every record in a "block".  To use information from a record
      //    is to supply its value to or derive its value from public or private inputs to proof
      //    constructor's inputs.
      const bitsPerBuffer = 8192;
      const bitsPerDigest = 256;
      const bitsPerRecord = 128;
      // const recordsPerBlock = 4;

      // Define two trees:
      // 1) Let a digest tree consist of inner and leaf digest nodes of a complete merkle tree.  This
      //    tree does not contain the leaf layer of blocks that hash to the leaf layer of digests, but it
      //    does include the leaf layer of digests.
      // 2) Let a digest storage tree be a projection from a given digest tree.  To define the projection,
      // first select a value for "subtree height" such that subtree height is less than the depth of the
      // mapped digest tree.  Map every digest tree node at a depth that is an even multiple of chosen
      // "subtree height" to a distinct storage digest tree node.  Let each digest storage tree node
      // represent the subtree of "subtree height" depth rooted at its mapped digest tree node, and let
      // its children be the digest storage tree nodes that map to the children of the bottom "leaf" layer
      // of each such subtree.
      //
      // Observe the formula for {maxDigestsPerStorageNode} and {maxDigestLevelsPerStorageLevel}.
      //
      // Root digest storage node will contain {maxDigestsPerStorageNode - 1} digests, accounting for top
      // {maxDigestLevelsPerStorageLevel} levels of projected digest tree.  Each non-leaf digest
      // storage node, including root, will have {|maxDigestsPerStorageNode|} children, each of which will
      // accommodate a subtree of
      // accommodate all of the (1 + log(2, |maxDigestsPerStorageNode|)) layer's digests in exactly one
      // node.  Every layer from that point will require twice as many write nodes as the one
      // just before it, presuming a full tree.  Incomplete trees will sometimes be able to use
      // fewer write nodes, but they will still copy into the same region of concatenated tree
      // space--there is just no reason to allocate storage for the zero-padding here.

      const maxDigestsPerStorageNode = Math.floor(bitsPerBuffer / bitsPerDigest);
      const maxDigestLevelsPerStorageLevel = log2LowerBound(maxDigestsPerStorageNode + 1);
      // const digestLevelsPerDigestTree = log2UpperBound(recordCount) + 1;

      const digestLevelsPerFullStorageLevel = maxDigestLevelsPerStorageLevel;
      // const digestLevelsPerPartialStorageLevel = digestLevelsPerDigestTree % maxDigestLevelsPerStorageLevel;
      // const fullStorageLevelsPerStorageTree = digestLevelsPerDigestTree / maxDigestLevelsPerStorageLevel;
      // const partialStorageLevelsPerStorageTree = (digestLevelsPerPartialStorageLevel > 0) ? 1 : 0;

      // const digestsPerPartialSubtree = Math.pow(2, digestLevelsPerPartialStorageLevel) - 1;
      // const subtreesPerPartialStorageNode = maxDigestsPerStorageNode / digestsPerPartialSubtree;
      // const digestsPerPartialStorageNode = digestsPerPartialSubtree * subtreesPerPartialStorageNode;
      // const bitsPerPartialStorageNode = bitsPerDigest * digestsPerPartialStorageNode;

      // Digest subtree mapped to a full storage node has a depth of {digestLevelsPerFullStorageLevel}.
      // There are therefore {Math.pow(2, digestLevelsPerFullStorageLevel) - 1} digests in that
      // mapped digest node's subtree, and {Math.pow(2, (digestLevelsPerFullStorageLayer - 1))} of these
      // are at deepest layer of mapped subtree.  Each of those deepest nodes may have 2 children, so the
      // number of children for any full storage node is {Math.pow(2, digestLevelsPerFullStorageLayer)}.
      //
      // Above holds true regardless of whether children of a full storage node are full storage nodes
      // as well or are from partial storage layer.
      // const digestsPerFullStorageNode = Math.pow(2, digestLevelsPerFullStorageLevel) - 1;
      const childrenPerFullStorageNode = Math.pow(2, digestLevelsPerFullStorageLevel);
      // const bitsPerFullStorageNode = bitsPerDigest * digestsPerFullStorageNode;

      // const recordsPerDir = filesPerDir * recordsPerLeafBuffer;
      // const leafDirCount = recordCount / recordsPerDir;
      // const directoryDepth = 1 + log2UpperBound(leafDirCount);

      // const bitsPerBlock = bitsPerRecord * recordsPerBlock;
      const recordsPerBuffer = Math.floor(bitsPerBuffer / bitsPerRecord);
      // const blocksPerBuffer = Math.floor(recordsPerBuffer / recordsPerBlock);

      // Calculate the offset to begin writing leaf records in order to accommodate full span of
      // intermediate hash records that will be required for its minimal depth.
      const treeDepth = log2UpperBound(recordCount);
      const leafOffset = (
        1 << treeDepth
      ) - 1;

      const firstLeafByte = leafOffset * 256;
      const writeOffsets =
        range(0, Math.ceil(recordCount / recordsPerBuffer) - 1)
          .pipe( //, queueScheduler).pipe(
            map((value: number) => firstLeafByte + (
              value * bitsPerRecord * recordsPerBuffer
            ))
          );
      const directoryContentCount: Observable<number> =
        range(0, Math.ceil(childrenPerFullStorageNode));
      const directoryCreateCount: Observable<number> =
        range(0, Math.ceil(recordCount / childrenPerFullStorageNode))
          .pipe(
            tap((dirIdx: number) => {fs.mkdirSync(`myPool/seedBlocks/${dirIdx}`)}),
            flatMap((dirIdx: number) => directoryContentCount.pipe(mapTo(dirIdx)))
          );
      const computeSeedBits = from(seedSource, asapScheduler)
        .pipe(
          take(recordCount), bufferCount(recordsPerBuffer)
        );

      // const concurrentBuffers = 4;
      const toWriteGuard: Subject<string> = new Subject<string>();
      const fromWriteGuard = toWriteGuard.pipe(observeOn(asyncScheduler));

      // Access output file.
      // const openFlags =
      //   fs.constants.O_WRONLY | fs.constants.O_CREAT |
      //   fs.constants.O_NONBLOCK | fs.constants.O_NOATIME;
      // const seedFd = fs.openSync(fileName, openFlags, 400);
      console.log(fileName);

      const retVal = zip<Buffer[], number, number, string>(computeSeedBits, directoryCreateCount, writeOffsets, fromWriteGuard)
        .subscribe(
          (input: [Buffer[], number, number, string]) => {
             const buffers = input[0];
             const directoryIndex = input[1];
             const writeOffset = input[2];
             const writeGuardKey = input[3];
             const iterCount = (
               buffers.length < recordsPerBuffer
             ) ? buffers.length : recordsPerBuffer;

             for (let ii = 0; ii < iterCount; ii++) {
                // fs.writeSync(
                //   seedFd, buffers[ii], 0, bitsPerSeedEntry,
                //   writeOffset + (ii * bitsPerSeedEntry)
                // handleBufferReturn
                // );
                const file = sprintf(
                  "./mypool/seedBlocks/%d/block_%08d-%02d.dat", directoryIndex, writeOffset, ii);
                fs.writeFile(file, buffers[ii], {flag: 'w+'}, (err: NodeJS.ErrnoException) => {
                   if (!!err) {
                      console.error(err);
                   }

                   if (ii == 0) {
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
}
