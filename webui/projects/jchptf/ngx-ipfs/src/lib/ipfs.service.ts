import {Injectable} from '@angular/core';
import {from, fromEvent, Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import * as IPFS from 'ipfs';
import * as IpfsApi from 'ipfs-api';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private readonly node: IPFS;

  private readonly node2: IpfsApi;

  constructor(private ipfsConig: IpfsApiConfig, private readonly logger: NGXLogger) {
    this.node2 = new IpfsApi(
      'localhost', 4001, {}
    );
    if (window['ipfs']) {
      this.node = window['ipfs'];
    } else {
      this.node = new IPFS({
        repo: String(Math.random() + Date.now()),
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
            ]
          }
        }
      });
    }
  }

  ready(): Observable<any> {
    return fromEvent(this.node, 'ready').pipe(take(1));
  }

 addresses(): Observable<Array<string>> {
    return from(
      this.node.id()
        .then((identity) => identity.addresses())
      .catch((err) => { throw err; })
    );
  }

  id(): Observable<string> {
    return from(this.node.id());
  }

  connectPeer(peer) {
    return from(
      this.node.swarm.connect(peer)).pipe(
        tap(undefined, (err) => {
          this.logger.error('Cannot connect to ' + peer, err);
        }));
  }

  mkdir() {
    return null;
  }

  get(hash) {
    return from(
        this.node.files.get(hash));
  }
}
