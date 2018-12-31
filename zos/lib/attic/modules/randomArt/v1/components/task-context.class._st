import {ImageDimensions} from '../interfaces/image-dimensions.value';
import {PointMap} from './point-map.class';
import {Observable} from 'rxjs';
import {count, map, shareReplay, take, windowCount} from 'rxjs/operators';
import {ITaskContext} from '../interfaces/index';

export class TaskContext implements ITaskContext
{
   public get pixelWidth(): number {
      return this.imageDimensions.pixelWidth;
   }

   public get pixelHeight(): number {
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

   constructor(public readonly imageDimensions: ImageDimensions, maxBufferSize: number) {
      let xScale = 1.0;
      let yScale = 1.0;

      this.dimensionToken =
         `${imageDimensions.pixelWidth}x${imageDimensions.pixelHeight}`;

      if (this.pixelWidth === this.pixelHeight) {
         if (imageDimensions.fitOrFill && imageDimensions.fitOrFill !== 'square') {
            throw new Error('fitOrFill must be square if width === height');
         } else {
            this.fitOrFill = 'square';
         }
      } else if (imageDimensions.fitOrFill === 'square') {
         throw new Error('fitOrFill cannot be square unless width === height');
      } else if (this.pixelWidth > this.pixelHeight) {
         if (imageDimensions.fitOrFill === 'fill') {
            xScale = this.pixelWidth / this.pixelHeight;
            this.fitOrFill = 'fill';
         } else {
            yScale = this.pixelHeight / this.pixelWidth;
            this.fitOrFill = 'fit';
         }
      } else if (imageDimensions.fitOrFill === 'fill') {
         yScale = this.pixelHeight / this.pixelWidth;
         this.fitOrFill = 'fill';
      } else {
         xScale = this.pixelWidth / this.pixelHeight;
         this.fitOrFill = 'fit';
      }

      this.pixelCount = this.pixelWidth * this.pixelHeight;
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
}
