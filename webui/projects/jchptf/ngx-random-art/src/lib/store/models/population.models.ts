import {canvas} from '../../canvas';

export namespace PopulationModels
{
  export type FitFillSquareRatio = 'square' | 'fit' | 'fill';

  export interface ImageDimensions
  {
    readonly pixelWidth: number;
    readonly pixelHeight: number;
    readonly relativeShape?: FitFillSquareRatio;
  }

  export type PointList = number[];

  /**
   * Note that Pbkdf2 is not applied here for the sake of password verification, but merely as a means of
   *
   */
  export interface Pbkdf2NameTransformOptions
  {
    publicSalt: string;
    iterationCount: number;
    digestByteCount: number;
  }

  export interface GeneticsStrategyConfig
  {
    readonly uuid: string;
    readonly displayName: string;
    readonly algorithmUri: string;
    readonly dataVersion: string;
    readonly data: {
      prefix: Pbkdf2NameTransformOptions;
      suffix: Pbkdf2NameTransformOptions;
    }
  }


  /**
   * The term is borrowed from Chance and refers to a min/max bound range that is inclusive of its
   * boundary values at both ends.
   */
  export interface NaturalBoundRange
  {
    readonly min: number;
    readonly max: number;
  }

  export interface PainterConfig
  {
    readonly foci: NaturalBoundRange;
    readonly scalars: NaturalBoundRange;
    readonly pallette: NaturalBoundRange;
    readonly operations: NaturalBoundRange;
    readonly widthPoints: PointList;
    readonly heightPoints: PointList;
  }

  export interface DocumentId
  {
    schemaURI: string;
    documentURI: string;
  }

  export interface PopulationParameters
  {
    uuid: string;
    displayName: string;
    resolution: ImageDimensions;
    painting: PainterConfig;
    genetics: GeneticsStrategyConfig;
  }

  export interface EcosystemModelDocument
  {
    uuid: string;
    documentVersion: DocumentId;
    populationModels: PopulationParameters[]
  }
}
