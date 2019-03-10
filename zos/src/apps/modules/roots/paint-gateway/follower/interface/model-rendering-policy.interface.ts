import { Canvas } from 'canvas';

import { IncrementalPlotter, IRandomArtModel } from '.';

export interface IModelRenderingPolicy {
   create(genModel: IRandomArtModel, canvas: Canvas, canvasResizeOk?: boolean): IncrementalPlotter;
}
// export type IModelRenderingPolicy =
//    (genModel: IRandomArtModel, canvas: Canvas, canvasResizeOk?: boolean) => IncrementalPlotter;
