// @ts-ignore
import * as urad from "unique-random-at-depth";

const src = urad(1, Math.pow(2, 29)-1, 1500000);
const dst = new Set();

for( let ii=0; ii<1500000; ii++ ) {
   const val = src();
   if (dst.has(val)) {
      console.log(`Collision on ${val} at ${ii} !!!`);
   } else {
      dst.add(val);
   }
}