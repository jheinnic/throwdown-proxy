import {Container, ContainerModule} from 'inversify';
import {Command} from 'commander';
import {buffers, chan, Chan} from 'medium';
import elliptic from 'elliptic';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as crypto from 'crypto';

import {CanvasPlotter, CanvasProvider, CanvasWriter, RandomArtGenerator, TaskLoader} from './v1/components';

import {MerkleLocatorFactory} from '../../infrastructure/merkle/merkle-locator-factory.class';
import {
   BlockMappedDigestLocator, CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator,
   IMerkleLocatorFactory, ITopoOrderBuilder, MerkleCalculator, MerkleDigestLocator, MerkleTreeDescription,
   NamedPath
} from '../../infrastructure/merkle';
import {configContainerModule} from '../../apps/di';

import {
   IPseudoRandomSource, IPseudoRandomSourceFactory, IsaacPseudoRandomSourceFactory
} from '../../../../src/infrastructure/randomize';

import {CONFIG_TYPES, ConfigLoader, configLoaderModule} from '../../infrastructure/config';
import {Deployment} from '../../apps/config';

import {ImageDimensions, ITaskContentAdapter} from './v1/interfaces';
import LRU = require('lru-cache');
import ErrnoException = NodeJS.ErrnoException;
import {EllipticModelGenConfig} from './v1/extensions/config/elliptic-model-gen-config.value';
import {BitStrategyKind} from './v1/extensions/config/bit-strategy-kind.enum';
import {PrefixSelectStyle} from './v1/extensions/config/prefix-select-style.enum';
import {EllipticPublicKeySource} from './v1/extensions/elliptic-public-key-model-factory.class';
import {PublicKeyReadAheadProcess} from './v1/extensions/public-key-read-ahead-process.class';
import {EllipticPublicKeyModel} from './v1/extensions/elliptic-public-key-model.class';
import {EllipticPublicKeyModelGenerator} from './v1/extensions/elliptic-public-key-model-generator';
import {EllipticPublicKeyModelAdapter} from './v1/extensions/elliptic-model-adapter.class';
import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {Subject} from 'rxjs';

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));
// container.rebind(CONFIG_TYPES.RootConfigPath)
//    .toConstantValue(
//       !!process.env.CONFIG_DIR ? process.env.CONFIG_DIR : './config' );

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
// console.log(configLoader);

const deploymentCfg: Deployment =
   configLoader.getConfig(Deployment, 'eth.lotto.deployment');
console.log('Deployment Config: ', util.inspect(deploymentCfg, true, 5, true));
const imageDimensions: ImageDimensions = {
   pixelWidth: 480,
   pixelHeight: 480,
   fitOrFill: 'square',
   sampleResolution: true
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

const ecInst: elliptic.ec = new elliptic.ec('ed25519');
// console.log(privateKeySource.next().value);
// console.log(ecInst.keyFromPrivate(
//    privateKeySource.next().value // .toString('hex')
// ));

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
      deploymentCfg.dataSetPaths.ticketKeyPairs,
      namedElement.name + '_private.key');
}

function toPublicKeyFile(namedElement: NamedPath<any>): string
{
   return path.join(
      ellipticModelGenConfig.outputRoot,
      deploymentCfg.dataSetPaths.ticketKeyPairs,
      namedElement.name + '_public.key');
}

// const DIR_ACCESS = fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
const DIR_MODE = 0o700;

function mkdirWithCallback(dirPath: string): Promise<string>
{
   // console.log(`About to mkdir for ${dirPath}`);
   return new Promise<string>((resolve, reject) => {
      fs.stat(dirPath, (err, stat) => {
         if (!!err) {
            if (err.code === 'ENOENT') {
               fs.mkdir(dirPath, 0o700, (err: ErrnoException) => {
                  if (!err) {
                     console.log(`Successfully created ${dirPath}`);
                     resolve(dirPath);
                  } else {
                     console.error(`Failed to create ${dirPath}: ${err}`);
                     reject(err);
                  }
               });
            } else {
               console.error(`Could not stat ${dirPath}: ${err}`);
               reject(err);
            }
         } else if (stat.uid !== process.getuid()) {
            const err = new Error(`${dirPath} is owned by ${stat.uid}, not ${process.getuid()}`);
            console.error(err);
            reject(err);
         } else if (!stat.isDirectory()) {
            const err = new Error(`${dirPath} is not a directory`);
            console.error(err);
            reject(err);
         } else if (stat.mode !== DIR_MODE) {
            fs.chmod(dirPath, DIR_MODE, (err: ErrnoException) => {
               if (!!err) {
                  console.error(`Could not set permission bits on ${dirPath} from ${stat.mode.toString(
                     8)} to ${DIR_MODE}`);
                  reject(err);
               } else {
                  console.warn(
                     `Updated permission bits on ${dirPath} from ${stat.mode.toString(8)} to ${DIR_MODE}`);
                  resolve(dirPath);
               }
            });
         } else {
            console.log(`${dirPath} is owned by this process, is a directory, and has mode ${DIR_MODE}`);
            resolve(dirPath);
         }
      });
   });
}

async function launchAllocateStores(): Promise<void>
{
   console.log(
      `Run 'allocate' ${deploymentCfg} ${deploymentCfg.dataSetPaths} ${deploymentCfg.dataSetPaths.ticketKeyPairs}`);
   for (const nextDirElement of ellipticModelGenConfig.dirTree) {
      const keyFilePath: string = path.join(
         ellipticModelGenConfig.outputRoot,
         deploymentCfg.dataSetPaths.ticketKeyPairs,
         nextDirElement.name);
      const artworkFilePath: string = path.join(
         ellipticModelGenConfig.outputRoot,
         deploymentCfg.dataSetPaths.ticketArtwork,
         nextDirElement.name);
      const dirsExist = await Promise.all([
         mkdirWithCallback(keyFilePath),
         mkdirWithCallback(artworkFilePath)
      ]);

      if ((
         dirsExist[0] !== keyFilePath
      ) || (
         dirsExist[1] !== artworkFilePath
      ))
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
   for (const nextFileElement of ellipticModelGenConfig.pathIterTwo) {
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
         new Promise<boolean>((resolve) => {
            fs.exists(privateKeyFile, resolve);
         }),
         new Promise<boolean>((resolve) => {
            fs.exists(publicKeyFile, resolve);
         })
      ])
         .catch((error: any) => {
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

      // const privateBits = privateKeySource.next().value;
      const keyPairOptions = {
         entropy: privateKeySource512.next().value,
         nonce: privateKeySource256.next().value,
         pers: privateKeySource64.next().value,
         persEnc: 'binary'
      }
      // const privateBits = ellipticModelGenConfig.ecInst.keyFromPrivate(privateBits);
      const keyPair = ellipticModelGenConfig.ecInst.genKeyPair(keyPairOptions);
      const privKey = keyPair.getPrivate();
      // const privateBits = keyPair.getPrivate("binary");
      const privateBits =
         keyPair.getPrivate().toBuffer();
      const pubKey = keyPair.getPublic();
      // const xBuf: Buffer = pubKey.x.toBuffer();
      // const yBuf: Buffer = pubKey.y.toBuffer();
      // const publicBits = Buffer.concat([xBuf, yBuf], 64);
      const publicBits = Buffer.from(
         pubKey.encode()
      );

      const wroteFiles = await Promise.all([
         new Promise((resolve, reject) => {
            fs.writeFile(privateKeyFile, privateBits, ioOptions,
               (err: NodeJS.ErrnoException): void => {
                  if (!!err) { reject(err); } else { resolve(true); }
               });
         }),
         new Promise((resolve, reject) => {
            fs.writeFile(publicKeyFile, publicBits, ioOptions,
               (err: NodeJS.ErrnoException): void => {
                  if (!!err) { reject(err); } else { resolve(true); }
               });
         })
      ])
         .catch((error: any) => {
            console.error(
               `Failed to write key files for index = ${nextFileElement.pathTo.index}: ${error}`);
         });

      if (!wroteFiles) {
         console.error(
            `Could not determine whether files for index ${nextFileElement.pathTo.index} were written.`);
         continue;
      } else if (!wroteFiles[0]) {
         if (!wroteFiles[1]) {
            console.error(
               `Failed to write public and private key files for index = ${nextFileElement.pathTo.index}`);
         } else {
            console.error(`Failed to write private key file for index = ${nextFileElement.pathTo.index}`);
         }

         continue;
      } else if (!wroteFiles[1]) {
         console.error(`Failed to write public key file for index = ${nextFileElement.pathTo.index}`);
         continue;
      }
   }
}

const maxBatchSize = 33000;

function launchPaintContent()
{
   console.log(`Run 'paint'`);
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
