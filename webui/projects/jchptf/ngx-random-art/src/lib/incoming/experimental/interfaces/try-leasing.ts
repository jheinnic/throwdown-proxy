import {defer, Observable, of, race, Subject, timer, Unsubscribable, using} from 'rxjs';
import {delayWhen, take} from 'rxjs/operators';
import {use} from 'typescript-mix';
import {Canvas} from 'canvas';

class AssetReservation<A, LA extends LeasedAsset<any, A> = LeasedAsset<any, A>> implements Unsubscribable
{
  constructor(private _onReturnSubject: Subject<LA>, private _adapter: LA)
  {
    if (! this._onReturnSubject || ! this._adapter) {
      throw new Error('All arguments are mandatory');
    } else if (! this._adapter._self) {
      throw new Error('AssetAdapter must have its concrete delegate or mixin status set');
    }
  }

  public get getLeasedAsset(): LA {
    return this._adapter;
  }

  public unsubscribe(): void
  {
    if (!!this._onReturnSubject) {
      this._adapter.dispose();
      this._onReturnSubject.next(this._adapter);
      this._onReturnSubject = undefined;
      this._adapter = undefined;

    } else {
      throw new Error('Reservation unsubscribe is not idempotent and must only be called one time.');
    }
  }
}

export class ChildAsset<L, A, C> {
  _self: C;
  _root: LeasedAsset<L, A>;

}

export class LeasedAsset<L, A>
{
  _self: any; // A|LeasedAsset<L, A>;
  _disposed: boolean;
  _map: Map<Object, LeasedAsset<L, any>>;
  _lessee: L;

  public _initLeasedAsset(lessee: L, asset?: A): void
  {
    console.log(lessee, asset);
    if (! lessee) {
      throw new Error('Lessee required for reservation adapter initialization');
    }
    if ((this._root !== undefined) || (this._self !== undefined)) {
      throw new Error(
        'Adapter initialization is done one time automatically during construction and is not to be called by directly'
      );
    }

    this._root = {
      map:
    }
     new Map<Object, LeasedAsset<L, any>>();
    this._disposed = false;
    this._lessee = lessee;

    // Asset is defined iff we are used as a wrapping delegate, and undefined iff we are used as a mix-in.
    if (!! asset) {
      this.adapt(asset);
    } else {
      this.adapt(this);
    }
  }

  private _getProto(): A|LeasedAsset<L, A> {
    if (!this._self || ! this._self.constructor || ! this._self.constructor.prototype) {
      return undefined;
    }
    return this._self.constructor.prototype;
  }

  private _unwrapSelf(): void
  {
    const proto = this._getProto();
    if (! proto) {
      return;
    }

    Object.keys(proto)
      .forEach((propName: string) => {
        console.log('Unwrap', propName);
        const _prop = proto[propName];
        if (typeof _prop === 'function') {
          delete this[propName];
        } else {
          console.log('Not a function:', propName);
        }
      });

    this._self = undefined;
  }

  private _wrapSelf(): void
  {
    // let proto = this._getProto();
    if (! this._self) {
      this._self = this;
      // proto = this._getProto();
    }

    function _fail()
    {
      throw new Error('Asset is no longer leased');
    }

    // Object.keys(proto)
    //   .forEach((propName: string) => {
    let propName: string;
    for (propName in this._self) {
      if (typeof this._self[propName] === 'function') {
        const _self = this;
        const _asset: any = this._self;
        const _prop = _asset[propName];
        this[propName] = function () {
          if (_self._disposed) {
            _fail();
          }

          const rawReturn = _prop.apply(_asset, arguments);
          let retVal = rawReturn;
          if (typeof rawReturn === 'object') {
            retVal = _self._map.get(rawReturn);
            if (! retVal) {
              re
            }
          }
        };
      } else {
        console.log('Not a function:', propName);
      }
    }
      // });
  }

  adapt(asset: A|LeasedAsset<any, A>): void
  {
    if (this._disposed) {
      throw new Error('Asset adapter has already been disposed of!');
    }
    if (!! this._self) {
      this._unwrapSelf();
    }
    this._self = asset;
    this._wrapSelf();
  }

  dispose(): void
  {
    this._disposed = true;
  }
}

export class Widget
{
  _counter = 0;

  constructor()
  {
    this._counter = 0;
  }

  public doIt(): void
  {
    console.log('Doing it');
  }

  public count(): number
  {
    return this._counter++;
  }
}

export interface WidgetWrapper extends Widget, LeasedAsset<string, Widget>
{
}

export class WidgetWrapper implements WidgetWrapper
{
  _counter: number;
  _disposed: boolean;
  _self: any;

  @use(Widget, LeasedAsset) this;

  constructor() {
    this._initLeasedAsset('Happy Balloons');
    this._counter = 0;
  }
}

export interface CanvasWrapper<L> extends Canvas, LeasedAsset<L, HTMLCanvasElement> { }

// export class LeasedAsset<L, A> implements Unsubscribable
// constructor(private onReturnSubject: Subject<A>, private _asset: A, public readonly lessee: L)
// {
// }
// public unsubscribe(): void
//   {
//     if (!this.onReturnSubject) {
//
// }
// }

export class CanvasWrapper<L> implements CanvasWrapper<L>
{
  _disposed: boolean;
  _self: any;

  @use(HTMLCanvasElement, LeasedAsset) this;

  constructor(lessee: L, canvas: HTMLCanvasElement)
  {
    console.log(lessee, canvas, arguments);
    this._initLeasedAsset(lessee, canvas);
  }
}

export function reservationGate<L, A, K = string>(
  assetSource: Observable<A>,
  assetProvidedKeyMapper: (asset: A) => K,
  lesseeSatisfactoryKeySelector: (lessee: L) => K): (source: Observable<L>) => Observable<Observable<LeasedAsset<L, A>>>
{

  return undefined;
}

export class LeaseManager
{
  // public readonly requireLease: ();
}

export class LeaseManagerFactoryService
{
  createManager(): LeaseManager
  {
    return new LeaseManager();
  }
}

class Disposable
{
  private _disposed: boolean;

  private _observableAsset: Observable<string>;

  constructor(private readonly asset: string, private readonly message: string)
  {
    this._disposed = false;
    this._observableAsset = of(asset);
  }

  unsubscribe()
  {
    if (this._disposed) {
      throw new Error('Cannot dispose twice.');
    }

    console.log(this.message);
    this._disposed = true;
  }

  public get disposed(): boolean
  {
    return this._disposed;
  }

  public get source(): Observable<string>
  {
    if (this._disposed) {
      throw new Error('Cannot dispose twice.');
    }

    console.log('Opening a source...');
    return this._observableAsset;
  }
}

function factoryOne(): Disposable
{
  return new Disposable('Asset One', 'Factory One');
}

function factoryTwo(): Disposable
{
  return new Disposable('Asset Two', 'Factory Two');
}

function factoryThree(): Disposable
{
  return new Disposable('Asset Three', 'Factory Three');
}

function openDisposableSource(source: Disposable)
{
  return source.source;
}

function deferFactory(factory: () => Disposable, onSubMsg: string)
{
  return defer(() => {
    console.log(onSubMsg);
    return using(factory, openDisposableSource);
  })
    .pipe(
      delayWhen(of, timer(15000 * Math.random()))
    );
}

const sourceOne = deferFactory(factoryOne, 'SubscriptionOne');
const sourceTwo = deferFactory(factoryTwo, 'SubscriptionTwo');
const sourceThree = deferFactory(factoryThree, 'SubscriptionThree');

const competition = race(sourceTwo, sourceThree, sourceOne);

const sub = competition.pipe(take(1))
  .subscribe(
    (asset: string) => {
      console.log('Race for assets yields:', asset);
      sub.unsubscribe();
      console.log('Unsubscribed');
    },
    (err: any) => {
      console.error(err);
    },
    () => { console.log('Competition subscriber completes'); }
  );

