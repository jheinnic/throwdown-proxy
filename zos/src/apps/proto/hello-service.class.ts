import {IHelloService} from './hello-service.interface';
import {inject, injectable} from 'inversify';
import {IWorldLibrary} from './world-library.interface';
import {PublicKeyReply} from './public-key-reply.value';
import {WORLD_LIBRARY_TYPES} from './world-library.types';

@injectable()
export class HelloService implements IHelloService {
   constructor(
      @inject(WORLD_LIBRARY_TYPES.WorldLibrary) private worldLib: IWorldLibrary
   ) { }

   public getPublicKey(): PublicKeyReply
   {
      return {
         uuid: this.worldLib.getUuid()
      }
   }
}