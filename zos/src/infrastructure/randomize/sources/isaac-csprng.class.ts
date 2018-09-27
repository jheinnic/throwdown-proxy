/*///////////////////////////////////////////////////////////////////////////////////////////////////
isaacCSPRNG 1.1
/////////////////////////////////////////////////////////////////////////////////////////////////////
https://github.com/macmcmeans/isaacCSPRNG/blob/master/isaacCSPRNG-1.1.js
/////////////////////////////////////////////////////////////////////////////////////////////////////
This is a derivative work copyright (c) 2018, William P. "Mac" McMeans, under BSD license.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of isaacCSPRNG nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
Original work copyright (c) 2012 Yves-Marie K. Rinquin, under MIT license.
https://github.com/rubycon/isaac.js
///////////////////////////////////////////////////////////////////////////////////////////////////*/
import randombytes from 'randombytes';

export class IsaacCSPRNG
{
   private static readonly _version: string = '1.1';

   private m: number[] = new Array(256);

   private r: number[] = new Array(256);

   private acc: number;

   private brs: number;

   private cnt: number;

   private gnt: number;

   constructor(userSeed: number | string | number[])
   {
      ////////////////////////////////////////////////////
      /* initial random seed */
      var internalSeed = userSeed;
      if (!userSeed) {
         internalSeed = new Array(2);
         var uinta = randombytes(8);
         internalSeed[0] = uinta.readUInt32BE(0);
         internalSeed[1] = uinta.readUInt32BE(4);
      }

      this.acc = this.brs = this.cnt = this.gnt = 0;
      this.seed(internalSeed);
   }

   ////////////////////////////////////////////////////
   /* private: 32-bit integer safe adder */


   /* private:  return data converted from hex string */
   private _hexDecode(data: string)
   {
      let j: number;
      let hexes: string[] = data.match(/.{1,4}/g) || [];
      let back: string = '';

      for (j = 0; j < hexes.length; j++) {
         back += String.fromCharCode(parseInt(hexes[j], 16));
      }

      return back;
   };


   /* private: return data converted to hex string */
   private _hexEncode(data: string): string
   {
      let i: number;
      let result = '';
      for (i = 0; i < data.length; i++) {
         const hex: string = data.charCodeAt(i)
            .toString(16);
         result += ('000' + hex).slice(-4);
      }

      return result;
   };


   /* private: return the CSPRNG _internals in an object (for get/set) */
   private _internals()
   {
      return {
         a: this.acc,
         b: this.brs,
         c: this.cnt,
         m: this.m,
         r: this.r,
         g: this.gnt
      };
   };


   /* private: check if number is integer */
   private static _isInteger(n: number|string): boolean
   {
      if (typeof n === 'string') {
         return false
      } else {
         return Math.ceil(n) === n;
      }
   };


   /* private: convert string to integer array */

   /* js string (ucs-2/utf16) to a 32-bit integer (utf-8 chars, little-endian) array */
   private static _toIntArray(str: string): number[]
   {
      let w1: number;
      let w2: number;

      // TODO: Does anything really happen with u??
      let u: number;

      const r4: number[] = [];
      let r: number[] = [];
      let i: number = 0;

      // pad string to avoid discarding last chars
      let s: string = str + '\0\0\0';
      let l: number = s.length - 1;

      while (i < l) {
         w1 = s.charCodeAt(i++);
         w2 = s.charCodeAt(i + 1);

         // 0x0000 - 0x007f code point: basic ascii
         if (w1 < 0x0080) {
            r4.push(w1);
         } else

         // 0x0080 - 0x07ff code point
         if (w1 < 0x0800) {
            r4.push(((w1 >>> 6) & 0x1f) | 0xc0);
            r4.push(((w1 >>> 0) & 0x3f) | 0x80);
         } else
         // 0x0800 - 0xd7ff / 0xe000 - 0xffff code point
         if ((w1 & 0xf800) != 0xd800) {
            r4.push(((w1 >>> 12) & 0x0f) | 0xe0);
            r4.push(((w1 >>> 6) & 0x3f) | 0x80);
            r4.push(((w1 >>> 0) & 0x3f) | 0x80);
         } else
         // 0xd800 - 0xdfff surrogate / 0x10ffff - 0x10000 code point
         if (((w1 & 0xfc00) == 0xd800) && ((w2 & 0xfc00) == 0xdc00)) {
            u = ((w2 & 0x3f) | ((w1 & 0x3f) << 10)) + 0x10000;
            r4.push(((u >>> 18) & 0x07) | 0xf0);
            r4.push(((u >>> 12) & 0x3f) | 0x80);
            r4.push(((u >>> 6) & 0x3f) | 0x80);
            r4.push(((u >>> 0) & 0x3f) | 0x80);
            i++;
         } else {
            // invalid char
            console.warn('Invalid character!');
         }

         /* _add integer (four utf-8 value) to array */
         if (r4.length > 3) {
            // little endian
            const r4a: number|undefined = r4.shift();
            const r4b: number|undefined = r4.shift();
            const r4c: number|undefined = r4.shift();
            const r4d: number|undefined = r4.shift();

            r.push(
               (!!r4a ? r4a << 0 : 0) |
               (!!r4b ? r4b << 8 : 0) |
               (!!r4c ? r4c << 16 : 0) |
               (!!r4d ? r4d << 24 : 0)
            );
         }
      }

      return r;
   };


   /* private: return a Vernam (XOR) transform of msg */
   private _vernam(msg: string): string
   {
      let out: string = '';
      for (let i = 0; i < msg.length; i++) {
         const ra: number = this.range(33, 126);
         out += String.fromCharCode(ra ^ msg.charCodeAt(i));
      }

      return out;
   };


   /* public: return an array of amount elements consisting of unsigned random integers in the range [0, 255] */
   public bytes(amount: number): Uint8Array
   {
      const out: Uint8Array = new Uint8Array(amount);

      for (let i = 0; i < amount; i++) {
         out[i] = this.range(255);
      }

      return out;
   };


   private static readonly strChars: string =
      ' ~`_-+={}[]<>/,.:;?|!@#$%^&*()0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';


   /* public: return a string of length (safe) characters consisting of random 7-bit ASCII graphemes */
   public chars(length: number): string
   {
      //var str = "
      // ~`'\"_-+={}[]<>/\\,.:;?|!@#$%^&*()0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      let out: string = '';

      for (let i = 0; i < length; i++) {
         out += IsaacCSPRNG.strChars[this.range(0, IsaacCSPRNG.strChars.length - 1)];
      }

      return out;
   };


   /* public: return vernam transform on ciphertext string data/hex string data */
   public decipher(key: string|number|number[], msg: string, flag: number): string
   {
      this.seed(key);

      // TODO: And with 0x01 bit-mask before testing flag!
      if (flag === 1) {
         return this._vernam(this._hexDecode(msg));
      } else {
         return this._vernam(msg);
      }
   };


   /* public: return a 53-bit fraction in the range [0, 1] */
   public double(): number
   {
      return this.random() + (
         this.random() * 0x200000 | 0
      ) * 1.1102230246251565e-16; // 2^-53
   };


   /* public: return vernam transform on plaintext string data/hex string data */
   public encipher(key: string|number|number[], msg: string, flag: number): string
   {
      this.seed(key);

      // TODO: And with 0x01 bit-mask before testing flag!
      if (flag === 1) {
         return this._hexEncode(
            this._vernam(msg));

      } else {
         return this._vernam(msg);
      }
   }


   /* public: export object describing CSPRNG internal state */
   public get()
   {
      return JSON.stringify(this._internals());
   };


   /* public: return an unsigned random integer in the range [0, 2^32] */
   public int32(): number
   {
      const _r: number = this.rand();
      return _r < 0 ? -_r : _r;
   };


   /* public: expose internals */
   public internals()
   {
      return {
         a: this.acc,
         b: this.brs,
         c: this.cnt,
         m: this.m,
         r: this.r
      };
   }


   /* public: isaac generator, n = number of runs */
   public prng(n: number = 1)
   {
      let i, x, y;

      while (n-- > 0) {
         this.cnt = SeedMixer._add(this.cnt, 1);
         this.brs = SeedMixer._add(this.brs, this.cnt);

         for (i = 0; i < 256; i++) {
            switch (i & 3) {
               case 0:
                  this.acc ^= this.acc << 13;
                  break;
               case 1:
                  this.acc ^= this.acc >>> 6;
                  break;
               case 2:
                  this.acc ^= this.acc << 2;
                  break;
               case 3:
                  this.acc ^= this.acc >>> 16;
                  break;
            }

            this.acc = SeedMixer._add(this.m[(i + 128) & 0xff], this.acc);
            x = this.m[i];
            this.m[i] = y =
               SeedMixer._add(this.m[(x >>> 2) & 0xff], SeedMixer._add(this.acc, this.brs));
            this.r[i] = this.brs =
               SeedMixer._add(this.m[(y >>> 10) & 0xff], x);
         }
      }
   }


   /* public: return a signed random integer in the range [-2^31, 2^31] */
   public rand(): number
   {
      if (! this.gnt--) {
         this.prng();
         this.gnt = 255;
      }

      return this.r[this.gnt];
   }


   /* public: return a 32-bit fraction in the range [0, 1] */
   public random(): number
   {
      return 0.5 + this.rand() * 2.3283064365386963e-10; // 2^-32
   };


   /* public: return inclusive range */
   public range(loBound: number, hiBound?: number): number
   {
      if (hiBound === undefined) {
         hiBound = loBound;
         loBound = 0;
      }

      if (loBound > hiBound) {
         loBound = loBound + hiBound;
         hiBound = loBound - hiBound;
         loBound = loBound - hiBound;
      }

      // return integer
      if (IsaacCSPRNG._isInteger(loBound) && IsaacCSPRNG._isInteger(hiBound)) {
         return Math.floor(this.random() * (hiBound - loBound + 1)) + loBound;
      } else {
         // return float
         return this.random() * (hiBound - loBound) + loBound;
      }
   };


   /* public: zeroize the CSPRNG */
   public reset()
   {
      this.acc = this.brs = this.cnt = 0;

      for (var i = 0; i < 256; ++i) {
         this.m[i] = this.r[i] = 0;
      }

      this.gnt = 0;
   };


   /* public: seeding function */
   public seed(seed: string | number | number[])
   {
      let seedArray: number[];
      if (seed) {
         if (typeof seed === 'string') {
            seedArray = IsaacCSPRNG._toIntArray(seed);
         } else if (typeof seed === 'number') {
            seedArray = [seed];
         } else {
            seedArray = seed;
         }
      } else {
         seedArray = [];
      }

      this.reset();

      const scrambler = new SeedMixer(seedArray, this.r, this.m);
      scrambler.run_seeding();

      /* fill in the first set of results */
      this.prng();

      /* prepare to use the first set of results */
      this.gnt = 256;
   }


   /* public: import object and use it to set CSPRNG internal state */
   public set(incoming: string)
   {
      const imported = JSON.parse(incoming);
      this.acc = imported.a;
      this.brs = imported.b;
      this.cnt = imported.c;
      this.m = imported.m;
      this.r = imported.r;
      this.gnt = imported.g;
   }


   /* public: show version */
   public version(): string
   {
      return IsaacCSPRNG._version;
   }
}

/* private: seed mixer */
class SeedMixer
{
   private a: number;

   private b: number;

   private c: number;

   private d: number;

   private e: number;

   private f: number;

   private g: number;

   private h: number;

   constructor(private readonly seed: number[], private readonly r: number[], private readonly m: number[])
   {
      /* seeding the seeds of love */
      this.a = this.b = this.c = this.d = this.e = this.f = this.g = this.h =
         /* the golden ratio ( 2654435769 ),
         see https://stackoverflow.com/questions/4948780/magic-number-in-boosthash-combine
         */
         0x9e3779b9;
   }

   static _add(x: number, y: number): number
   {
      let lsb = (x & 0xffff) + (y & 0xffff);
      let msb = (x >>> 16) + (y >>> 16) + (lsb >>> 16);

      return (msb << 16) | (lsb & 0xffff);
   };

   public run_seeding()
   {
      this.spread_to_r();

      /* scramble it */
      this.seed_mix();
      this.seed_mix();
      this.seed_mix();
      this.seed_mix();

      this.spread_to_m();

      /* do a second pass to make all of the seed affect all of m[] */
      this.spread_to_m();
   }

   private spread_to_m()
   {
      for (let i = 0; i < 256; i += 8) {
         /* use all the information in the seed */
         this.a = SeedMixer._add(this.a, this.r[i + 0]);
         this.b = SeedMixer._add(this.b, this.r[i + 1]);
         this.c = SeedMixer._add(this.c, this.r[i + 2]);
         this.d = SeedMixer._add(this.d, this.r[i + 3]);
         this.e = SeedMixer._add(this.e, this.r[i + 4]);
         this.f = SeedMixer._add(this.f, this.r[i + 5]);
         this.g = SeedMixer._add(this.g, this.r[i + 6]);
         this.h = SeedMixer._add(this.h, this.r[i + 7]);

         this.seed_mix();

         /* fill in m[] with messy stuff */
         this.m[i + 0] = this.a;
         this.m[i + 1] = this.b;
         this.m[i + 2] = this.c;
         this.m[i + 3] = this.d;
         this.m[i + 4] = this.e;
         this.m[i + 5] = this.f;
         this.m[i + 6] = this.g;
         this.m[i + 7] = this.h;
      }
   }

   private spread_to_r()
   {
      for (let i = 0; i < this.seed.length; i++) {
         this.r[i & 0xff] += this.seed[i];
      }
   }

   private seed_mix()
   {
      this.a ^= this.b << 11;
      this.d = SeedMixer._add(this.d, this.a);
      this.b = SeedMixer._add(this.b, this.c);
      this.b ^= this.c >>> 2;
      this.e = SeedMixer._add(this.e, this.b);
      this.c = SeedMixer._add(this.c, this.d);
      this.c ^= this.d << 8;
      this.f = SeedMixer._add(this.f, this.c);
      this.d = SeedMixer._add(this.d, this.e);
      this.d ^= this.e >>> 16;
      this.g = SeedMixer._add(this.g, this.d);
      this.e = SeedMixer._add(this.e, this.f);
      this.e ^= this.f << 10;
      this.h = SeedMixer._add(this.h, this.e);
      this.f = SeedMixer._add(this.f, this.g);
      this.f ^= this.g >>> 4;
      this.a = SeedMixer._add(this.a, this.f);
      this.g = SeedMixer._add(this.g, this.h);
      this.g ^= this.h << 8;
      this.b = SeedMixer._add(this.b, this.g);
      this.h = SeedMixer._add(this.h, this.a);
      this.h ^= this.a >>> 9;
      this.c = SeedMixer._add(this.c, this.h);
      this.a = SeedMixer._add(this.a, this.b);
   }
}

// Export the Underscore object for **CommonJS**, with backwards-compatibility
// for the old `require()` API. If we're not in CommonJS, add `_` to the
// global object.
// if (typeof module !== 'undefined' && module.exports) {
//    module.exports = isaacCSPRNG;
//    root.isaacCSPRNG = isaacCSPRNG;
//    isNode = true;
// } else {
//    root.isaacCSPRNG = isaacCSPRNG;
// }
