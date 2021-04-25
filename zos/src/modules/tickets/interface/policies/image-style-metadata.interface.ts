import {Name} from '../../../../infrastructure/lib';
import {CanvasDimensions} from '../../../randomArt/messages';
import {RenderStyleName} from './render-style-name.type';

export interface ImageStyleMetadata {
   readonly name: Name;
   readonly renderStyles: ReadonlyArray<RenderStyleName>;
   readonly fullSize: CanvasDimensions;
   readonly thumbnail: CanvasDimensions;
   readonly previewPixel: number;
}