import {Canvas} from 'canvas'
// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
// import {Container, ContainerModule} from 'inversify';
import elliptic from 'elliptic';
import {asapScheduler, from, range, zip} from 'rxjs';
import * as crypto from 'crypto';

import {
   CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator, IMerkleLocatorFactory, MerkleCalculator,
   MerkleDigestLocator, MerkleLocatorFactory, MerkleTreeDescription
} from '@jchptf/merkle';
import {IsaacPseudoRandomSourceFactory} from '../infrastructure/randomize/sources';
// import {configContainerModule} from '../apps/di/index';
// import {Deployment} from '../apps/config/index';
import {
   CanvasCalculator, ICanvasCalculator, IncrementalPlotProgress, IncrementalPlotterFactory, RandomArtModel
} from '../modules/randomArt/index';
import * as fs from 'fs';
import {BitStrategyKind, ModelSeedPolicy, PrefixSelectStyle} from '../modules/tickets/config';
import LRU = require('lru-cache');
import {EightFromSevenModelSeedStrategy} from '../modules/tickets/components/modelSeed';
import {Mutable} from '@jchptf/tupletypes';
import {Name} from '../infrastructure/validation';

// const container: Container = new Container();
// container.load(
//    new ContainerModule(configLoaderModule));
// container.load(
//    new ContainerModule(configContainerModule));
//
// const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
// const deploySpec: Deployment =
//    configLoader.getConfig(Deployment);
// console.log('Deployment:', util.inspect(deploySpec, true, 5, true));

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
// @ts-ignore
const digestIdentity: ICanonicalPathNaming =
   new CanonicalPathNaming(merkleCalculator, identityCache);
// "/Users/jheinnic/Git/throwdown-proxy/zs/myLotto/events/game138/minting/tickets/artwork", "", "");

// @ts-ignore
// const ticketPoolAssembly: ITicketPoolStagingArea =
//    new TicketPoolAssembly(merkleCalculator, digestIdentity, deploySpec);
const canvasCalculator: ICanvasCalculator = new CanvasCalculator();

const modelSeedPolicy: Mutable<ModelSeedPolicy> =
   new ModelSeedPolicy();
modelSeedPolicy.bitMode = BitStrategyKind.get8From7;
modelSeedPolicy.useNewModel = false;
modelSeedPolicy.name = "SampleFive" as Name;
modelSeedPolicy.prefixSelect = PrefixSelectStyle.USE_X;
modelSeedPolicy.xFromBit = 32;
modelSeedPolicy.xRunsForward = true;
modelSeedPolicy.xToBit = 96;
modelSeedPolicy.yFromBit = 32;
modelSeedPolicy.yRunsForward = true;
modelSeedPolicy.yToBit = 96;
const modelSeedStrategy =
   new EightFromSevenModelSeedStrategy(modelSeedPolicy);


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

console.log(publicKey.getX().toBuffer().hexSlice(0));
console.log(publicKey.getY().toBuffer().hexSlice(0));
console.log(modelSeed);

function main()
{
   console.log('MAIN');

   const myCanvas = new Canvas(480, 480);
   const mapPoints: IncrementalPlotterFactory =
      canvasCalculator.create(2000, 480, 480, 'square');
      // canvasCalculator.create(230400, 480, 480, 'square');
   const randomModel: RandomArtModel =
      new RandomArtModel( modelSeed, myCanvas );
   const points = mapPoints.create(randomModel);

   const range100 = range(0, 240, asapScheduler); // animationFrameScheduler);
   zip(range100, from(points))
      .subscribe((zipped: [number, IncrementalPlotProgress]) => {
         console.log(zipped[1]);
         if (zipped[1].done === zipped[1].total) {
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
