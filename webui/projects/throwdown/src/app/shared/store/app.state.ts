export interface AppState {
  thing: string;
}

export const appInitialState: AppState = {
  thing: 'initial'
};

export const appStateKey = 'app';

export type appStateKey = 'app';
