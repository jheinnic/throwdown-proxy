import {Inject, Injectable} from '@angular/core';

import {Membrane, ObjectGraphHandler} from 'es-membrane';
import * as js_csp from 'js-csp';

import {JS_CSP_MODULE} from '../di/js-csp.di';

@Injectable({
  providedIn: 'root'
})
export class CspFactoryService
{
  private readonly membrane: Membrane;
  private readonly wetHandler: ObjectGraphHandler;
  private readonly dryHandler: ObjectGraphHandler;

  private jsCspDryProxy: js_csp;

  constructor(@Inject(JS_CSP_MODULE) private readonly jsCsp: js_csp)
  {
    /*
     * The object graph names I want are "wet" and "dry"
     * "wet" views object graphs for what I own.
     * "dry" views object graphs with restrictions to enable sharing with code I do not own.
     */

    // Establish the Membrane.  These are configuration options.
    this.membrane = new Membrane({});

    // Establish "wet" lessor ObjectGraphHandler.
    this.wetHandler = this.membrane.getHandlerByName('wet', {mustCreate: true});

    // Establish "dry" lessee ObjectGraphHandler.
    this.dryHandler = this.membrane.getHandlerByName('dry', {mustCreate: true});

    const modifyApi = this.membrane.modifyRules;
    console.log('Modify API:', modifyApi);

    const foo2A = this.wetHandler.addProxyListener(console.log);
    const foo2B = this.dryHandler.addProxyListener(console.log);
    console.log('Proxy Listeners:', foo2A, foo2B);

    const foo1A = modifyApi.createChainHandler(this.wetHandler);
    const foo1B = modifyApi.createChainHandler(this.dryHandler);
    console.log('Chain handlers:', foo1A, foo1B);

    this.jsCspDryProxy = this.proxyWetObject(this.jsCsp);
  }

  private proxyDryObject<A = any>(dryAsset: A): A {

    return this.membrane.convertArgumentToProxy(
      this.dryHandler,
      this.wetHandler,
      dryAsset
    );
  }

  private proxyWetObject<A = any>(wetAsset: A): A {

    return this.membrane.convertArgumentToProxy(
      this.wetHandler,
      this.dryHandler,
      wetAsset
    );
  }

  public exposeJsCsp(): js_csp
  {
    return this.jsCspDryProxy;
  }

  public createUnbufferedChannel(): any {
    return this.proxyWetObject(
      js_csp.chan());
  }

  public createFixedBufferChannel(size: number) {
    return this.proxyWetObject(
      js_csp.chan(size));
  }

  public createSlidingBufferChannel(size: number) {
    return this.proxyWetObject(
      js_csp.chan(
        js_csp.buffers.sliding(size)));
  }

  public createDroppingBufferChannel(size: number) {
    return this.proxyWetObject(
      js_csp.chan(
        js_csp.buffers.dropping(size)));
  }

  public startProcess(procFn: () => IterableIterator<any>) {
    // js_csp.go(procFn);
    this.jsCspDryProxy.go(procFn);
  }
}
