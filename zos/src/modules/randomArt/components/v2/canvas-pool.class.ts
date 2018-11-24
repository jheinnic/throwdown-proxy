import {CanvasDimensions, AssignCanvasRequest} from '../../messages/index';
import {IncrementalPlotterFactory} from '../../interface/index';
import {Chan} from "chan";

class ImagePolicySupport<P extends string, R extends string> {
   constructor(
      public readonly policy: P,
      public readonly role: R,
      public readonly dimensions: CanvasDimensions,
      readonly plotFactory: IncrementalPlotterFactory,
      readonly inputQueue: Chan<AssignCanvasRequest>
   ) { }


   toString(): string {
      return ImagePolicySupport.toString<P, R>(this.policy, this.role);
   }

   static toString<P extends string, R extends string>(policy: P, role: R): string {
      return `${policy}::${role}`;
   }
}
