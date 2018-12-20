import {IPublicKeyReply} from './public-key-reply.value';

export interface IHelloService {
   getPublicKey(): IPublicKeyReply;
}

