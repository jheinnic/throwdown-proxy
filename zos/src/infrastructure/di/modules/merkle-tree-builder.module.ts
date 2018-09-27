// import {diModule} from '../decorators/di-module.decorator';
// import {MODULES} from './modules';
import {AbstractDIModule} from '../abstract-di-module.class';

// @diModule(MODULES.MerkleTreeBuilder)
export class MerkleTreeBuilderModule extends AbstractDIModule {

}


type Prev<T extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T]

type LengthOf<T extends any[]> = T extends { length: infer N } ? N : never

type LastOf<T extends any[]> = T[Prev<LengthOf<T>>]

function someRandomFunction( r: boolean, t: number, z: string[] ): void {
   console.log(r, t, z);
}

type Params<T> = T extends (...args: infer P ) => any ? P : never

const weAreString: LastOf<Params<typeof someRandomFunction>> = [ "lllllfff", "fgsgs" ];

console.log(typeof weAreString);

