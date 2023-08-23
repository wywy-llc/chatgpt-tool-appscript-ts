import { hello } from '../src/example-module';

describe('example-module', () => {
  describe('hello', () => {
    it('Returns a hello message', () => {
      expect(hello()).toBe('Hello Apps Script!');
    });
  });
});
