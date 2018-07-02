// import {queue} from 'rxjs/scheduler/queue';
// import {Observable} from 'rxjs/Observable';
// import {Subject} from 'rxjs/Subject';
// import 'rxjs/add/operator/windowCount';
// import 'rxjs/add/operator/reduce';
// import 'rxjs/add/operator/observeOn';
// import 'rxjs/add/operator/single';
// import 'rxjs/add/operator/share';
// import 'rxjs/add/operator/shareReplay';
// import 'rxjs/add/operator/multicast';
// import 'rxjs/add/operator/delayWhen';
// import 'rxjs/add/operator/concatMap';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/take';
// import 'rxjs/add/observable/fromPromise';
// import {PointMap} from './point-map.class';
// import * as RandomArtFactory from './genjs';
// import * as path from 'path';
// import * as fs from 'fs';
// import {Injectable} from '@angular/core';
// import {CanvasAndPlotModel} from './canvas-and-plot-model.interface';
// import {PaintingContext} from './painting-context.interface';
//
// require('reflect-metadata');
//
// const Canvas = require('canvas');
// const Chance = require('chance');
//
// // export class RandomArtSource<Content> {
// //   constructor( public readonly id: string, public readonly iterator: IterableIterator<Content>, public
// // readonly adapter: TaskContentAdapter<Content>) {  } }
//
// @Injectable()
// export class RandomModelPlotter
// {
//   paintThenEmit(nextTask: CanvasAndPlotModel<any>): Observable<boolean>
//   {
//     // Concatenate the reduction of each point map batch to yield an incrementally painted canvas.  The
//     // concatenate operator ensures that only one batch is consumed this way at a time.  Then, skip over
//     // each concatenated result except the last by reducing the sequence of reduced batches.  The resulting
//     // stream will emit a single arbitrary value when the entire painting task is complete.  The value is
//     // arbitrary insofar as caller is only interested in knowing when its emitted, not what that value was.
//     // A boolean value of true is used to facilitate a simple single() operator at the terminus as a
//     // correctness safeguard and expression of intent.
//     return nextTask.pointMapBatches.concatMap(
//       nextBatch => nextBatch.observeOn(queue)
//         .reduce(
//           (acc: PaintingContext, nextPointMap: PointMap) => {
//             // acc.paintContext.fillStyle = RandomArtFactory.compute_pixel(
//             //   acc.genModel, nextPointMap.to.x, nextPointMap.to.y, 1, 1);
//             // acc.paintContext.fillRect(nextPointMap.from.x, nextPointMap.from.y, 1, 1);
//             acc.genModel.render(nextPointMap, acc.paintContext);
//
//             return {
//               ...acc,
//               plots: (acc.plots + 1)
//             };
//           }, {
//             paintContext: nextTask.paintContext,
//             genModel: nextTask.genModel,
//             plots: 0
//           } as PaintingContext
//         )
//         .do(ctx => { console.log('Pre-concat post-reduce returning ', ctx); })
//     )
//       .do(ctx => { console.log('Observed a paint context pass for ', ctx); })
//       .reduce((acc: boolean, value: PaintingContext) => acc, true)
//       .single((value: boolean) => value)
//       .do(ctx => { console.log('Observed a final reduction pass for ', nextTask.sourceContent); });
//   }
// }
//
//
// export class CanvasWriter<Content>
// {
//   private static ensureDirectory(dirPath: string)
//   {
//     if (fs.existsSync(dirPath)) {
//       try {
//         const stats = fs.statSync(dirPath);
//         if (!stats.isDirectory()) {
//           throw Error(dirPath + ' exists, but is not a directory');
//         }
//       } catch (err) {
//         throw Error(dirPath + ' is not an accessible directory: ' + err);
//       }
//     } else {
//       try {
//         CanvasWriter.ensureDirectory(path.dirname(dirPath));
//         fs.mkdirSync(dirPath);
//       } catch (err) {
//         throw Error(dirPath + ' did not exist and could not be created: ' + err);
//       }
//     }
//   }
//
//   constructor(
//     private readonly outputDir: string,
//     private readonly contentAdapter: TaskContentAdapter<Content>)
//   {
//     if (!this.outputDir.endsWith('/')) {
//       this.outputDir = this.outputDir + '/';
//     }
//     CanvasWriter.ensureDirectory(this.outputDir);
//   }
//
//   private ensurePath(filePath: string): string
//   {
//     if (filePath.startsWith('/', 0)) {
//       throw Error('Derived file path, ' + filePath + ', may not be absolute');
//     }
//     if (filePath.length <= 0) {
//       throw Error('Derived file path may not be blank');
//     }
//     if (filePath.endsWith('/')) {
//       throw Error('Derived file path, ' + filePath + ', may not specify a directory');
//     }
//     if (!filePath.endsWith('.png')) {
//       filePath = filePath + '.png';
//     }
//     if (fs.existsSync(filePath)) {
//       throw Error('Derived file path, ' + filePath + ', already exists');
//     }
//     filePath = path.join(this.outputDir, filePath);
//
//     const dirPath = path.dirname(filePath);
//     if (!dirPath.startsWith(this.outputDir)) {
//       throw Error('Derived file path, ' + filePath + ', may not traverse above root with ..');
//     }
//     CanvasWriter.ensureDirectory(dirPath);
//
//     return filePath;
//   }
//
//   public writeOutputFile(taskContext: WriteToFileContext<Content>): Promise<Canvas>
//   {
//     const filePath =
//       this.ensurePath(
//         this.contentAdapter.convertToImagePath(taskContext.sourceContent)
//       );
//     console.log('Entered stream writer for ' + filePath);
//
//     try {
//       const out = fs.createWriteStream(filePath);
//       const stream = taskContext.canvas.createPNGStream();
//
//       return new Promise((resolve, reject) => {
//         stream.on('data', function (chunk: any) {
//           out.write(chunk);
//           // console.log('Writing chunk of data: ', chunk, out.bytesWritten);
//         });
//
//         stream.on('end', () => {
//           console.log('Saved png to ', filePath, out.bytesWritten);
//           out.end(() => {
//             resolve(taskContext.canvas);
//           });
//         });
//
//         stream.on('error', function (err: any) {
//           console.error('Brap!', err);
//           reject(err);
//           out.close();
//         });
//       });
//     } catch (err) {
//       return new Promise((resolve, reject) => {
//         reject(Error('I/O error while attempting to output to ' + filePath + ': ' + err));
//       });
//     }
//   }
// }
//
//
// interface NameModel
// {
//   readonly firstName: Array<string>;
//   readonly lastName: Array<string>;
//   readonly width: number;
//   readonly height: number;
//   readonly generation: number;
// }
//
//
// class NameModelAdapter implements TaskContentAdapter<NameModel>
// {
//   public convertToModelString(sourceContent: NameModel): string
//   {
//     return sourceContent.firstName.concat(sourceContent.lastName)
//       .join(' ');
//   }
//
//   public convertToImagePath(sourceContent: NameModel): string
//   {
//     return path.join(
//       sourceContent.width.toString() + 'x' + sourceContent.height.toString(),
//       // sourceContent.lastName.join('-'),
//       sourceContent.generation.toString(),
//       sourceContent.firstName.join('-') + '__' + sourceContent.lastName.join('-') + '.png'
//     );
//   }
// }
//
//
// function* taskGenerator(
//   givenNameCount: number,
//   givenNameWords: number,
//   familyNameCount: number,
//   familyNameWords: number,
//   middleNameCount: number,
//   chance: any,
//   width: number,
//   height: number): IterableIterator<NameModel>
// {
//   function createNameParts(nameCount: number, wordCount: number): Array<Array<string>>
//   {
//     const retVal = new Array(nameCount);
//     let ii = 0;
//     while (ii < nameCount) {
//       let jj = 0;
//       const nameVal = new Array(wordCount);
//       while (jj < wordCount) {
//         const wordLen = {
//           length: chance.rpg('1d5')[0] + chance.rpg('1d4')[0] + 1
//         };
//         const nextWord = chance.word(wordLen);
//         nameVal[jj] = nextWord.charAt(0)
//           .toUpperCase() + nextWord.substring(1);
//         jj = jj + 1;
//       }
//       retVal[ii] = nameVal;
//       ii = ii + 1;
//     }
//
//     return retVal;
//   }
//
//   let generation = 1;
//   while (true) {
//     let givenNames = createNameParts(givenNameCount, givenNameWords);
//     const familyNames = createNameParts(familyNameCount, familyNameWords);
//
//     console.log('Next batch of names have given=', givenNames, '; family=', familyNames);
//     if (middleNameCount > 0) {
//       const middleNames = createNameParts(middleNameCount, 1);
//       const newGivenNames = new Array<Array<string>>(givenNameCount * middleNameCount);
//       let ii = 0;
//       for (const firstName of givenNames) {
//         for (const middleName of middleNames) {
//           newGivenNames[ii] = firstName.concat(middleName[0]);
//           ii = ii + 1;
//         }
//       }
//       givenNames = newGivenNames;
//     }
//
//     for (const firstName of givenNames) {
//       for (const lastName of familyNames) {
//         yield {
//           firstName,
//           lastName,
//           width,
//           height,
//           generation
//         };
//       }
//     }
//
//     generation = generation + 1;
//   }
// }
//
//
// const myContentAdapter: TaskContentAdapter<NameModel> = new NameModelAdapter();
// const myChance = new Chance();
// const myInputTriggerSubject = new Subject<Canvas>();
// const myWidth = 256;
// const myHeight = 256;
// const shapeType = 'square';
// const maxBatchSize = 65500;
// const givenNamesPerCycle = 4;
// const wordsPerGivenName = 1;
// const familyNamesPerCycle = 3;
// const wordsPerFamilyName = 1;
//
// const myTaskLoader = new TaskLoader<NameModel>(
//   taskGenerator(
//     givenNamesPerCycle, wordsPerGivenName,
//     familyNamesPerCycle, wordsPerFamilyName, 3,
//     myChance, myWidth, myHeight
//   ),
//   myContentAdapter,
//   myWidth, myHeight, maxBatchSize, shapeType
//   // 896, 896, 65500, 'square'
//   // 120, 120, 50000, 'square'
// );
// const myPainter = new RandomModelPlotter();
// const myCanvasWriter = new CanvasWriter<NameModel>(
//   '/Users/jheinnic/Documents/randomArt3',
//   myContentAdapter);
// const facade = new PainterFactory<NameModel>(
//   myTaskLoader,
//   myPainter,
//   myCanvasWriter,
//   myInputTriggerSubject);
//
// facade.launchCanvas();
