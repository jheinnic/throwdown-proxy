import {defer, fromEvent, merge, Observable, of, Subject} from 'rxjs';
import {delay, finalize, switchMap, ignoreElements, scan, share, takeUntil, tap} from 'rxjs/operators';
import {exponential} from 'backoff';
import * as readline from 'readline';

const backoff = exponential({
  initialDelay: 500,
  maxDelay: 3000,
  factor: 1.6
});
const onBackoffReady = fromEvent(backoff, 'ready');
backoff.on('backoff', function(delay) {
  console.log('Backing off for ', delay);
});

/*
const backoffSource = defer(function() {
  setTimeout(backoff.backoff.bind(backoff), 0);
  return onBackoffReady;
});
}).subscribe(
    function(ready) { topic.next('ready'); backoff.backoff(); },
    function(err) { topic.error(err); },
    function() { topic.complete(); }
  );
}
*/

const resetTopicIn = new Subject<any>();
// const resetTopicOut = resetTopicIn.pipe(share());

const topicIn = new Subject<number>();
const topicOut: Observable<number> = topicIn.pipe(
  scan((agg: number, value: number) => {
    console.log('Post:', value);
    return agg + 1;
  }, 0)
);

// let nextId = 1;
const stopTrigger = defer(function() {
  setTimeout(function() {
    backoff.reset();
    backoff.backoff();
  }, 0);
  return onBackoffReady;
}).pipe(
// const stopTrigger = onBackoffReady.pipe(
  scan((agg: number, value: any): number => {
    const retVal = agg + 1;
    console.log('Making API Call ', retVal);
    return retVal;
  }, 0),
  // switchMap((value: number) => {
    // backoff.backoff();
    // return of(value).pipe(
  delay(5000),
    // );
  // }),
  takeUntil(resetTopicIn),
  finalize(function () {
    console.log('Abort final work');
    resetTopicIn.next('stop');
    backoff.reset();
  }),
  tap(function(value) {
    console.log('Sending action to receive API Call ', value);
    backoff.backoff();
    topicIn.next(value);
  }),
  ignoreElements()
);

const adaptedTopic = merge(stopTrigger, topicOut, 2)
  .pipe(
    // takeUntil(resetTopicOut),
    tap(function (value: number) {
      if ((
        value % 12
      ) === 0)
      {
        console.log('Resetting timer on 12th');
        backoff.reset();
        backoff.backoff();
      }
    }),
    share()
  );

function makeConsumer(id)
{
  return function consume(value) {
    console.log(id, ' consumes ', value);
  };
}

function makeTerminal(id)
{
  return function onComplete() {
    console.log(id, ' completes');
  };
}

const subOne = adaptedTopic.subscribe(makeConsumer('One'), undefined, makeTerminal('One'));
const subTwo = adaptedTopic.subscribe(makeConsumer('Two'), undefined, makeTerminal('Two'));
let subThree;
let subFour;
let subFive;
let subSix;

const term = readline.createInterface(process.stdin);
term.once('line', function(line0) {
  backoff.backoff();
  term.once('line', function (line) {
    subOne.unsubscribe();
    term.once('line', function (line2) {
      subThree = adaptedTopic.subscribe(makeConsumer('Three'), undefined, makeTerminal('Three'));
      subTwo.unsubscribe();
      term.once('line', function (line3) {
        subThree.unsubscribe();
        subFour = adaptedTopic.subscribe(makeConsumer('Four'), undefined, makeTerminal('Four'));
        term.once('line', function (line4) {
          subFour.unsubscribe();
          subFive = adaptedTopic.subscribe(makeConsumer('Five'), undefined, makeTerminal('Five'));
          term.once('line', function (line5) {
            subFive.unsubscribe();
            term.once('line', function (line6) {
              subSix = adaptedTopic.subscribe(makeConsumer('Six'), undefined, makeTerminal('Six'));
              term.once('line', function (line7) {
                subSix.unsubscribe();
              });
            });
          });
        });
      });
    });
  });
});
