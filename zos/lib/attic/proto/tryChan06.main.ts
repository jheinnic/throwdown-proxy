import chan from 'chan';
import {co} from 'co';
import * as fs from 'fs';
import {ConcurrentWorkFactory} from '@jchptf/coroutines';
import {ModelSeed} from '../modules/randomArt/messages';
import Queue from 'co-priority-queue';
import {Canvas} from 'canvas';
import {IncrementalPlotProgress, IncrementalPlotter} from '../modules/randomArt/interface';
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
import {IPaintModelSeedStrategy} from '../modules/tickets/interface/policies';
const modelStrategies: IPaintModelSeedStrategy[] = [];

export function addTrigram (xFromBit = 63, xToBit = 189, yFromBit = 63, yToBit = 116) {
   modelStrategies.push(
      new TrigramModelSeedStrategy(
         seedModel('trigram' as Name, xFromBit, xToBit, yFromBit, yToBit)
      )
   );
}

export function addRawMapped (xFromBit = 63, xToBit = 189, yFromBit = 63, yToBit = 116) {
   modelStrategies.push(
      new RawMappedModelSeedStrategy(
         seedModel('rawMapped' as Name, xFromBit, xToBit, yFromBit, yToBit)
      )
   );
}

export function addEightFromEleven (xFromBit = 63, xToBit = 189, yFromBit = 63, yToBit = 116)
{
   modelStrategies.push(
      new EightFromElevenModelSeedStrategy(
         seedModel('8from11' as Name, xFromBit, xToBit, yFromBit, yToBit)
      )
   );
}

function seedModel (name: Name, xFromBit = 63, xToBit = 189, yFromBit = 63, yToBit = 116) {
   const modelSeedPolicy: Mutable<ModelSeedPolicy> = new ModelSeedPolicy();
   modelSeedPolicy.bitMode = BitStrategyKind.get8From7;
   modelSeedPolicy.useNewModel = false;
   modelSeedPolicy.name = name;
   modelSeedPolicy.prefixSelect = PrefixSelectStyle.USE_Y;
   modelSeedPolicy.xFromBit = xFromBit;
   modelSeedPolicy.xRunsForward = false;
   modelSeedPolicy.xToBit = xToBit;
   modelSeedPolicy.yFromBit = yFromBit;
   modelSeedPolicy.yRunsForward = true;
   modelSeedPolicy.yToBit = yToBit;
   return modelSeedPolicy;
}

// addTrigram(12, 140, 32, 128);
// addRawMapped(12, 108, 32, 104);
addTrigram(12, 172, 32, 128);
// addRawMapped(12, 132, 32, 104);

/*
addTrigram(12, 76, 32, 96);
addTrigram(12, 76, 32, 160);
addTrigram(12, 220, 32, 96);
addTrigram(12, 220, 32, 160);

addRawMapped(12, 60, 32, 80);
addRawMapped(12, 60, 32, 128);
addRawMapped(12, 180, 32, 80);
addRawMapped(12, 180, 32, 128);

addEightFromEleven(12, 78, 32, 98);
addEightFromEleven(12, 78, 32, 164);
addEightFromEleven(12, 243, 32, 98);
addEightFromEleven(12, 243, 32, 164);
*/

const dir = '/Users/jheinnic//Documents/randomArt3/pkFixture7';
const workFactory = new ConcurrentWorkFactory();
const autoIterate = new AutoIterate(asyncScheduler, workFactory);

const keyUuids: string[] = fs.readFileSync(`${dir}/keys.dat`, {encoding: 'utf8'})
   .split(/\n/);

const chanSrc: Chan.Chan<string> =
   workFactory.createSourceLoader(keyUuids[Symbol.iterator](), 4, 4);
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
   new Canvas(896, 896, "image"),
   new Canvas(896, 896, "image"),
   new Canvas(896, 896, "image")
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

autoIterate.service(chanSrc, srcToRdrGen, chanRdr, 2);

function* rdrToSeedGen(rdr: [string, string, Buffer, Buffer])
{
   const retVal = [];
   let iiByName = new Map<Name, number>();
   for (let strategy of modelStrategies) {
      const strategyDir = path.join(rdr[1], `${strategy.name}`);
      const seedFile = path.join(strategyDir, `${rdr[0]}.seed`);
      const seedModel = strategy.extractSeed(rdr[2], rdr[3]);
      logSeedData(seedFile, seedModel);

      let ii = iiByName.get(strategy.name);
      if (ii === undefined) {
         ii = 5;
      }
      retVal.push([`${rdr[0]}_${ii}`, strategyDir, seedModel]);
      iiByName.set(strategy.name, ++ii);
   }

   return retVal;
}

autoIterate.serviceMany(chanRdr, rdrToSeedGen, chanSeed, 2);

// co(function* () {
//    while (true) {
//       const tap = yield chanSeed;
//       console.log(tap);
//    }
// });

const canvasCalculator: ICanvasCalculator = new CanvasCalculator();
const mapPoints: IncrementalPlotterFactory =
   canvasCalculator.create(100352, 896, 896, 'square');

function* seedToPlotterGen(seed: [string, string, ModelSeed])
{
   const canvas: Canvas = yield canvasQueue.next();
   const randomArt = new RandomArtModel(seed[2], canvas);
   const incrPlotter = mapPoints.create(randomArt);
   return [seed[0], seed[1], canvas, incrPlotter];
}

autoIterate.service(chanSeed, seedToPlotterGen, chanPlotter, 2);

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

async function plotterToQueue() {
   while (true) {
      const plot = await new Promise(chanPlotter);
      plotterToTask.set(plot[3], [plot[0], path.join(plot[1], `${plot[0]}.png`), plot[2]]);
      newPlotQueue.push(plot[3], 0);
   }
}
plotterToQueue()
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

function logSeedData(seedFile: string, seedModel: Promise<ModelSeed>|ModelSeed)
{
   Promise.resolve(seedModel)
      .then(
         (seedModel: ModelSeed): void => {
            const preBuf = Buffer.from(seedModel.prefixBits.buffer);
            const sufBuf = Buffer.from(seedModel.suffixBits.buffer);
            const inspected = util.inspect(seedModel, true, 10, false);
            const preAscii = preBuf.toString('ascii');
            const sufAscii = sufBuf.toString('ascii');

            fs.appendFile(
               seedFile,
               `${preAscii} ${sufAscii}\n${preAscii}\n${sufAscii}\n${preBuf.toString(
                  'hex')}\n${sufBuf.toString(
                  'hex')}\n${inspected}\n`,
               function (err: NodeJS.ErrnoException) {
                  if (!!err) {
                     console.error(`Failed to create or append model seed log file, ${seedFile}:`, err);
                  }
               }
            );
         }
      ).catch(console.error.bind(console));
}
