import chan from 'chan';
import {co} from 'co';
import * as fs from 'fs';
import {ConcurrentWorkFactory} from '@jchptf/coroutines';
import {ModelSeed} from '../modules/randomArt/messages';
import Queue from 'co-priority-queue';
import {Canvas} from 'canvas';
import {IncrementalPlotProgress, IncrementalPlotter} from '../modules/randomArt/interfaces';
import {AutoIterate} from '../infrastructure/lib';
import {asyncScheduler} from 'rxjs';
import * as util from 'util';
import * as path from 'path';
import {Mutable} from '@jchptf/tupletypes';
import {BitStrategyKind, ModelSeedPolicy, PrefixSelectStyle} from '../modules/tickets/config';
import {Name} from '../infrastructure/validation';
import {
   EightFromElevenModelSeedStrategy, RawMappedModelSeedStrategy, TrigramModelSeedStrategy
} from '../modules/tickets/components/modelSeed';
import {
   CanvasCalculator, ICanvasCalculator, IncrementalPlotterFactory, RandomArtModel
} from '../modules/randomArt';

const modelSeedPolicy: Mutable<ModelSeedPolicy> = new ModelSeedPolicy();
modelSeedPolicy.bitMode = BitStrategyKind.get8From7;
modelSeedPolicy.useNewModel = false;
modelSeedPolicy.name = "SampleFive" as Name;
modelSeedPolicy.prefixSelect = PrefixSelectStyle.USE_Y;
modelSeedPolicy.xFromBit = 14;
modelSeedPolicy.xRunsForward = true;
modelSeedPolicy.xToBit = 129;
modelSeedPolicy.yFromBit = 167;
modelSeedPolicy.yRunsForward = false;
modelSeedPolicy.yToBit = 246;
const modelSeedStrategyOne =
   new TrigramModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyTwo =
   new RawMappedModelSeedStrategy(modelSeedPolicy);
const modelSeedStrategyThree =
   new EightFromElevenModelSeedStrategy(modelSeedPolicy);
const strategies = [
   modelSeedStrategyOne, modelSeedStrategyTwo,
   modelSeedStrategyThree
];

setTimeout(function() {
   const dir = '/Users/jheinnic/Documents/randomArt3/pkFixture5';
   const workFactory = new ConcurrentWorkFactory();
   const autoIterate = new AutoIterate(asyncScheduler, workFactory);

   const keyUuids: string[] = fs.readFileSync(`${dir}/keys.dat`, {encoding: 'utf8'})
      .split(/\n/);

   const chanSrc: Chan.Chan<string> =
      workFactory.createSourceLoader(keyUuids[Symbol.iterator](), 4, 2);
   const chanRdr: Chan.Chan<[string, string, Buffer, Buffer]> =
      chan(2);
   const chanSeed: Chan.Chan<[string, string, ModelSeed]> =
      chan(2);
   const canvasQueue: Queue<Canvas> =
      new Queue<Canvas>();
   const chanPlotter: Chan.Chan<[string, string, Canvas, IncrementalPlotter]> =
      chan(2);
   const chanWriter: Chan.Chan<[string, string, Canvas]> =
      chan(6);
   const chanRecycle: Chan.Chan<Canvas> =
      chan(8);

   const canvasArray: Canvas[] = [
      new Canvas(480, 480, "image"),
      new Canvas(480, 480, "image"),
      new Canvas(480, 480, "image")
   ];
   canvasQueue.push(canvasArray[0], 0);
   canvasQueue.push(canvasArray[1], 0);
   canvasQueue.push(canvasArray[2], 0);

   const readFileAsync = util.promisify(fs.readFile);

   function* srcToRdrGen(src: string): IterableIterator<any>
   {
      const artRoot =
         path.join(dir, 'artwork');
      const content = yield readFileAsync(
         path.join(dir, 'keys', `${src}.public`));
      const strContent = content.utf8Slice(0);
      const hexKeys = strContent.split(/:/);
      return [
         src,
         artRoot,
         Buffer.from(hexKeys[0], 'hex'),
         Buffer.from(hexKeys[1], 'hex')
      ];
   }

// const srcToRdr: WrappableCoRoutineGenerator<[string, string, Buffer, Buffer], [string]> =
//    srcToRdrGen;

   autoIterate.service(chanSrc, srcToRdrGen, chanRdr, 3);

   function* rdrToSeedGen(rdr: [string, string, Buffer, Buffer])
   {
      const retVal = [];
      let ii = 0;
      for (let strategy of strategies) {
         const strategyDir = path.join(rdr[1], `s${++ii}`);
         const seedFile = path.join(strategyDir, `${rdr[0]}.seed`);
         const seedModel = strategy.extractSeed(rdr[2], rdr[3]);
         logSeedData(seedFile, seedModel);
         retVal.push([rdr[0], strategyDir, seedModel]);
      }

      return retVal;
   }

   autoIterate.serviceMany(chanRdr, rdrToSeedGen, chanSeed, 3);

// co(function* () {
//    while (true) {
//       const tap = yield chanSeed;
//       console.log(tap);
//    }
// });

   const canvasCalculator: ICanvasCalculator = new CanvasCalculator();
   const mapPoints: IncrementalPlotterFactory =
      canvasCalculator.create(2000, 480, 480, 'square');

   function* seedToPlotterGen(seed: [string, string, ModelSeed])
   {
      const canvas: Canvas = yield canvasQueue.next();
      const randomArt = new RandomArtModel(seed[2], canvas);
      const incrPlotter = mapPoints.create(randomArt);
      return [seed[0], seed[1], canvas, incrPlotter];
   }

   autoIterate.service(chanSeed, seedToPlotterGen, chanPlotter, 3);

   const newPlotQueue = new Queue<IncrementalPlotter>();
   const plotterToTask: Map<IncrementalPlotter, [string, string, Canvas]> =
      new Map<IncrementalPlotter, [string, string, Canvas]>();

   function trackCompletion(progress: IncrementalPlotProgress)
   {
      if (progress.remaining == 0) {
         const task = plotterToTask.get(progress.plotter);
         chanWriter(task!)(() => {
            plotterToTask.delete(progress.plotter);
         });
      }
   }

   autoIterate.unwind(newPlotQueue, trackCompletion, 0);

   co(function* plotterToQueue() {
      while (true) {
         const plot: [string, string, Canvas, IncrementalPlotter] = yield chanPlotter;
         plotterToTask.set(plot[3], [plot[0], path.join(plot[1], `${plot[0]}.png`), plot[2]]);
         newPlotQueue.push(plot[3], 0);
      }
   })
      .then(
         () => {
            console.log('plot Queue loading coroutine has exited.  No more painting will occur.');
         }
      )
      .catch(
         (err: any) => {
            console.error('Plot queue loading coroutine has exited on an error:', err);
         }
      );

   function* writerToRecycleGen(writer: [string, string, Canvas])
   {
      const canvas: Canvas = writer[2];
      const out = fs.createWriteStream(writer[1]);
      const stream = canvas.createPNGStream();

      try {
         yield new Promise<Canvas>((resolve, reject) => {
            stream.on('end', () => {
               console.log(`Saved png of ${out.bytesWritten} bytes to ${writer[1]}`);
               resolve(canvas);
            });

            stream.on('error', function (err) {
               console.error('Brap!', err);
               reject(err);
               out.close();
            });

            stream.pipe(out);
         });
      } catch (err) {
         console.error('Failed to write ' + writer[1] + ':', err);
      }

      console.log('Writing on to recycling channel:', canvas);
      return canvas;
   }

   autoIterate.service(chanWriter, writerToRecycleGen, chanRecycle, 3);

   co(function* () {
      while (true) {
         const canvas: Canvas = yield chanRecycle;
         canvasQueue.push(canvas!, 0);
      }
   })
      .then(
         () => {
            console.log('Canvas recycling coroutine has exited.  No new painting will begin.');
         }
      )
      .catch(
         (err: any) => {
            console.error(
               'Canvas recycling coroutine has exited on an error!  No new painting will begin:', err);
         }
      );

   function logSeedData(seedFile: string, seedModel: ModelSeed)
   {
      const preBuf = Buffer.from(seedModel.prefixBits);
      const sufBuf = Buffer.from(seedModel.suffixBits);
      const inspected = util.inspect(seedModel, true, 10, false);
      const preAscii = preBuf.asciiSlice(0);
      const sufAscii = sufBuf.asciiSlice(0);
      fs.writeFileSync(
         seedFile,
         `${preAscii} ${sufAscii}\n${preAscii}\n${sufAscii}\n${preBuf.hexSlice(0)}\n${sufBuf.hexSlice(
            0)}\n${inspected}\n`);
   }
}, 10000);
