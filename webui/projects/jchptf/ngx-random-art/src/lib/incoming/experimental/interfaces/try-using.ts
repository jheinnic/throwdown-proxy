import {defer, from, Observable, of, timer, using} from 'rxjs';
import {delayWhen, mergeMap, map, delay, repeat, take, tap} from 'rxjs/operators';

class Disposable
{
  private _disposed: boolean;

  private _observableAsset: Observable<string>;

  constructor(private readonly asset: string, private readonly message: string)
  {
    this._disposed = false;
    this._observableAsset = of(asset).pipe(
      delay(1250), repeat(4)
    );
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

function makeFactoryN(label: string): () => Disposable
{
  return () => {
    return new Disposable('Asset ' + label, 'Disposal ' + label);
  };
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

/*
const sourceOne = deferFactory(factoryOne, 'SubscriptionOne');
const sourceTwo = deferFactory(factoryTwo, 'SubscriptionTwo');
const sourceThree = deferFactory(factoryThree, 'SubscriptionThree');

const competition = race(sourceTwo, sourceThree, sourceOne);

const sub = competition.pipe(take(1))
  .subscribe(
    (asset: string) => {
      console.log('Race for assets yields:', asset);
      sub.unsubscribe();
      console.log('Unsubscribe');
    },
    (err: any) => {
      console.error(err);
    },
    () => { console.log('Competition subscriber completes'); }
  );
*/


let subTwo, subThree;

subTwo = from('abcdefghijklmnopqrstuvwxyz')
  .pipe(
    map((src: string) => using(makeFactoryN(src), openDisposableSource), 4),
    tap((value: string) => {console.log('Feeding observer ' + value + ' BEFORE post-merge delay'); }),
    delay(8000),
    tap((value: string) => {console.log('Feeding observer ' + value + ' AFTER post-merge delay'); })
  ).subscribe(
    (asset: string) => {
      console.log('Asset merger yields:', asset);
    },
    (err: any) => {
      console.error(err);
    },
    () => {
      console.log('Competition subscriber completes');
      // subTwo.unsubscribe();
    }
  );

subThree = from('abcdefghijklmnopqrstuvwxyz')
  .pipe(
    mergeMap((src: string) => using(makeFactoryN(src), openDisposableSource), 4),
    tap((value: string) => {console.log('Feeding observer ' + value + ' BEFORE post-merge delay'); }),
    delay(8000),
    tap((value: string) => {console.log('Feeding observer ' + value + ' AFTER post-merge delay'); })
  ).subscribe(
    (asset: string) => {
      console.log('Asset merger yields:', asset);
    },
    (err: any) => {
      console.error(err);
    },
    () => {
      console.log('Competition subscriber completes');
      // subTwo.unsubscribe();
    }
  );
