import {defer, fromEvent, merge, Observable, Subject} from 'rxjs';
import {delay, ignoreElements, scan, share, startWith, tap} from 'rxjs/operators';
import {exponential} from 'backoff';
import * as readline from 'readline';

const backoff = exponential({
  initialDelay: 3000,
  maxDelay: 80000,
  factor: 1.3
});
const onBackoffReady = fromEvent(backoff, 'ready');
backoff.on('backoff', function (numTrys, delayMs, err) {
  console.log('Backing off for ', delayMs, ' after ', numTrys, ' attempts.');
});

const topicIn = new Subject<number>();
const topicOut: Observable<number> = topicIn.pipe(
  scan((agg: number, value: number) => {
    console.log('Post:', value);
    return agg + 1;
  }, 0)
);

// let nextId = 1;
const stopTrigger = defer(function () {
  return onBackoffReady.pipe(
    // startWith(null),
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
    // takeUntil(resetTopicIn),
    // finalize(function () {
    //   console.log('Abort final work');
    //   resetTopicIn.next('stop');
    //   backoff.reset();
    // }),
    tap(function (value) {
      console.log('Sending action to receive API Call ', value);
      topicIn.next(value);
      console.log('Sent action to receive API Call ', value);
      backoff.backoff();
    }),
    ignoreElements()
  );
});

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
        console.log('Reset timer after 12th');
        // backoff.backoff();
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
backoff.reset();
backoff.backoff();
let subTwo;
let subThree;
let subFour;
let subFive;
let subSix;

const term = readline.createInterface(process.stdin);
term.once('line', function (line0) {
  subTwo = adaptedTopic.subscribe(makeConsumer('Two'), undefined, makeTerminal('Two'));
  backoff.reset();
  backoff.backoff();
  // backoff.backoff();
  term.once('line', function (line) {
    subOne.unsubscribe();
    term.once('line', function (line2) {
      subThree = adaptedTopic.subscribe(makeConsumer('Three'), undefined, makeTerminal('Three'));
      backoff.reset();
      backoff.backoff();
      subTwo.unsubscribe();
      term.once('line', function (line3) {
        subThree.unsubscribe();
        subFour = adaptedTopic.subscribe(makeConsumer('Four'), undefined, makeTerminal('Four'));
        backoff.reset();
        backoff.backoff();
        term.once('line', function (line4) {
          subFour.unsubscribe();
          subFive = adaptedTopic.subscribe(makeConsumer('Five'), undefined, makeTerminal('Five'));
          backoff.reset();
          backoff.backoff();
          term.once('line', function (line5) {
            subFive.unsubscribe();
            term.once('line', function (line6) {
              subSix = adaptedTopic.subscribe(makeConsumer('Six'), undefined, makeTerminal('Six'));
              backoff.reset();
              backoff.backoff();
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

