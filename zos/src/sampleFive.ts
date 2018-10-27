import {Canvas} from 'canvas'
// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
import {Container, ContainerModule} from 'inversify';
import elliptic from 'elliptic';
import {asapScheduler, from, range, zip} from 'rxjs';
import * as crypto from 'crypto';
import * as util from 'util';

import {CONFIG_TYPES, ConfigLoader, configLoaderModule} from '@jchptf/config';
import {
   CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator, IMerkleLocatorFactory, MerkleCalculator,
   MerkleDigestLocator, MerkleLocatorFactory, MerkleTreeDescription
} from '@jchptf/merkle';
import {IsaacPseudoRandomSourceFactory} from './infrastructure/randomize/sources';
import {TicketPoolAssembly} from './modules/tickets/ticket-pool-assembly.service';
import {ITicketPoolAssembly} from './modules/tickets/interface';
import {configContainerModule} from './apps/di';
import {Deployment} from './apps/config';
import {
   CanvasCalculator, ICanvasCalculator, IncrementalPlotProgress, IncrementalPlotterFactory, RandomArtModel
} from './modules/randomArt';
import * as fs from 'fs';
import {BitStrategyKind, ModelSeedPolicy, PrefixSelectStyle} from './modules/tickets/config';
import LRU = require('lru-cache');
import {EightFromSevenModelSeedStrategyClass} from './modules/tickets/eight-from-seven-model-seed-strategy.class';

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
const deploySpec: Deployment =
   configLoader.getConfig(Deployment);
console.log('Deployment:', util.inspect(deploySpec, true, 5, true));

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
// "/Users/jheinnic/Git/throwdown-proxy/zs/myLotto/events/game138/minting/tickets/artwork", "", "");

// @ts-ignore
const ticketPoolAssembly: ITicketPoolAssembly =
   new TicketPoolAssembly(merkleCalculator, digestIdentity, deploySpec);
const canvasCalculator: ICanvasCalculator = new CanvasCalculator();

const modelSeedPolicy: ModelSeedPolicy = new ModelSeedPolicy();
modelSeedPolicy.bitMode = BitStrategyKind.get8From7;
modelSeedPolicy.useNewModel = false;
modelSeedPolicy.name = "SampleFive";
modelSeedPolicy.prefixSelect = PrefixSelectStyle.USE_X;
modelSeedPolicy.xFromBit = 32;
modelSeedPolicy.xRunsForward = true;
modelSeedPolicy.xToBit = 96;
modelSeedPolicy.yFromBit = 32;
modelSeedPolicy.yRunsForward = true;
modelSeedPolicy.yToBit = 96;
const modelSeedStrategy = new EightFromSevenModelSeedStrategyClass(modelSeedPolicy);


const eInst = new elliptic.ec('ed25519');
const isaacSourceFactory = new IsaacPseudoRandomSourceFactory();
const isaacSource =
   isaacSourceFactory.seedGenerator(
      crypto.randomBytes(256)
   );
const isaacPrng = isaacSource.pseudoRandomBuffers(32);
const keyPair = eInst.keyFromPrivate(isaacPrng.next().value);
const publicKey = keyPair.getPublic();
const modelSeed = modelSeedStrategy.extractSeed(
   publicKey.getX().toBuffer(),
   publicKey.getY().toBuffer()
);
// const l = keyPair.getPublic().encode();
// const prefix = l.slice(0, 32);
// const suffix = l.slice(33, 65);
const prefix = [...modelSeed.prefixBits];
const suffix = [...modelSeed.suffixBits];

function main()
{
   console.log('MAIN');

   // for (let digestPath of digestIdentity.findAllBlocksPathNamesDepthFirst('', true)) {
   //    console.log(digestPath);
   // }

   const myCanvas = new Canvas(480, 480);
   const mapPoints: IncrementalPlotterFactory =
      canvasCalculator.create(1000, 480, 480, 'square');
   const randomModel: RandomArtModel =
      new RandomArtModel( prefix, suffix, false, myCanvas, myCanvas.getContext('2d')!);
   const points = mapPoints.create(randomModel);

   const range100 = range(0, 241, asapScheduler); // animationFrameScheduler);
   zip(range100, from(points))
      .subscribe((zipped: [number, IncrementalPlotProgress]) => {
         console.log(zipped[1]);
         if (zipped[1].done === 240) {
            const out = fs.createWriteStream("temp.png");
            const stream = myCanvas.createPNGStream();

            out.on('end', () => {
               console.log(`Saved png of ${out.bytesWritten} bytes to temp.png`);
               // resolve(taskContext.canvas);
            });

            stream.on('error', function (err: any) {
               console.error('Brap!', err);
               // reject(err);
               out.close();
            });

            stream.pipe(out);

            console.log('Write');
         }
      });
}

main();
console.log('peace');
