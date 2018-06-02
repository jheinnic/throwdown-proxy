import {Gradient} from './shared/model/gradient.interface';

export interface GradientToken {
  name(): Promise<string>;
  symbol(): Promise<string>;
  totalSupply(): Promise<number>;
  tokenURI(gradientId: number): Promise<string>;
  tokenByIndex(index: number): Promise<number>;
  tokenOfOwnerByIndex(owner: any, index: number, options: any): Promise<number>;

  getGradient(gradientId: number): Promise<Gradient>;
  mint(outer: string, inner: string, options: any): Promise<any>; // void;
}

