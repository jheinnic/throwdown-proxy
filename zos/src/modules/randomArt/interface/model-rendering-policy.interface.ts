import { Canvas } from 'canvas';

import { IncrementalPlotter, IRandomArtModel } from '.';

export interface IModelRenderingPolicy {
   create(genModel: IRandomArtModel, canvas: Canvas, canvasResizeOk?: boolean): IncrementalPlotter;
   // isCompatible(canvas: Canvas): boolean;
}