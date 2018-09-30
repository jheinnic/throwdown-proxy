// @ts-ignore
import {Canvas} from 'canvas';
import {ICanvasProvider} from '../interfaces';

export class CanvasProvider implements ICanvasProvider {
  public createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas {
    const canvas = new Canvas(pixelWidth, pixelHeight, 'image');
    const paintContext = canvas.getContext('2d');
    if (! paintContext) {
      throw new Error('Could not get 2D painting context');
    }

    paintContext.patternQuality = 'best';
    paintContext.filter = 'best';
    paintContext.antialias = 'subpixel';

    return canvas;
  }

  // TODO: Allocate PointMap batches in tandem?
}
