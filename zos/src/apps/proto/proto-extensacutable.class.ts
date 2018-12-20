import {ExecutableExtension} from 'inversify-components';

export class ProtoExtensacutable implements ExecutableExtension {
   public execute(): any
   {
      console.log("Boo!");
   }
}