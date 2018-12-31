import '@jchptf/reflection';
import {Container, ContainerImpl } from 'inversify-components';
import {helloWorldDescriptor} from './hello-world.descriptor';
import {ProtoApp} from './proto-app.class';

const container: Container = new ContainerImpl();
container.componentRegistry.addFromDescriptor(helloWorldDescriptor);
container.componentRegistry.autobind(container.inversifyInstance);
   container.componentRegistry.lookup("hello-world").addConfiguration({
      configurationKey: "configurationValue"
   });
container.setMainApplication(new ProtoApp());
container.runMain();