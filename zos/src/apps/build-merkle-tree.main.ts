import LRU from 'lru-cache';
import {
   BlockMappedDigestLocator, MerkleDigestLocator, MerkleTreeDescription
} from '../infrastructure/merkle/locator';
import {
   DepthFirstVisitMode, DigestIdentityService, IDigestIdentityService, IMerkleCalculator, IMerkleLocatorFactory,
   MerkleCalculator
} from '../infrastructure/merkle';
import {IPseudoRandomSource, IPseudoRandomSourceFactory} from '../infrastructure/randomize/interface';
import {IsaacPseudoRandomSourceFactory} from '../infrastructure/randomize/sources';
// @ts-ignore
import {ec} from 'elliptic';
import * as crypto from 'crypto';
import {Container, ContainerModule} from 'inversify';
import {CONFIG_TYPES, ConfigLoader, configLoaderModule} from '../infrastructure/config';
import {configContainerModule} from './di';
import {Deployment} from './config';
// @ts-ignore
import {randomAccessFile} from 'random-access-file';
import * as path from 'path';
import * as fs from 'fs';
import {Stats} from 'fs';
import {IDfsOrderBuilder} from '../infrastructure/merkle/interface';
import {MerkleLocatorFactory} from '../infrastructure/merkle/merkle-locator-factory.class';

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));
// container.load(
//    new ContainerModule(initWorkspaceWorkerModule));

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
console.log(configLoader);

// const gameSpec: EventSpecification =
//    configLoader.getConfig(EventSpecification, "eth.lotto.eventSpec");
const deployment: Deployment =
   configLoader.getConfig(Deployment);
// const setupPolicy: SetupPolicy =
//    configLoader.getConfig(SetupPolicy);

// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
const treeDescriptor: MerkleTreeDescription =
   new MerkleTreeDescription(256, 256, 8192, 1280 * 32);

const digestCache: LRU.Cache<number, MerkleDigestLocator> =
   new LRU<number, MerkleDigestLocator>(Math.pow(2, 6));

const merkleLocatorFactory: IMerkleLocatorFactory =
   new MerkleLocatorFactory(treeDescriptor, digestCache);
const merkleCalculator: IMerkleCalculator =
   new MerkleCalculator(treeDescriptor, merkleLocatorFactory);

const identityCache: LRU.Cache<MerkleDigestLocator, string> =
   new LRU<MerkleDigestLocator, string>(Math.pow(2, 9));
const digestIdentity: IDigestIdentityService =
   new DigestIdentityService(merkleCalculator, identityCache);

const isaacGeneratorFactory: IPseudoRandomSourceFactory<Buffer> =
   new IsaacPseudoRandomSourceFactory();
const isaacGenerator: IPseudoRandomSource =
   isaacGeneratorFactory.seedGenerator(
      crypto.randomBytes(8192)
   );
const privateKeySource =
   isaacGenerator.pseudoRandomBuffers(32);
// const EC = ec;
// const ecInst = new EC('ed25519');
console.log(privateKeySource.next().value);
// console.log(ecInst.keyFromPrivate(
//    privateKeySource.next().value.hexSlice(0), 'hex'
// ));

fs.stat(deployment.localAccess.rootPath, (err: any, stats: Stats) => {
   if (!!err) {
      console.error(err);
   } else if (stats.isDirectory() === false) {
      console.error(`No directory at ${deployment.localAccess.rootPath}!`);
      fs.mkdirSync(deployment.localAccess.rootPath, 700);
      console.log('Corrected...');
   } else {
      console.log('Required root directory does exist!');
   }
});

const ticketKeyPairPath = path.join(
   deployment.localAccess.rootPath,
   deployment.vaultPaths.ticketKeyPairs
);
const ticketArtworkPath = path.join(
   deployment.localAccess.rootPath,
   deployment.vaultPaths.ticketArtwork
);
// const privateKeyFile = randomAccessFile(path.join(
//    ticketKeyPairPath, 'privateKeys.dat'));
// const publicKeyFile = randomAccessFile(path.join(
//    ticketKeyPairPath, 'publicKeys.dat'));

console.log(ticketKeyPairPath, ticketArtworkPath);

const pathTokens: string[] = [];
let currentDirectory: string;
function formatDirectory(nextBlock: BlockMappedDigestLocator): string
{
   const level = nextBlock.blockLevel;
   pathTokens.splice(level, pathTokens.length, `${nextBlock.blockLevel}-${nextBlock.blockOffset}`);
   currentDirectory = path.join(ticketKeyPairPath, ...pathTokens);

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
      const nextDirPath = formatDirectory(nextElement);
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
