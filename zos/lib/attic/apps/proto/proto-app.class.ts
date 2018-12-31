import {ComponentRegistry, Container, MainApplication} from 'inversify-components';
import {Container as InversifyContainer} from 'inversify';
import {WORLD_LIBRARY_TYPES} from './world-library.types';
import {V4WorldLibrary} from './v4-world-library.class';
import {IHelloService} from './hello-service.interface';

export class ProtoApp implements MainApplication {
   execute(container: Container) {
      // Start your application using the container!
      const componentRegistry : ComponentRegistry = container.componentRegistry;
      const appContainer = new InversifyContainer();
      componentRegistry.autobind(appContainer);
      appContainer.bind(WORLD_LIBRARY_TYPES.WorldLibrary).to(V4WorldLibrary);

      const service: IHelloService = appContainer.get("hello-world:service-name");
      console.log(service.getPublicKey());
   }
}
