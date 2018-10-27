import LRU from 'lru-cache';
import {randomAccessFile} from 'random-access-file';
// @ts-ignore
import {ec as EC} from 'elliptic';
import {
   BlockMappedDigestLocator, MerkleDigestLocator, MerkleTreeDescription,
   DepthFirstVisitMode, CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator, IMerkleLocatorFactory,
   MerkleCalculator, IDfsOrderBuilder, MerkleLocatorFactory
} from '@jchptf/merkle';
import {IPseudoRandomSource, IPseudoRandomSourceFactory} from '../infrastructure/randomize/interface';
import {IsaacPseudoRandomSourceFactory} from '../infrastructure/randomize/sources';
import * as crypto from 'crypto';
import {Container, ContainerModule} from 'inversify';
import {CONFIG_TYPES, ConfigLoader, configLoaderModule} from '@jchptf/config';
import {configContainerModule} from './di';
import {Deployment} from './config';
import * as path from 'path';
import * as fs from 'fs';

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));
// container.load(
//    new ContainerModule(initWorkspaceWorkerModule));

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
console.log(configLoader);

const deployment: Deployment =
   configLoader.getConfig(Deployment);

// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
const treeDescriptor: MerkleTreeDescription =
   new MerkleTreeDescription(512, 256, 8192, 1280 * 32);

const digestCache: LRU.Cache<number, MerkleDigestLocator> =
   new LRU<number, MerkleDigestLocator>(Math.pow(2, 6));

const merkleLocatorFactory: IMerkleLocatorFactory =
   new MerkleLocatorFactory(treeDescriptor, digestCache);
const merkleCalculator: IMerkleCalculator =
   new MerkleCalculator(treeDescriptor, merkleLocatorFactory);

const identityCache: LRU.Cache<MerkleDigestLocator, string> =
   new LRU<MerkleDigestLocator, string>(Math.pow(2, 9));
// @ts-ignore
const digestIdentity: ICanonicalPathNaming =
   new CanonicalPathNaming(merkleCalculator, identityCache);

const isaacGeneratorFactory: IPseudoRandomSourceFactory<Buffer> =
   new IsaacPseudoRandomSourceFactory();
const isaacGenerator: IPseudoRandomSource =
   isaacGeneratorFactory.seedGenerator(
      crypto.randomBytes(8192)
   );
const privateKeySource: IterableIterator<Buffer> = isaacGenerator.pseudoRandomBuffers(32);
const ecInst = new EC('ed25519');
console.log(privateKeySource.next().value);
console.log(ecInst.keyFromPrivate(
   privateKeySource.next().value.hexSlice(0), 'hex'
));

fs.stat(deployment.localAccess.rootPath, (err: any, stats: fs.Stats) => {
   if (!!err) {
      console.error(err);
   } else if (! stats.isDirectory()) {
      console.error(`No directory at ${deployment.localAccess.rootPath}!`);
      fs.mkdirSync(deployment.localAccess.rootPath, 700);
      console.log('Corrected...');
   } else {
      console.log('Required root directory does exist!');
   }
});

const ticketPrivateKeysDirPath = path.join(
   deployment.localAccess.rootPath,
   deployment.dataSetPaths.ticketPrivateKeys
);
const ticketPublicKeysDirPath = path.join(
   deployment.localAccess.rootPath,
   deployment.dataSetPaths.ticketPublicKeys
);
const ticketArtworkDirPath = path.join(
   deployment.localAccess.rootPath,
   deployment.dataSetPaths.ticketArtwork
);
const privateKeyFile = randomAccessFile(path.join(
   ticketPrivateKeysDirPath, 'privateKeys.dat'));
const publicKeyFile = randomAccessFile(path.join(
   ticketPublicKeysDirPath, 'publicKeys.dat'));

console.log(privateKeyFile, publicKeyFile, ticketArtworkDirPath);

const pathTokens: string[] = [];
let currentDirectory: string;
function formatDirectory(rootDir: string, nextBlock: BlockMappedDigestLocator): string
{
   const level = nextBlock.blockLevel;
   pathTokens.splice(level, pathTokens.length, `${nextBlock.blockLevel}-${nextBlock.blockOffset}`);
   currentDirectory = path.join(rootDir, ...pathTokens);

   return currentDirectory;
}

function formatFile(nextDigest: BlockMappedDigestLocator)
{
   console.log(nextDigest.leftLeafSpan + ' to ' + nextDigest.rightLeafSpan + ' or '
      +  nextDigest.leftLeafPosition + ' to ' + nextDigest.rightLeafPosition);
   return path.join(currentDirectory, `${nextDigest.index}_${(1 + nextDigest.position).toString(16)}`);
}

for (let nextElement of merkleCalculator.getDfsBlockOrder(
   (builder: IDfsOrderBuilder) => {
      builder.visitMode(DepthFirstVisitMode.PRE_ORDER)
         .leftToRight(true)
   }
)) {
   console.log('Inside Loop');
   // if (nextElement.nodeType !== MerkleNodeType.LEAF) {
      let nextDirPath = formatDirectory(ticketPrivateKeysDirPath, nextElement);
      console.log('DirBuild: ', nextDirPath);
      nextDirPath = formatDirectory(ticketPublicKeysDirPath, nextElement);
      console.log('DirBuild: ', nextDirPath);
      nextDirPath = formatDirectory(ticketArtworkDirPath, nextElement);
      console.log('DirBuild: ', nextDirPath);
      // fs.mkdir(nextDirPath, (onResult) => {
      //    console.log(onResult);
      // });
   // } else {
   if (nextElement.blockLevel === 3) {
      console.log('FileBuild: ', formatFile(nextElement));
   }
}

console.log('After work Loop...');

/*
let counter = 0;
for (let nextTask of merkleCalculator.getDigestsOnLeafLayer(true)) {
   const nextVal: Uint8Array = privateKeySource.next().value
   const buf: Buffer = Buffer.from(
      nextVal.buffer
   );
   const nextKeyPair = ecInst.keyFromPrivate(buf);

   const privateHex: string = nextKeyPair.getPrivate('hex') as string;
   const publicHex = nextKeyPair.getPublic('hex') as string;
   const privateBuf = Buffer.from(privateHex);
   const publicBuf = Buffer.from(publicHex);

   const privateOffst =

   console.log(`PassA Leaf ${counter++} is at ${nextTask.filePath}`);
}
*/




// for (let nextTask of merkleTaskScanner) {
//    console.log(`PassB Leaf ${counter++} is at ${nextTask.filePath}`);
// }

/*
const leafLayer = merkleGenerator.findLeafLayer();
for (let leafDigest of merkleGenerator.getDigestsOnLayer(leafLayer, true)) {
   let blockPath = [...merkleGenerator.getBlockMappedPathFromRoot(leafDigest)];

   let filePath1 = path.join.apply(
      undefined,
      blockPath.map(
         function (pathElement: BlockMappedDigestLocator) {
            return `${pathElement.blockLevel}-${pathElement.blockOffset}`;
         }
      ).concat(`${leafDigest.index.toString(16)}`)
   );

   console.log(`PassA Leaf ${leafDigest.index + 1} is at ${filePath1}`);
}

const partialPathCache: LRU.Cache<BlockMappedDigestLocator, string> =
   new LRU<BlockMappedDigestLocator, string>({
      max: 1024,
      length: (_: string, key: BlockMappedDigestLocator) => {
         return key.blockLevel;
      }
   });

const merkleTaskScanner: MerkleTaskScanner =
   new MerkleTaskScanner(merkleCalculator, partialPathCache);


/*
for (let mappedBlock of merkleGenerator.getTreeAssemblyBlockOrder()) {
   console.log(mappedBlock);
   console.log('=*=');
   // console.log([
   //    mappedBlock.level, mappedBlock.offset, mappedBlock.root, mappedBlock.leafLayer,
   // mappedBlock.leftSpan, mappedBlock.rightSpan, mappedBlock.leftPosition, mappedBlock.rightPosition ]);
}
*/
