import { createElement } from '../FakeElement';

describe('FakeElement', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('allows a string to be passed as the type', () => {
    const element = createElement('div');
    expect(element.type).toBe('div');
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
    expect(element.props).toEqual({});
  });
});
