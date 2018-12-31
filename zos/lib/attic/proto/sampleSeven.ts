import {Canvas} from 'canvas'
// import {Container, ContainerModule} from 'inversify';
import {from} from 'rxjs';
import * as fs from 'fs';

import '@jchptf/reflection';
// import {TicketPoolAssembly} from '../modules/tickets/ticket-pool-staging-area.service';
// import {configContainerModule} from '../apps/di/index';
// import {Deployment} from '../apps/config/index';
import {
   CanvasCalculator, ICanvasCalculator, IncrementalPlotProgress, IncrementalPlotterFactory, ModelSeed,
   RandomArtModel
} from '../modules/randomArt/index';

const modelSeedOne: ModelSeed = {
   prefixBits: Uint8ClampedArray.of(33, 37, 96, 61, 94, 125),
   suffixBits: Uint8ClampedArray.of(53, 126, 63, 58, 40, 64),
   novel: false
};
const modelSeedTwo: ModelSeed = {
   prefixBits: Uint8ClampedArray.of(33, 37, 3, 61, 94, 125),
   suffixBits: Uint8ClampedArray.of(53, 126, 63, 9, 40, 64),
   novel: false
};
const modelSeedThree: ModelSeed = {
   prefixBits: Uint8ClampedArray.of(24, 10, 173, 30, 130, 4),
   suffixBits: Uint8ClampedArray.of(31, 17, 190, 2, 210, 28),
   novel: false
};
const modelSeedFour: ModelSeed = {
   prefixBits: Uint8ClampedArray.of(65, 82, 88, 73, 80, 68),
   suffixBits: Uint8ClampedArray.of(105, 113, 99, 120, 102, 118),
   novel: false

};
const modelSeedFive: ModelSeed = {
   prefixBits: Uint8ClampedArray.of(105, 80, 120, 68, 118, 65),
   suffixBits: Uint8ClampedArray.of(73, 102, 88, 99, 65, 82, 113),
   novel: false
};

const canvasCalculator: ICanvasCalculator = new CanvasCalculator();
console.log([modelSeedOne, modelSeedTwo, modelSeedThree, modelSeedFour, modelSeedFive]);

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
