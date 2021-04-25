import {RenderStyleName} from './render-style-name.type';
import { Name } from '../../../../infrastructure/validation';
import { CanvasDimensions } from '../../../../apps/modules/roots/paint-gateway/follower/interface/model';
import {RenderStyleMetadata} from "./render-style-metadata.interface";

export interface ImageStyleMetadata {
   readonly name: ImageStyleName;
   readonly renderStyles: ReadonlyArray<RenderStyleMetadata>;
   readonly fullSize: CanvasDimensions;
   readonly thumbnail: CanvasDimensions;
   readonly previewPixel: number;
}