import * as Scarlet from 'scarlet';
import {Unsubscribable} from 'rxjs';

export class Child
{
  private _name: string;

  constructor(private _parent: Parent, private _id: number) { }

  public getId(): number
  {
    return this._id;
  }

  public getParent(): Parent
  {
    return this._parent;
  }

  public get name(): string
  {
    return this._name;
  }

  public set name(name: string)
  {
    this._name = name;
  }

  public setName(name: string): void
  {
    this._name = name;
  }

  public getName(): string
  {
    return this._name;
  }
}


export class Parent
{
  private _counter: number;

  private _children: Child[];

  constructor(private readonly _name: string, count: number)
  {
    this._counter = count;
    this._children = new Array(count);
    for (let ii = 0; ii < count; ii++) {
      this._children[ii] = new Child(this, ii);
    }
  }

  public count(): number
  {
    return this._counter++;
  }

  public getChild(ii: number)
  {
    return this._children[ii];
  }

  public get name(): string
  {
    return this._name;
  }
}

let timesCalled = 0;

const scarlet = new Scarlet();

export class LeasedAssetFactory<A>
{
  private _classMap = new Map<Function, Function>();

  public leaseAsset<L>(asset: A, lessee: L): LeasedAsset<L, A>
  {
    let assetClassProxy = this._classMap.get(asset.constructor);
    const _instanceSet = new Set<Object>();
    if (!assetClassProxy) {
      const assetInterceptor = function (invocation, proceed) {
        // 'Before Advice'
        proceed(); // 'Target Method' or 'Join Point'
        // 'After Advice'
        timesCalled += 1;
        console.log(invocation.result);
      };

      assetClassProxy =
        scarlet.intercept(asset.constructor)
          .using(assetInterceptor)
          .proxy();
      this._classMap.set(asset.constructor, assetClassProxy);
    }

    asset.constructor = assetClassProxy;
    // asset.__proto__ = assetClassProxy.prototype;
    _instanceSet.add(asset);

    return new LeasedAsset<L, A>(this, lessee, asset);
  }

  public adaptChild<T>(child: T, parent: A): T
  {
    return child;
  }

  constructor()
  {
  }
}

export class LeasedAsset<L, A> implements Unsubscribable
{
  constructor(private _factory: LeasedAssetFactory<A>, public readonly lessee: L, public readonly asset: A)
  {
  }

  public unsubscribe(): void {
  }
}


