import {ConcreteFactory} from '../../../di/interfaces/index';
import {Chan} from 'chan';

export type ChanFactory<M> = ConcreteFactory<Chan<M>, [PropertyKey?]>;
