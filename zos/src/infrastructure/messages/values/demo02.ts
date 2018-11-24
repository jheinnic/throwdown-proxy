import {mixin} from '@jchptf/api';
import {AbstractHeaders} from './abstract-headers.value';

const aa = Symbol('aa');
const bb = Symbol('bb');
const cc = Symbol('cc');

export class FF extends AbstractHeaders {
   [aa]: number[] = [6, 3, 7];
   [bb]: string = "far";
   [cc]: boolean = false;

   static create(): FF {
      return new FF();
   }
}

export interface IFF extends FF { }

const ff = mixin<IFF, { create: () => IFF }>(FF.create().withAll({
   [aa]: [4, 5, 6],
   [bb]: "new",
   [cc]: true
}), FF );

const da = Symbol('da');
const eb = Symbol('eb');
const fc = Symbol('fc');
// @ts-ignore
const gd = Symbol('gd');

console.log('f');

export class GG extends AbstractHeaders {
   [da]: number = 99;
   [eb]: typeof bb = bb;
   [fc]: [string, boolean] = ["one", false];

   static createGG(): GG {
      return new GG();
   }
}

export interface IGG extends GG { }

const gg = mixin<IGG>(GG.createGG().withAll({
   [da]: 64,
   [eb]: bb,
   [fc]: ["left", true]
}), { createGG: GG.createGG } );


export const HHF = gg(FF);
export const HH = ff(GG);
export let hh: IFF & IGG = HH.create();
export const hh2 = hh.withAll({
   [aa]: [1, 2, 3],
   [bb]: "abc",
   [cc]: false,
   [da]: 6,
   [eb]: bb,
   [fc]: ["abc", true]
   // gd: "f",
   // [gd]: "ddd"
});

console.log(Object.getOwnPropertySymbols(hh));
console.log(Object.getOwnPropertySymbols(hh2));
console.log(hh[aa]);
console.log(hh[da]);
console.log(hh2[aa]);
console.log(hh2[da]);

