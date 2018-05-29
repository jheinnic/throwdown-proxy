import {muteFirst as staticMuteFirst} from '../../internal/observable/mute-first';

declare module 'rxjs/internal/Observable' {
  namespace Observable {
    let muteFirst: typeof staticMuteFirst;
  }
}
