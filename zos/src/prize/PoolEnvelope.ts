class PoolEnvelope {
   constructor( private readonly seedIndex: number ) {
   }

   getSeedIndex(): number {
      return this.seedIndex;
   }
}