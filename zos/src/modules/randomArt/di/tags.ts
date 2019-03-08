import {SymbolEnum} from '@jchptf/api';

type RandomArtVariantTags =
   'InputTask' | 'CanvasAvailable' | 'LifecycleStop' |
   'PaintEngineTask' | 'WriteOutputTask' | 'DeferrableTask';

export const RANDOM_ART_VARIANT_TAGS: SymbolEnum<RandomArtVariantTags> = {
   InputTask: Symbol.for('InputTask'),
   CanvasAvailable: Symbol.for('CanvasAvailable'),
   LifecycleStop: Symbol.for('LifecycleStop'),
   PaintEngineTask: Symbol.for('PaintEngineTask'),
   WriteOutputTask: Symbol.for('WriteOutputTask'),
   DeferrableTask: Symbol.for('DeferrableTask'),
};
