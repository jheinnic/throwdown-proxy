import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {apolloReducer} from 'apollo-angular-cache-ngrx';


import {environment} from '../../environments/environment';
import {RootState} from '../shared/store';
import {appReducer} from './app.reducer';

export const reducers: ActionReducerMap<RootState> = {
  app: appReducer,
  apollo: apolloReducer
};

export const metaReducers: MetaReducer<RootState>[] = !environment.production ? [] : [];
