import {Gradient} from './gradient.interface';

export interface GradientToken {
  name(): string;
  symbol(): string;
  totalSupply(): number;
  tokenURI(gradientId: number): string;
  tokenByIndex(index: number): number;
  tokenOfOwnerByIndex(owner: any, index: number): number;

  getGradient(gradientId: number): Gradient;
  mint(outer: string, inner: string, options: any): Promise<any>; // void;
}

