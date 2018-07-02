import {Channel} from 'ts-csp';

export namespace PaintActivityModels
{
  export interface NameToken {
    readonly asUtf8Text: string;
    readonly asBase64Text: string;
    readonly asUint8Array: Uint8Array | number[];
  }

  /**
   * Arbitrary collection of names from a common population
   */
  export interface NameTokenExtent
  {
    readonly populationUuid: string;
    readonly nameTokens: NameToken[];
  }

  export enum RoutingSlipStageType {
    SUBMISSION_PENDING,
    MODEL_COMPUTATION,
    CANVAS_PAINTING,
    OUTPUT_HANDLING,
    SUCCESS_ACK_PENDING,
    ERROR_ACK_PENDING,
    CANCELED_ACK_PENDING,
    PAUSE_RESUME_PENDING
  }

  export interface DefinitionPendingStageSlip {
    type: RoutingSlipStageType.SUBMISSION_PENDING;
  }

  export interface ModelComputationStageSlip {
    readonly type: RoutingSlipStageType.MODEL_COMPUTATION;
    readonly percentDone: number;
  }

  export interface CanvasPaintingStageSlip {
    type: RoutingSlipStageType.CANVAS_PAINTING;
    readonly allocatedCanvasIndex: number;
    readonly percentDone: number;
  }

  export interface OutputHandlingStageSlip {
    type: RoutingSlipStageType.OUTPUT_HANDLING;
    readonly filePath: string;
  }

  export interface AuthorizeCleanupStateSlip {
    type: RoutingSlipStageType.SUCCESS_ACK_PENDING;
  }

  export interface HandleErrorStageSlip {
    type: RoutingSlipStageType.ERROR_ACK_PENDING;
  }

  export interface AcknowledgeCancelledStageSlip {
    type: RoutingSlipStageType.CANCELED_ACK_PENDING;
  }

  export interface PauseResumeStageSlip {
    type: RoutingSlipStageType.PAUSE_RESUME_PENDING;
  }

  export type RoutingSlipEntry =
    DefinitionPendingStageSlip | ModelComputationStageSlip | CanvasPaintingStageSlip | OutputHandlingStageSlip |
    AuthorizeCleanupStateSlip | AcknowledgeCancelledStageSlip | HandleErrorStageSlip | PauseResumeStageSlip;

  export interface RoutingSlip {
    readonly routingItinerary: RoutingSlipEntry[]
    readonly completedSteps: RoutingSlipEntry[]
    readonly activeStage: RoutingSlipEntry
    readonly onCompleteChannel: Channel;
    readonly onErrorChannel: Channel;
    readonly onInputQueue: boolean;
  }

  export interface PaintProcessModel {
    readonly trackingUuid: string;
    readonly prefix: NameToken;
    readonly suffix: NameToken;
    readonly populationPolicyUuid: string;
    readonly routingSlip?: RoutingSlip
  }

  export interface ActivityResourceCounts {
    readonly allocated: number;
    readonly working: number;
    readonly blocked: number;
    readonly idle: number;
  }

  export interface PaintActivityState
  {
    readonly activityPipeline: PaintProcessModel[]
    readonly resourceAvailability: ResourceAvailability;
    readonly
  }

  export interface ResourceAvailability {
    readonly computeModelResources: ActivityResourceCounts;
    readonly paintCanvasResources: ActivityResourceCounts;
    readonly postProcessingResources: ActivityResourceCounts;
  }
}



/*
export interface ByteBufferTaskDefinition
{
  readonly prefix: ByteBufferToken;
  readonly suffix: ByteBufferToken;
  readonly novel: boolean;
  readonly genNumber: number;
}

export interface ByteBufferTaskGeneratorOptions
{
  readonly prefixCount: number;
  readonly prefixLength: number;
  readonly suffixCount: number;
  readonly suffixLength: number;
  // readonly termRange: number;
  readonly firstGeneration?: number;
}
}

export interface CanvasAndPlotModel
{
  readonly canvas: Canvas;
  readonly genModel: RandomArtModel;
  readonly outputFilePath: string;
  readonly paintContext: CanvasRenderingContext2D;
  readonly pointMapBatches: Observable<Observable<PointMap>>;
}

export interface PointMap {
  readonly xPlot: number;
  readonly yPlot: number;
  readonly xCalc: number;
  readonly yCalc: number;
}

export function pointMapToString(p: PointMap) {
  return `Canvas Coordinates <${p.xPlot}, ${p.yPlot}> map to Fractal Coordinates <${p.xCalc}, ${p.yCalc}>`;
}

export interface FileWriterTaskContext
{
  readonly outputFilePath: string;
  readonly canvas: Canvas;
}
*/

/*
export class PointMap implements PointMap
{
  public constructor(
    public readonly xPlot = 0, public readonly yPlot = 0,
    public readonly xCalc = 0, public readonly yCalc = 0)
  { }

  public render(genModel: RandomArtModel, context: CanvasRenderingContext2D): boolean
  {
    context.fillStyle = genModel.compute_pixel(this.xCalc, this.yCalc);
    context.fillRect(this.xPlot, this.yPlot, 1, 1);
    return true;
  }

  public toString(): string
  {
    return `${this.xPlot},${this.yPlot} from ${this.xCalc},${this.yCalc}`;
  }
}
*/

