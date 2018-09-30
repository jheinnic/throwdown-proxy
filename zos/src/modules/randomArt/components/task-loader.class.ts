import {Canvas} from 'canvas';
import {from, Observable, OperatorFunction, zip} from 'rxjs';
import {concatAll, count, map, shareReplay, take, windowCount} from 'rxjs/operators';

import {
   ITaskLoader, CanvasAndPlotModel, ITaskContentAdapter, ImageDimensions
} from '../interfaces';
import {PointMap, RandomArtModel} from '.';

/**
 * Bridge design pattern singleton that combines an adapter on the domain-specific task model,
 * {@link ITaskContentAdapter} acquired from an AsyncIterator with a fixed container of image
 * dimension attributes and returns a mash-up of both information sets.
 */
export class TaskLoader<Content> implements ITaskLoader
{
   public get pixelWidth(): number
   {
      return this.imageDimensions.pixelWidth;
   }

   public get pixelHeight(): number
   {
      return this.imageDimensions.pixelHeight;
   }

   public readonly dimensionToken: string;

   public readonly fitOrFill: 'square' | 'fit' | 'fill';

   private readonly widthPoints: Observable<number>;

   private readonly heightPoints: Observable<number>;

   private readonly actualBufferSize: number;

   private readonly iterationCount: number;

   private readonly pixelCount: number;

   private readonly pointMaps: Observable<PointMap>;

   public readonly pointMapBatches: Observable<Observable<PointMap>>;

   constructor(
      private readonly contentAdapter: ITaskContentAdapter<Content>,
      private readonly inputGenerator: Iterable<Promise<Content[]>>,
      public readonly imageDimensions: ImageDimensions,
      maxBufferSize: number)
   {
      let xScale = 1.0;
      let yScale = 1.0;

      this.dimensionToken =
         `${imageDimensions.pixelWidth}x${imageDimensions.pixelHeight}`;

      if (imageDimensions.pixelWidth === imageDimensions.pixelHeight) {
         if (imageDimensions.fitOrFill && imageDimensions.fitOrFill !== 'square') {
            throw new Error('fitOrFill must be square if width === height');
         } else {
            this.fitOrFill = 'square';
         }
      } else if (imageDimensions.fitOrFill === 'square') {
         throw new Error('fitOrFill cannot be square unless width === height');
      } else if (imageDimensions.pixelWidth > imageDimensions.pixelHeight) {
         if (imageDimensions.fitOrFill === 'fill') {
            xScale = imageDimensions.pixelWidth / imageDimensions.pixelHeight;
            this.fitOrFill = 'fill';
         } else {
            yScale = imageDimensions.pixelHeight / imageDimensions.pixelWidth;
            this.fitOrFill = 'fit';
         }
      } else if (imageDimensions.fitOrFill === 'fill') {
         yScale = imageDimensions.pixelHeight / imageDimensions.pixelWidth;
         this.fitOrFill = 'fill';
      } else {
         xScale = imageDimensions.pixelWidth / imageDimensions.pixelHeight;
         this.fitOrFill = 'fit';
      }

      this.pixelCount = imageDimensions.pixelWidth * imageDimensions.pixelHeight;
      this.widthPoints =
         PointMap.computeAffinePixelPoints(this.pixelWidth, -1 * xScale, xScale);
      this.heightPoints =
         PointMap.computeAffinePixelPoints(this.pixelHeight, -1 * yScale, yScale);
      this.pointMaps =
         PointMap.derivePointMaps(this.widthPoints, this.heightPoints);
      this.actualBufferSize =
         PointMap.findOptimalDivisor(this.pixelCount, maxBufferSize);
      this.iterationCount = this.pixelCount / this.actualBufferSize;

      // Compute all point maps into a ReplaySubject of ReplaySubjects.  The outer ReplaySubject caches
      // references to the inner ReplaySubjects, each of which caches a partial run of pre-computed point
      // mapping results.  Any random art image painted for a given resolution will utilize the exact same
      // coordinate mapping from model-space to paint-space, and the expected use case is to paint many
      // images at the same resolution, so it is worth the storage expense to conserve on computation here.
      console.log(`actualBufferSize = ${this.actualBufferSize}`);
      console.log(`iterationCount = ${this.iterationCount}`);
      this.pointMapBatches = this.pointMaps.pipe(
         windowCount<PointMap>(this.actualBufferSize),
         take(this.iterationCount + 1),
         map((window: Observable<PointMap>) => {
            const retVal = window.pipe(
               shareReplay(this.actualBufferSize));
            const subscription = retVal.pipe(count())
               .subscribe((value) => {
                  console.log(`Window-time count yields ${value} point maps`);
                  subscription.unsubscribe();
               });

            return retVal;
         }),
         shareReplay(this.iterationCount + 1));
   }

   public assignNextTask(): OperatorFunction<Canvas, CanvasAndPlotModel>
   {
      return (canvasSource: Observable<Canvas>) => {
         return zip(
            canvasSource,
            from(this.inputGenerator)
               .pipe(
                  concatAll<Content>()
               )
         )
            .pipe(map((pair: [Canvas, Content]) => {
                  const canvas: Canvas = pair[0];
                  const sourceContent: Content = pair[1];

                  console.log('Assigning a task for canvas received to ', canvas);
                  const paintContext = canvas.getContext('2d');
                  if (!paintContext) {
                     throw new Error('Failed to allocated 2d canvas');
                  }
                  paintContext.clearRect(0, 0, canvas.width, canvas.height);
                  paintContext.fillStyle = 'rgb(0,0,0)';
                  paintContext.fillRect(0, 0, canvas.width, canvas.height);

                  /*
            const sourceIterResult = this.inputGenerator.next();
            if (! sourceIterResult.done) {
               console.log('Before await', sourceIterResult);
               const sourceContent: Content = (
                  this.inputGenerator.next()
               ).value;
               */
                  console.log('Assigning await for canvas received to ', canvas);
                  const outputFilePath =
                     this.contentAdapter.convertToImagePath(sourceContent, this.dimensionToken);
                  const seedPhrase =
                     this.contentAdapter.convertToModelSeed(sourceContent);
                  const novelStrategy =
                     this.contentAdapter.isNovelStrategy(sourceContent);
                  const pointMapBatches = this.pointMapBatches;

                  const genModel = new RandomArtModel(seedPhrase, novelStrategy);

                  return {
                     canvas,
                     genModel,
                     paintContext,
                     outputFilePath,
                     pointMapBatches
                  };
               })
            );
      };
   }
}

