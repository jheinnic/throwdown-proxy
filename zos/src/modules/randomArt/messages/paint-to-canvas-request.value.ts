import {MessageType} from './message-type.enum';
import { Canvas } from 'canvas';
import { CanvasPaintedReply } from './canvas-painted-reply.value';
import { Chan } from 'medium';
import { IModelSeed } from '../../../apps/modules/roots/paint-gateway/follower/interface/model';

export class PaintToCanvasRequest
{
   public readonly messageType: MessageType.PAINT_CANVAS_REQUEST = MessageType.PAINT_CANVAS_REQUEST;

   public readonly completeSignal: Chan<CanvasPaintedReply>;
   public readonly seedModel: IModelSeed;
   public readonly canvas: Canvas;

   constructor(
      completeSignal: Chan<CanvasPaintedReply>,
      seedModel: IModelSeed,
      canvas: Canvas
   ) {
      this.completeSignal = completeSignal;
      this.seedModel = seedModel;
      this.canvas = canvas;
   }
}

// import {MessageHeaders} from '../../../infrastructure/messages/interfaces/message-headers.interface';
// import {UUID} from '../../../infrastructure/validation';
// import {correlationId, errorOn, replyOn} from
// '../../../infrastructure/messages/values/call-response-headers.interface'; import {Chan} from 'medium';
// const d1 = Symbol.for('d1'); const e2 = Symbol.for('e2'); export class D extends MessageHeaders<D> {
// [d1]: number }  export class E extends MessageHeaders<E> { [e2]: string; }  export interface ID extends
// D { }; export interface IE extends E { }; export class F extends MessageHeaders<F> implements ID, IE {
// public [correlationId]: UUID; public [errorOn]: Chan<any>; public [replyOn]: Chan<any>; [d1]: number;
// [e2]: string; }