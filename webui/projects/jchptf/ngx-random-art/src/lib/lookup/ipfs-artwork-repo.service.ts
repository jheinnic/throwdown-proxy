import {Injectable} from '@angular/core';
import {IpfsService} from '../../../../ngx-ipfs/src/lib/ngx-ipfs.service';
import {ipfsEndpoint} from '../di/random-art.di';
import {IpfsServiceModels} from '../../../../ngx-ipfs/src/lib/store/models/ipfs-service.models';
import IpfsApiEndpoint = IpfsServiceModels.IpfsApiEndpoint;
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class IpfsArtworkRepoService {
  constructor(@Inject(ipfsEndpoint) private readonly ipfsConfig: IpfsApiEndpoint,
    private readonly keycloakService: KeycloakService) {
    keycloakService.addTokenToHeader()
  }
}
