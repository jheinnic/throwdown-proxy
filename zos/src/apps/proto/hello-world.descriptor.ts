import { ComponentDescriptor } from 'inversify-components';
import {IHelloService} from './hello-service.interface';
import {HelloService} from './hello-service.class';
import {WORLD_LIBRARY_TYPES} from './world-library.types';
import {ProtoExtensacutable} from './proto-extensacutable.class';
import {V1WorldLibrary} from './v1-world-library.class';

export const helloWorldDescriptor: ComponentDescriptor = {
   name: 'hello-world', // This must be unique for all registered components
   bindings: {
      root: (bindService, _lookupService) => {
         // Binding of services is very similar to inversifyJS:
         bindService.bindGlobalService<IHelloService>("service-name").to(HelloService);
         bindService.bindExecutable(WORLD_LIBRARY_TYPES.Extensicutable, ProtoExtensacutable);
         bindService.bindExtension(WORLD_LIBRARY_TYPES.Extensicutable).to(V1WorldLibrary)
      }
   },
   interfaces: { },
   defaultConfiguration: { }
};