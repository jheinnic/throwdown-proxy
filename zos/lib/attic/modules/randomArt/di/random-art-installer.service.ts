import {interfaces} from 'inversify';

export class RandomArtInstaller {
   createInstallable(variantKey: PropertyKey) {
      return (bind: interfaces.Bind) => {
         bind
      }
   }
}