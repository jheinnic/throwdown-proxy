import {apolloStateKey, CacheState} from './apollo.state';

import {AppState, appStateKey} from './app.state';

export interface RootState extends PartialAppState, PartialApolloState {
}

type PartialAppState = {
  [key in appStateKey]: AppState
};

type PartialApolloState = {
  [key in apolloStateKey]: CacheState
};
