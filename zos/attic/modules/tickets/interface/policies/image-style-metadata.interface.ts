import {RenderStyleName} from './render-style-name.type';
import { Name } from '../../../../infrastructure/validation';
import { CanvasDimensions } from '../../../../apps/modules/roots/paint-gateway/follower/interface/model';

export interface ImageStyleMetadata {
   readonly name: Name;
   readonly renderStyles: ReadonlyArray<RenderStyleName>;
   readonly fullSize: CanvasDimensions;
   readonly thumbnail: CanvasDimensions;
   readonly previewPixel: number;
}