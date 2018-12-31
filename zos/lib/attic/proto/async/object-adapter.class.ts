import {Canvas} from 'canvas';

export class Thing {
   private value: number;

   constructor( ) {
      this.value = 0;
   }

   public addOne(): void {
      this.value = this.value + 1;
   }

   public report(): number {
      return this.value;
   }
}

export class Pool {
   private managers = new Array<CanvasManager>();
   private reserved = new Array<CanvasManager>();
   private returning = new Array<CanvasManager>();

   register(canvas: Canvas) {
      const manager = new CanvasManager(this, canvas);
      this.managers.push(manager);
   }

   getHandler(): CanvasLease {
      return new CanvasLease(this);
   }

   public reserveCanvas(param: CanvasLease)
   {
      if (this.managers.length <= 0) {
         this.managers.push(
            ...this.returning.splice(0)
         );
      }
      const mgr = this.managers.pop();
      if (mgr !== undefined) {
         this.reserved.push(mgr);
         mgr.assignTo(param);
      }
   }

   public releaseCanvas(param: CanvasManager) {
      this.returning.push(param);
   }
}

export class CanvasLease {
   private canvas?: Canvas
   private manager?: CanvasManager;

   constructor( private readonly pool: Pool ) { }

   public reserve(): Canvas {
      this.pool.reserveCanvas(this);
      return this.canvas!;
   }

   public release(): void {
      this.pool.releaseCanvas(this.manager!);
   }

   public borrow(callback: (canvas: Canvas) => void): void
   {
      const canvas: Canvas = this.reserve();
      callback(canvas);
      this.release();
   }

   assign(canvas: Canvas, manager: CanvasManager): void {
      this.canvas = canvas;
      this.manager = manager;
   }

   revoke(): Canvas {
      const retVal = this.canvas;
      this.canvas = undefined;
      return retVal!;
   }
}

export class CanvasManager
{
   private lessee?: CanvasLease;

   constructor( _pool: Pool, private readonly canvas: Canvas ) {
   }

   assignTo(lease: CanvasLease): void {
      lease.assign(this.canvas, this);
      this.lessee = lease;
   }

   revokeFrom(): Canvas {
      const retVal = this.lessee!.revoke();
      this.lessee = undefined;
      return retVal;
   }
}

export class Worker
{
   private lease: CanvasLease;

   constructor(pool: Pool) {
      this.lease = pool.getHandler();
   }

   doWork() {
      function working (canvas: Canvas) {
            console.log(canvas);
      };

      this.lease.borrow(working);
   }
}