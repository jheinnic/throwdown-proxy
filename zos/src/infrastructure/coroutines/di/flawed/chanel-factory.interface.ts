import {ConcreteFactory} from '../../../di/index';
import {Chanel, ChanelOptions} from 'chanel';

export type ChanelFactory<M> = ConcreteFactory<Chanel<M>, [ChanelOptions, PropertyKey?]>;
