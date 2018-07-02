import {bindCallback, defer} from 'rxjs';
import {TaskContentGenerator} from './task-content-generator.interface';
import {IntArrayModel} from './hash-model-adapter.class';
import * as process from "process";
import * as readline from 'readline';

export class IntArrayConsoleGenerator extends TaskContentGenerator<IntArrayModel>
{
  constructor() {
  }

  public allocateIterator(): IterableIterator<IntArrayModel>
  {
    return consoleGenerator();
  }
}



function* consoleGenerator()
{
  const i = readline.createInterface(process.stdin, process.stdout, null);
  const observeLineFn = bindCallback<string, string>(i.question);
  const sourceOfLines = defer( () => observeLineFn('next?'));

  sourceOfLines.subscribe(
    (line: string) => {
      yield new IntArrayModel(
        prefix,
        suffix,
        true,
      );
    }
  );
}
