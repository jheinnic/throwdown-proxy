import {InjectionToken} from '@angular/core';

import {IpfsServiceModels} from '../../../../ngx-ipfs/src/lib/store/models/ipfs-service.models';
import IpfsApiEndpoint = IpfsServiceModels.IpfsApiEndpoint;

export const ipfsEndpoint: InjectionToken<IpfsApiEndpoint> = new InjectionToken<IpfsApiEndpoint>('ipfsEndpoint');
export const bootstrapMetahash: InjectionToken<string> = new InjectionToken<string>('bootstrapMetahash');
