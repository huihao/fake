const Fake = require('fake/index');
const FakeDOM = require('../FakeDOM.ts');

/** @jsx Fake.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

describe('ReactDOM', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('allows a DOM element to be used with a string', () => {
    /** @jsx Fake.createElement */
    const element = <div>hello</div>;
    console.log(element);
    expect(element.type).toBe('div');
  });

  it('render can create a dom', () => {
    /** @jsx Fake.createElement */
    const element = (
      <span>
        <div>hello</div>
      </span>
    );
    const dom = document.createElement('div');
    dom.innerHTML = 'test';
    document.body.append(dom);
    FakeDOM.render(element, dom);
    console.log(document.body.innerHTML);
    expect(dom.innerHTML).toBe('<span><div>hello</div></span>');
  });
});
