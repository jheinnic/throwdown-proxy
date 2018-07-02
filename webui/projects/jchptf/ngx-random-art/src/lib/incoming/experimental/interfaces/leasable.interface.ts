interface AssetLease<L, A>
{
  readonly lessee: L;
  readonly asset: A;
}

export class LeasableAsset<A> {
  public reserveFor<L>(lessee: L): AssetLease<L, A> {

  }
}
