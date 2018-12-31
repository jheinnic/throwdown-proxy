export interface ImageDimensions {
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  readonly fitOrFill: 'square' | 'fit' | 'fill';
  readonly sampleResolution: boolean;
}

