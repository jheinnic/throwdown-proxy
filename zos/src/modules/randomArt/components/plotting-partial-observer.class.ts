import {CompletionObserver, ErrorObserver, NextObserver} from 'ix/observer';

import {
   CANVAS_X_COORD, CANVAS_Y_COORD, IncrementalPlotObserver, MappedPoint, MODEL_X_COORD, MODEL_Y_COORD
} from '../interfaces';

export class PlottingPartialObserver implements NextObserver<MappedPoint>,
                                                ErrorObserver<MappedPoint>,
                                                CompletionObserver<MappedPoint>
{
   constructor(private readonly plotter: IncrementalPlotObserver) { }

   private _closed: boolean = false;

   public get closed(): boolean
   {
      console.log('closed');
      return this._closed;
   }

   public complete(): void
   {
      console.log('complete');
      if (!this._closed) {

      }
   }

   public error(err: any): void
   {
      this.plotter.onError(err);
   }

   public next(value: MappedPoint): void
   {
      try {
         this.plotter.plot(
            value[CANVAS_X_COORD], value[CANVAS_Y_COORD],
            value[MODEL_X_COORD], value[MODEL_Y_COORD]);
      } catch (err) {
         this.error(err);
      }
   }
}