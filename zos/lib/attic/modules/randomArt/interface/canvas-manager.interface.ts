import {PNGStream} from 'canvas';
import {CanvasDimensions} from '../messages';
import {UUID} from '../../../../../src/infrastructure/validation';

export interface ICanvasManager {
   release(): void;
   reserve(): UUID;
   paintPixel(xCoord: number, yCoord: number, fillStyle: string): void;
   getPngStream(): PNGStream;
   getSize(): CanvasDimensions;
   isReserved(): UUID | false;
   clearImage(): void;
   resetImage(newDimensions: CanvasDimensions): void;
}