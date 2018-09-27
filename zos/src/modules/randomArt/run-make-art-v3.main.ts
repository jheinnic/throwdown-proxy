import {TaskLoader} from './task-loader.class';
import {CanvasPlotter} from './canvas-plotter.service';
import {CanvasWriter} from './canvas-writer.class';
import {CanvasProvider} from './canvas-provider.service';
import {RandomArtGenerator} from './random-art-generator.service';

import {ITaskContentAdapter} from './task-content-adapter.interface';
import {ImageDimensions} from './image-dimensions.interface';
import {ITaskContentGenerator} from './task-content-generator.interface';
import {
   BitStrategyKind, EllipticModelGenConfig, EllipticPublicKeyModel, EllipticPublicKeyModelAdapter,
   EllipticPublicKeyModelGenerator, PrefixSelectStyle
} from './elliptic-model-adapter.class';
import {IPseudoRandomSource, IPseudoRandomSourceFactory} from '../../infrastructure/randomize/interface';
import {IsaacPseudoRandomSourceFactory} from '../../infrastructure/randomize/sources';
import {
   DigestIdentityService, IDigestIdentityService, IMerkleCalculator, IMerkleLocatorFactory, MerkleCalculator,
   MerkleDigestLocator, MerkleTreeDescription
} from '../../infrastructure/merkle';
import {MerkleLocatorFactory} from '../../infrastructure/merkle/merkle-locator-factory.class';
import elliptic from 'elliptic';

import * as crypto from 'crypto';
import LRU = require('lru-cache');

const imageDimensions: ImageDimensions = {
   pixelWidth: 480,
   pixelHeight: 480,
   fitOrFill: 'square',
   sampleResolution: true
};

// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
const treeDescriptor: MerkleTreeDescription =
   new MerkleTreeDescription(256, 256, 8192, 1280 * 32);

const digestCache: LRU.Cache<number, MerkleDigestLocator> =
   LRU<number, MerkleDigestLocator>(Math.pow(2, 6));

const merkleLocatorFactory: IMerkleLocatorFactory =
   new MerkleLocatorFactory(treeDescriptor, digestCache);
const merkleCalculator: IMerkleCalculator =
   new MerkleCalculator(treeDescriptor, merkleLocatorFactory);

const identityCache: LRU.Cache<MerkleDigestLocator, string> =
   LRU<MerkleDigestLocator, string>(Math.pow(2, 9));
const digestIdentity: IDigestIdentityService =
   new DigestIdentityService(merkleCalculator, identityCache);

const isaacGeneratorFactory: IPseudoRandomSourceFactory<Buffer> =
   new IsaacPseudoRandomSourceFactory();
const isaacGenerator: IPseudoRandomSource =
   isaacGeneratorFactory.seedGenerator(
      crypto.pseudoRandomBytes(8192)
   );
const privateKeySource =
   isaacGenerator.pseudoRandomBuffers(32);

const EC = elliptic.ec;
const ecInst = new EC('ed25519');
console.log(privateKeySource.next().value);
console.log(ecInst.keyFromPrivate(
   privateKeySource.next().value // .toString('hex')
));

const intArrayModelGenConfig: EllipticModelGenConfig = {
   keyPairRoot: '/Users/jheinnic/Git/throwdown-proxy/zos/myLotto/events/game138/minting/tickets/keyPair',
   outputRoot: '/Users/jheinnic/Documents/randomArt3/lotto',
   pathIter: digestIdentity.findAbsolutePathsToLeafNodes(),
   ecInst: ecInst,
   variants: [
      {
         nameExtension: '8from7_xy_full',
         bitMode: BitStrategyKind.get8From7,
         prefixSelect: PrefixSelectStyle.USE_X,
         xRunsForward: true,
         yRunsForward: true,
         xFromBit: 0,
         xToBit: 255,
         yFromBit: 0,
         yToBit: 255,
         useNewModel: false
      },
      {
         nameExtension: '8from7_yx_fullRvrs',
         bitMode: BitStrategyKind.get8From7,
         prefixSelect: PrefixSelectStyle.USE_Y,
         xRunsForward: false,
         yRunsForward: false,
         xFromBit: 0,
         xToBit: 255,
         yFromBit: 0,
         yToBit: 255,
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
         yFromBit: 50,
         yToBit: 179,
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
         xFromBit: 110,
         xToBit: 123,
         yFromBit: 2,
         yToBit: 26,
         useNewModel: true
      },
      {
         nameExtension: 'raw_240bit_Ryx',
         bitMode: BitStrategyKind.raw,
         prefixSelect: PrefixSelectStyle.USE_Y,
         xRunsForward: false,
         yRunsForward: false,
         xFromBit: 10,
         xToBit: 249,
         yFromBit: 6,
         yToBit: 245,
         useNewModel: false
      }
   ],
   firstGeneration: 25
};
const maxBatchSize = 33000;
const outputRootDir = '/Users/jheinnic/Documents/randomArt3';

const myContentAdapter: ITaskContentAdapter<EllipticPublicKeyModel> =
   new EllipticPublicKeyModelAdapter(imageDimensions);
const myContentGenerator: ITaskContentGenerator<EllipticPublicKeyModel> =
   new EllipticPublicKeyModelGenerator(intArrayModelGenConfig);

const myTaskLoader = new TaskLoader<EllipticPublicKeyModel>(myContentAdapter, myContentGenerator, maxBatchSize);
// 896, 896, 65500, 'square'
// 120, 120, 50000, 'square'

const myCanvasProvider = new CanvasProvider();
const myCanvasPlotter = new CanvasPlotter();
const myCanvasWriter = new CanvasWriter(outputRootDir);
const facade =
   new RandomArtGenerator(myCanvasProvider, myTaskLoader, myCanvasPlotter, myCanvasWriter);

facade.launchCanvas();
