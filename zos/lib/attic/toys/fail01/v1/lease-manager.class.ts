import {AsyncSink} from 'ix/asyncsink';
import {IRevocableProxyFactory} from './interfaces/revocable-proxy-factory.interface';
import {IDryAdapter} from './dry-adapter.interface';

export class LeaseManager<T>
{
   private reserved: boolean;

   private dryAdapter: IDryAdapter<T>;

   constructor(
      private readonly onAvailableSink: AsyncSink<T>,
      private readonly membraneFactory: IRevocableProxyFactory,
      private readonly wetArtifact: T)
   {
      this.reserved = false;
      this.dryAdapter =
         membraneFactory.getRevocableAdapter(wetArtifact);
      this.onAvailableSink.write(this);
   }

   public reserve(): T
   {
      if (this.reserved) {
         throw new Error('Not onAvailable!');
      }
      this.reserved = true;

      return this.dryAdapter.getDryProxy();
   }

   public release(): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      this.reserved = false;
      this.dryAdapter.revoke();
      this.dryAdapter =
         this.membraneFactory.getRevocableAdapter(this.wetArtifact);
      this.onAvailableSink.write(this);
      console.log('Wrote to onAvailable sink');
   }

   public getReservation(): T|false
   {
      return this.reserved ? this.dryAdapter.getDryProxy() : false;
   }
}