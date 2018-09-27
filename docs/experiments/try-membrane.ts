import {Unsubscribable} from 'rxjs';
import {Membrane} from 'es-membrane';
import 'reflect-metadata';

// Establish "wet" view of an object.
// Get a "dry" view of the same object.
// dryDocument is a Proxy whose target is wetDocument, and whose handler is dryHandler.

// Return "top-level" document proxy.

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

export class AssetLeaseFactory
{
  constructor() { }

  public leaseAsset<L, A>(lessee: L, asset: A): AssetLease<L, A>
  {
    /*
     * The object graph names I want are "lessor" and "lessee".
     * "lessor" views object graphs for what I own.
     * "lessee" views object graphs with restrictions to enable sharing with code I do not own.
     */

    // Establish the Membrane.
    const membrane = new Membrane({
      // These are configuration options.
    });

    // Establish "wet" lessor ObjectGraphHandler.
    const lessorHandler = membrane.getHandlerByName('lessor', { mustCreate: true });

    // Establish "dry" lessee ObjectGraphHandler.
    const lesseeHandler = membrane.getHandlerByName('lessee', { mustCreate: true });
    return new AssetLease<L, A>(membrane, lessorHandler, lesseeHandler, lessee, asset);
  }
}

export class AssetLease<L, A> implements Unsubscribable
{
  public readonly lesseeAsset: A;

  constructor(
    public readonly lessee: L, private readonly _membrane: Membrane,
    private readonly _lessorHandler: any, private readonly _lesseeHandler: any,
    private readonly _lessorAsset: A)
  {
    const modifyApi = this._membrane.modifyRules;
    console.log(util.inspect(modifyApi, 20, 20, 20));

    const foo1 = modifyApi.createChainHandler(this._lesseeHandler);
    console.log(foo1);

    const foo2 = this._lesseeHandler.addProxyListener((meta) => {
      console.log(meta);
    });
    console.log(foo2);

    this.lesseeAsset =
      this._membrane.convertArgumentToProxy(
        this._lessorHandler,
        this._lesseeHandler,
        this._lessorAsset
    );
  }

  public unsubscribe(): void {
    console.log('TODO: Unsubscribe!');
  }
}

export class TaskWorker
{
  constructor(private readonly _leftChild: number, private readonly _rightChild: number) { }

  doTask(parent: Parent): void {
    const childOne = parent.getChild(this._leftChild);
    const nameOne = childOne.getName();

    const childTwo = parent.getChild(this._rightChild);
    childOne.setName(
      childTwo.getName()
    );
    childTwo.setName(nameOne);
  }
}


const factory = new AssetLeaseFactory();
const parentOne = new Parent('Clarice', 2);
const parentTwo = new Parent('Kyle', 4);
const parentThree = new Parent('Mason', 5);

const taskOne = new TaskWorker(1, 0);
const taskTwo = new TaskWorker(0, 3);
const taskThree = new TaskWorker(4, 2);

const leaseOne = factory.leaseAsset(taskOne,  parentOne);
const leaseTwo = factory.leaseAsset(taskTwo,  parentTwo);
const leaseThree = factory.leaseAsset(taskThree,  parentThree);

console.log(parentOne === leaseOne.lesseeAsset);
console.log(parentTwo === leaseTwo.lesseeAsset);
console.log(parentThree === leaseThree.lesseeAsset);

console.log('Parent/Task Action One');
console.log(parentOne.count(), parentOne.count(), parentOne.getChild(1), parentOne.getChild(0));
console.log(leaseOne.lesseeAsset.getChild(1), leaseOne.lesseeAsset.getChild(0));
console.log(leaseOne.lessee.doTask(leaseOne.lesseeAsset), parentOne.getChild(1), parentOne.getChild(0));

console.log('Parent/Task Action Two');
console.log(parentTwo.count(), parentTwo.count(), parentTwo.getChild(1), parentTwo.getChild(0));
console.log(leaseTwo.lesseeAsset.getChild(1), leaseTwo.lesseeAsset.getChild(0));
console.log(leaseTwo.lessee.doTask(leaseTwo.lesseeAsset), parentTwo.getChild(1), parentTwo.getChild(0));

console.log('Parent/Task Action Three');
console.log(parentThree.count(), parentThree.count(), parentThree.getChild(1), parentThree.getChild(0));
console.log(leaseThree.lesseeAsset.getChild(1), leaseThree.lesseeAsset.getChild(0));
console.log(leaseThree.lessee.doTask(leaseThree.lesseeAsset), parentThree.getChild(1), parentThree.getChild(0));
