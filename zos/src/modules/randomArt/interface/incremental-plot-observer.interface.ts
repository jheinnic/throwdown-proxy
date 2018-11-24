/**
 * Strategy extension interfaces for implementing side effects to trigger during a walk of a RandomArt
 * model's rectangular region of interest, mapping each discrete pixel point from that region's
 * proportionally sized canvas grid to the floating point cartesian plane of a canonical model region.
 *
 * The typical use of this interface is to feed model coordinates into a seeded artwork model, extract
 * pixel color information, and then use the canvas coordinates to place that pixel in an
 * image.
 *
 * Aside from the "workhorse" plot method, there are two methods used to signal the end of a call
 * sequence--one for completion with error, the other for normal end-of-data completion.
 */
export interface IncrementalPlotObserver {
   plot(canvasX: number, canvasY: number, modelX: number, modelY: number): void;

   onError(error: any): void;

   onComplete(): void;
}
