import { Chan } from 'medium';
import { IAdapter } from '@jchptf/api';

export type WrappedChan<Input, Output = Input> =
   IAdapter<Chan<Input, Output>>;