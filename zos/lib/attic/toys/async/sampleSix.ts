import {Canvas} from 'canvas'
// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
import {Container, ContainerModule} from 'inversify';
import {from} from 'rxjs';
import * as fs from 'fs';

import {CONFIG_TYPES, ConfigLoader, configLoaderModule} from '@jchptf/di-app-registry';
import {
   CanonicalPathNaming, ICanonicalPathNaming, IMerkleCalculator, IMerkleLocatorFactory, MerkleCalculator,
   MerkleDigestLocator, MerkleLocatorFactory, MerkleTreeDescription
} from '@jchptf/merkle';
import {TicketPoolAssembly} from '../../modules/tickets/ticket-pool-staging-area.service';
import {ITicketPoolStagingArea} from '../../modules/tickets/interface/index';
import {configContainerModule} from '../../apps/di/index';
import {Deployment} from '../../apps/config/index';
import {
   CanvasCalculator, ICanvasCalculator, IncrementalPlotProgress, IncrementalPlotterFactory, ModelSeed,
   RandomArtModel
} from '../../modules/randomArt/index';
import {BitStrategyKind, ModelSeedPolicy, PrefixSelectStyle} from '../../modules/tickets/config/index';
import LRU = require('lru-cache');
import {EightFromSevenModelSeedStrategy} from '../../modules/tickets/components/modelSeed/eight-from-seven-model-seed-strategy.class';
import {Mutable} from '@jchptf/tupletypes';
import {RawModelSeedStrategy} from '../../modules/tickets/components/modelSeed/raw-model-seed-strategy.class';
import {Base64ToAsciiModelSeedStrategy} from '../../modules/tickets/components/modelSeed/base64-to-ascii-model-seed-strategy.class';
import {Mod128ModelSeedStrategy} from '../../modules/tickets/components/modelSeed/mod-128-model-seed-strategy.class';
import {Mod160ModelSeedStrategy} from '../../modules/tickets/components/modelSeed/mod-160-model-seed-strategy.class';

const container: Container = new Container();
container.load(
   new ContainerModule(configLoaderModule));
container.load(
   new ContainerModule(configContainerModule));

const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
const deploySpec: Deployment =
   configLoader.getConfig(Deployment);

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
const ticketPoolAssembly: ITicketPoolStagingArea =
   new TicketPoolAssembly(merkleCalculator, digestIdentity, deploySpec);
const canvasCalculator: ICanvasCalculator = new CanvasCalculator();

const modelSeedPolicy: Mutable<ModelSeedPolicy> = new ModelSeedPolicy();
modelSeedPolicy.bitMode = BitStrategyKind.get8From7;
modelSeedPolicy.useNewModel = false;
modelSeedPolicy.name = "SampleFive";
modelSeedPolicy.prefixSelect = PrefixSelectStyle.USE_X;
modelSeedPolicy.xFromBit = 48;
modelSeedPolicy.xRunsForward = true;
modelSeedPolicy.xToBit = 96;
modelSeedPolicy.yFromBit = 48;
modelSeedPolicy.yRunsForward = true;
modelSeedPolicy.yToBit = 96;
const modelSeedStrategyOne =
   new EightFromSevenModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyTwo =
   new RawModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyThree =
   new Base64ToAsciiModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyFour =
   new Mod128ModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyFive =
   new Mod160ModelSeedStrategy(modelSeedPolicy);


/*
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
// const prefix: Uint8Array = Uint8Array.of(114, 11, 21, 47, 12, 52, 97, 21, 39);
// const suffix: Uint8Array = Uint8Array.of(89, 81, 87, 108, 106, 25, 96, 14, 113);
*/

const xBuffer: Buffer = Buffer.from("073054db6682e1d6c840e3f2a9d4de86261eeccbc5809033640a67a16dcab7ce");
const yBuffer: Buffer = Buffer.from("545599a4152cbe6a7e8f09de0466e52d1ebabd017cfaa69f40a319a1c2abef32");
// const xBuffer: Buffer = Buffer.from("066d54db6682e1d6c8e0e3f2a9d4de86261eeccbc5809033640767a16dcab3ce");
// const yBuffer: Buffer = Buffer.from("545599ae852cbe6a7e8f09de04a6e52d1ebabd017cfaac9f40a319a1c2a0ef32");
const modelSeedOne = modelSeedStrategyOne.extractSeed( xBuffer, yBuffer );
const modelSeedTwo = modelSeedStrategyTwo.extractSeed( xBuffer, yBuffer );
const modelSeedThree = modelSeedStrategyThree.extractSeed( xBuffer, yBuffer );
const modelSeedFour = modelSeedStrategyFour.extractSeed( xBuffer, yBuffer );
const modelSeedFive = modelSeedStrategyFive.extractSeed( xBuffer, yBuffer );

console.log(modelSeedPolicy, xBuffer.hexSlice(0), yBuffer.hexSlice(0));

function main()
{
   console.log('MAIN');

   const myCanvas = new Canvas(480, 480);
   const mapPoints: IncrementalPlotterFactory =
      canvasCalculator.create(2000, 480, 480, 'square');
   plotASeed(mapPoints, new Canvas(480, 480), modelSeedOne, "newTemp01.png");
   plotASeed(mapPoints, new Canvas(480, 480), modelSeedTwo, "newTemp02.png");
   plotASeed(mapPoints, new Canvas(480, 480), modelSeedThree, "newTemp03.png");
   plotASeed(mapPoints, new Canvas(480, 480), modelSeedFour, "newTemp04.png");
   plotASeed(mapPoints, myCanvas, modelSeedFive, "newTemp05.png");
}

function plotASeed( mapPoints: IncrementalPlotterFactory, myCanvas: Canvas, modelSeed: ModelSeed, outputFile: string ) {
   console.log(outputFile, modelSeed);
   const randomModel: RandomArtModel =
      new RandomArtModel( modelSeed, myCanvas );
   const points = mapPoints.create(randomModel);

   // const range100 = range(0, 120, asapScheduler); // animationFrameScheduler);
   // zip(range100, from(points))
   // from(points, asapScheduler)
   from(points)
      .subscribe((zipped: IncrementalPlotProgress) => {
         console.log(zipped);
         if (zipped.done === zipped.total) {
            const out = fs.createWriteStream(outputFile);
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
