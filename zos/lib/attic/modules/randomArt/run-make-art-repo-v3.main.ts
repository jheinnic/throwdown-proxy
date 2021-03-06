import {Container, ContainerModule} from 'inversify';
import {Command} from 'commander';
import {buffers, chan, Chan} from 'medium';
import {take} from 'ix/iterable/pipe/take';
import {mapAsync} from 'ix/iterable/mapasync';
import {ec as EC} from 'elliptic';
import LRU = require('lru-cache');
import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {Subject} from 'rxjs';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as crypto from 'crypto';

import {
   BlockMappedDigestLocator, CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator,
   IMerkleLocatorFactory, ITopoOrderBuilder, MerkleCalculator, MerkleDigestLocator, MerkleTreeDescription,
   NamedPath, MerkleLocatorFactory
} from '@jchptf/merkle';
import {ConcurrentWorkFactory, IConcurrentWorkFactory} from '@jchptf/coroutines';

import {
   IPseudoRandomSource, IPseudoRandomSourceFactory, IsaacPseudoRandomSourceFactory
} from '../../../../src/infrastructure/randomize';

import {configContainerModule} from '../../apps/di';
import {Deployment} from '../../apps/config';

// import {EllipticModelGenConfig} from './v1/extensions/config/elliptic-model-gen-config.value';
// import {BitStrategyKind} from './v1/extensions/config/bit-strategy-kind.enum';
// import {PrefixSelectStyle} from './v1/extensions/config/prefix-select-style.enum';
// import {EllipticPublicKeySource} from './v1/extensions/elliptic-public-key-model-factory.class';
// import {PublicKeyReadAheadProcess} from './v1/extensions/public-key-read-ahead-process.class';
// import {EllipticPublicKeyModel} from './v1/extensions/elliptic-public-key-model.class';
// import {EllipticPublicKeyModelGenerator} from './v1/extensions/elliptic-public-key-model-generator';
// import {EllipticPublicKeyModelAdapter} from './v1/extensions/elliptic-model-adapter.class';

import {mkdirWithCallback} from '../../infrastructure/recordlist/mkdir-with-callback.function';
import {CanvasDimensions} from './messages';
import {ITaskContentAdapter} from './interface';
import {TicketArtworkLocator, ITicketPoolStagingArea} from '../tickets/interface';
import {TicketPoolAssembly} from '../tickets/ticket-pool-staging-area.service';
import {PointMapping, RandomArtGenerator, RandomArtModel} from './components';
import {BitStrategyKind, PrefixSelectStyle} from '../tickets/config';
import GenKeyPairOptions = ec.GenKeyPairOptions;

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);

const deploymentCfg: Deployment =
   configLoader.getConfig(Deployment, 'eth.lotto.deployment');
console.log('Deployment Config: ', util.inspect(deploymentCfg, true, 5, true));
const imageDimensions: CanvasDimensions = {
   pixelWidth: 480,
   pixelHeight: 480,
   fitOrFill: 'square',
   unitScale: 1.0
   // sampleResolution: true
};

// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
const treeDescriptor: MerkleTreeDescription =
   new MerkleTreeDescription(512, 256, 8192, 1280 * 32, 1280 * 25);
// new MerkleTreeDescription(512, 256, 8192, 1900005, 1900005);

const digestCache: LRU.Cache<number, MerkleDigestLocator> =
   LRU<number, MerkleDigestLocator>(Math.pow(2, 12));
const merkleLocatorFactory: IMerkleLocatorFactory =
   new MerkleLocatorFactory(treeDescriptor, digestCache);
const merkleCalculator: IMerkleCalculator =
   new MerkleCalculator(treeDescriptor, merkleLocatorFactory);

const identityCache: LRU.Cache<string, string> =
   LRU<string, string>(Math.pow(2, 8));
const digestIdentity: ICanonicalPathNaming =
   new CanonicalPathNaming(merkleCalculator, identityCache);

const isaacGeneratorFactory: IPseudoRandomSourceFactory<Buffer> =
   new IsaacPseudoRandomSourceFactory();
const isaacGenerator: IPseudoRandomSource =
   isaacGeneratorFactory.seedGenerator(
      crypto.pseudoRandomBytes(8192)
   );
const privateKeySource64 =
   isaacGenerator.pseudoRandomBuffers(8);
const privateKeySource256 =
   isaacGenerator.pseudoRandomBuffers(32);
const privateKeySource512 =
   isaacGenerator.pseudoRandomBuffers(64);

const ecInst: EC = new EC('ed25519');
console.log(privateKeySource512.next().value);
console.log(ecInst.keyFromPrivate(
   privateKeySource512.next().value // .toString('hex')
));
console.log(ecInst.genKeyPair({
   entropy: privateKeySource512.next().value, // .toString('hex'),
   entropyEnc: 'binary'
}));

const ticketPoolAssembly: ITicketPoolStagingArea =
   new TicketPoolAssembly(merkleCalculator, digestIdentity, deploymentCfg);

const ellipticModelGenConfig: EllipticModelGenConfig = {
   outputRoot: '/Users/jheinnic/Git/throwdown-proxy/zos/myLotto/events/game138',
   // dirTree: digestIdentity.findAllBlocksPathNamesDepthFirst(),
   // pathIterOne: digestIdentity.findLeafDigestPathNames(),
   // pathIterTwo: digestIdentity.findLeafDigestPathNames(),
   readAheadSize: 32,
   ecInst: ecInst,
   variants: [
      {
         nameExtension: '8from7_xy_full',
         bitMode: BitStrategyKind.get8From7,
         prefixSelect: PrefixSelectStyle.USE_X,
         xRunsForward: true,
         yRunsForward: true,
         xFromBit: 64,
         xToBit: 192,
         yFromBit: 64,
         yToBit: 192,
         useNewModel: false
      },
      {
         nameExtension: '8from7_yx_fullRvrs',
         bitMode: BitStrategyKind.get8From7,
         prefixSelect: PrefixSelectStyle.USE_Y,
         xRunsForward: false,
         yRunsForward: false,
         xFromBit: 64,
         xToBit: 192,
         yFromBit: 64,
         yToBit: 192,
         useNewModel: true
      },
      {
         nameExtension: '64toA_yRx_128bit',
         bitMode: BitStrategyKind.base64ToAscii,
         prefixSelect: PrefixSelectStyle.USE_Y,
         xRunsForward: false,
         yRunsForward: true,
         xFromBit: 16,
         xToBit: 143,
         yFromBit: 53,
         yToBit: 188,
         useNewModel: true
      },
      {
         nameExtension: 'mod160_xRy_72bit',
         bitMode: BitStrategyKind.mod160,
         prefixSelect: PrefixSelectStyle.USE_X,
         xRunsForward: true,
         yRunsForward: false,
         xFromBit: 11,
         xToBit: 84,
         yFromBit: 129,
         yToBit: 201,
         useNewModel: false
      },
      {
         nameExtension: 'raw_24bit_xy',
         bitMode: BitStrategyKind.raw,
         prefixSelect: PrefixSelectStyle.USE_X,
         xRunsForward: true,
         yRunsForward: true,
         xFromBit: 90,
         xToBit: 123,
         yFromBit: 2,
         yToBit: 36,
         useNewModel: true
      },
      {
         nameExtension: 'raw_208bit_Ryx',
         bitMode: BitStrategyKind.raw,
         prefixSelect: PrefixSelectStyle.USE_Y,
         xRunsForward: false,
         yRunsForward: false,
         xFromBit: 27,
         xToBit: 235,
         yFromBit: 23,
         yToBit: 231,
         useNewModel: false
      }
   ],
   firstGeneration: 25
};

function toPrivateKeyFile(namedElement: NamedPath<any>): string
{
   return path.join(
      ellipticModelGenConfig.outputRoot,
      deploymentCfg.dataSetPaths.ticketPrivateKeys,
      namedElement.name + '_private.key');
}

function toPublicKeyFile(namedElement: NamedPath<any>): string
{
   return path.join(
      ellipticModelGenConfig.outputRoot,
      deploymentCfg.dataSetPaths.ticketPublicKeys,
      namedElement.name + '_public.key');
}

async function launchAllocateStores(): Promise<void>
{
   console.log(`Run 'allocate' ${deploymentCfg} ${deploymentCfg.dataSetPaths}`);
   for (const nextDirElement of digestIdentity.findAllBlocksPathNamesDepthFirst('', true)) {
      const publicKeysDirPath: string = path.join(
         ellipticModelGenConfig.outputRoot,
         deploymentCfg.dataSetPaths.ticketPublicKeys,
         nextDirElement.name);
      const privateKeysDirPath: string = path.join(
         ellipticModelGenConfig.outputRoot,
         deploymentCfg.dataSetPaths.ticketPrivateKeys,
         nextDirElement.name);
      const artworkDirPath: string = path.join(
         ellipticModelGenConfig.outputRoot,
         deploymentCfg.dataSetPaths.ticketArtwork,
         nextDirElement.name);
      const dirsExist = await Promise.all([
         mkdirWithCallback(publicKeysDirPath),
         mkdirWithCallback(privateKeysDirPath),
         mkdirWithCallback(artworkDirPath)
      ]);

      if ((dirsExist[0] !== publicKeysDirPath)
         || (dirsExist[1] !== privateKeysDirPath)
         || (dirsExist[2] !== artworkDirPath))
      {
         console.error(
            `Failed to create key store directory, art store directory, or both for index ${nextDirElement.pathTo.index}`);
      }
   }

   return
}

async function launchGenerateKeys(): Promise<void>
{
   console.log(`Run 'generate'`);
   const keyFileRoot = path.join(
      ellipticModelGenConfig.outputRoot,
      deploymentCfg.dataSetPaths.ticketPrivateKeys
   );
   for (const nextFileElement of digestIdentity.findLeafDigestPathNames(keyFileRoot, true)) {
      const privateKeyFile = toPrivateKeyFile(nextFileElement);
      const publicKeyFile = toPublicKeyFile(nextFileElement);
      console.log(`Private: <${privateKeyFile}>, public: <${publicKeyFile}>`);

      const encoding = 'binary';
      const flag = 'w';
      const mode = 0o400;
      const ioOptions = {
         encoding,
         flag,
         mode
      };

      const filesExist = await Promise.all([
         new Promise<boolean>((resolve, reject) => {
            fs.stat(privateKeyFile, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
               // TODO: File not exists ErrNo?
               if (err.errno === 1) {
                  resolve(false);
               } else if (stats.isFile()) {
                  resolve(true)
               } else {
                  reject('Exists, but is not a file');
               }
            });
         }),
         new Promise<boolean>((resolve, reject) => {
            fs.stat(privateKeyFile, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
               // TODO: File not exists ErrNo?
               if (err.errno === 1) {
                  console.log(err);
                  resolve(false);
               } else if (stats.isFile()) {
                  resolve(true)
               } else {
                  reject('Exists, but is not a file');
               }
            });
         })
      ]).catch((error: any) => {
         console.log(
            `Failed to check private and/or public key files for index ${nextFileElement.pathTo.index}: ${error}`);
      });

      if (!filesExist) {
         console.error(`Could not test pre-existing files for index ${nextFileElement.pathTo.index}.`);
         continue;
      } else if (filesExist[0] && filesExist[1]) {
         console.log(`Skipping pre-existing files for index ${nextFileElement.pathTo.index}`)
         continue;
      } else if (filesExist[0] || filesExist[1]) {
         console.log(
            `Overwriting single private ${filesExist[0]} or public ${filesExist[1]} key for index ${nextFileElement.pathTo.index}`);
      }

      const keyPairOptions: GenKeyPairOptions = {
         entropy: privateKeySource512.next().value,
         entropyEnc: 'binary',
         pers: privateKeySource64.next().value,
         persEnc: 'binary'
      }
      const keyPair = ecInst.genKeyPair(keyPairOptions);
      // const privKey = keyPair.getPrivate();
      // const privateBits = (privKey as any).toBuffer();
      const privateHex: string = keyPair.getPrivate('hex') as string;
      const privateBits = Buffer.from(privateHex, 'hex');
      const pubKey = keyPair.getPublic();
      const publicBits = Buffer.from(
         pubKey.encode()
      );

      const pWriteFile = util.promisify(fs.writeFile);
      const wroteFiles: boolean[] = await Promise.all<boolean>([
         pWriteFile(privateKeyFile, privateBits, ioOptions).then(() => true ),
         pWriteFile(publicKeyFile, publicBits, ioOptions).then(() => true )
      ]).catch((error: any) => {
         console.error(
            `Failed to write key files for index = ${nextFileElement.pathTo.index}: ${error}`);
         return [false, false];
      });


      if (!wroteFiles) {
         console.error(
            `Could not determine whether files for index ${nextFileElement.pathTo.index} were written.`);
      } else if (!wroteFiles[0]) {
         if (!wroteFiles[1]) {
            console.error(
               `Failed to write public and private key files for index = ${nextFileElement.pathTo.index}`);
         } else {
            console.error(`Failed to write private key file for index = ${nextFileElement.pathTo.index}`);
         }
      } else if (!wroteFiles[1]) {
         console.error(`Failed to write public key file for index = ${nextFileElement.pathTo.index}`);
      } else {
         console.log(`Successful write for ${wroteFiles[0]} and ${wroteFiles[1]}`);
      }
   }
}

const maxBatchSize = 33000;
const concurrentWorkFactory: IConcurrentWorkFactory =
   new ConcurrentWorkFactory();

function launchPaintContent()
{
   console.log(`Run 'paint'`);
   const limitSourceReader =
      concurrentWorkFactory.createLimiter(8); // ellipticModelGenConfig.readAheadSize);
   const limitPaintWorker  =
      concurrentWorkFactory.createLimiter(3);
   const limitOutputWriter =
      concurrentWorkFactory.createLimiter(2);

   const inputIterator = ticketPoolAssembly.findAllArtwork('firstDefault');
   function* readTaskInput() {

   }
   function* processNextTicket() {
      mapAsync(
         inputIterator.pipe(take(1)),
         (next: TicketArtworkLocator, idx: number) => {
            limitSourceReader()
         })
   }
   // const paintPipelineInput: Queue<InputTaskMessage> = new Queue<InputTaskMessage>();
   const readAheadChannel: Chan<EllipticPublicKeySource> =
      chan(buffers.fixed(ellipticModelGenConfig.readAheadSize));

   const myContentReadAhead: PublicKeyReadAheadProcess =
      new PublicKeyReadAheadProcess(ellipticModelGenConfig, deploymentCfg, readAheadChannel);
   const myContentGenerator: Iterable<Promise<EllipticPublicKeyModel[]>> =
      new EllipticPublicKeyModelGenerator(ellipticModelGenConfig, readAheadChannel);
   // const myContentIterator: Iterator<Promise<EllipticPublicKeyModel[]>> =
   //    myContentGenerator[Symbol.iterator]();

   const myContentAdapter: ITaskContentAdapter<EllipticPublicKeyModel> =
      new EllipticPublicKeyModelAdapter();

   const myTaskLoader = new TaskLoader<EllipticPublicKeyModel>(
      myContentAdapter, myContentGenerator, imageDimensions, maxBatchSize);
   myContentReadAhead.start();

// 896, 896, 65500, 'square'
// 120, 120, 50000, 'square'

   const myCanvasSubject = new Subject<[Canvas, MyCanvasRenderingContext2D]>();
   const myCanvasProvider = new CanvasProvider(readAheadChannel, myCanvasSubject);
   const myCanvasPlotter = new CanvasPlotter();
   const myCanvasWriter = new CanvasWriter(ellipticModelGenConfig.outputRoot);
   const myCanvas = new Canvas(480, 480);
   const mapPoints: PointMapping = new PointMapping(480, 0, 1, 480, 0, 1);
   const randomModel: RandomArtModel =
      new RandomArtModel(prefix, suffix, false, myCanvas, myCanvas.getContext('2d')!);

   const points = [...mapPoints.createPlotter(randomModel)];
   console.log(points);

   const facade =
      new RandomArtGenerator(myCanvasProvider, myTaskLoader, myCanvasPlotter, myCanvasWriter);

   myCanvasProvider.createNextCanvas(480, 480);
   facade.launchCanvas();
}

function launchTopoVisit()
{
   const topoOrder = merkleCalculator.getTopoBlockOrder((bldr: ITopoOrderBuilder) => {
      bldr.leftToRight(true);
   });
   const topoIter = topoOrder[Symbol.iterator]();
   let nextTopo = topoIter.next();
   while (nextTopo.done === false) {
      const value: BlockMappedDigestLocator = nextTopo.value;
      console.log(
         `${value.blockLevel}, ${value.index}|${value.blockOffset} => [${value.leftMostPosition}, ${value.rightMostPosition}] @ ${value.rootDepth}|${value.position}`);
      nextTopo = topoIter.next();
   }
}

var program = new Command();
program.version('0.0.1')
   .option('-r, --recursive');

program.command('allocate')
   .action(launchAllocateStores);

program.command('generate')
   .action(launchGenerateKeys);

program.command('paint')
   .action(launchPaintContent);

program.command('topo')
   .action(launchTopoVisit);

program.parse(process.argv);
