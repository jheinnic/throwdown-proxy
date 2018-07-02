import { Web3SubFeature as fromWeb3 } from './web3.reducer';

describe('Web3 Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = fromWeb3.reducer(fromWeb3.initialState, action);

      expect(result).toBe(fromWeb3.initialState);
    });
  });
});
