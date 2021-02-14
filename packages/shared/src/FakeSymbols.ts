/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-mutable-exports */
type fakeSymbol = number | symbol;

export let FAKE_ELEMENT_TYPE: fakeSymbol = 0xeac7;
export let FAKE_PORTAL_TYPE: fakeSymbol = 0xeaca;
export let FAKE_FRAGMENT_TYPE: fakeSymbol = 0xeacb;
export let FAKE_STRICT_MODE_TYPE: fakeSymbol = 0xeacc;
export let FAKE_PROFILER_TYPE: fakeSymbol = 0xead2;
export let FAKE_PROVIDER_TYPE: fakeSymbol = 0xeacd;
export let FAKE_CONTEXT_TYPE: fakeSymbol = 0xeace;
export let FAKE_FORWARD_REF_TYPE: fakeSymbol = 0xead0;
export let FAKE_SUSPENSE_TYPE: fakeSymbol = 0xead1;
export let FAKE_SUSPENSE_LIST_TYPE: fakeSymbol = 0xead8;
export let FAKE_MEMO_TYPE: fakeSymbol = 0xead3;
export let FAKE_LAZY_TYPE: fakeSymbol = 0xead4;
export let FAKE_SCOPE_TYPE: fakeSymbol = 0xead7;
export let FAKE_OPAQUE_ID_TYPE: fakeSymbol = 0xeae0;
export let FAKE_DEBUG_TRACING_MODE_TYPE: fakeSymbol = 0xeae1;
export let FAKE_OFFSCREEN_TYPE: fakeSymbol = 0xeae2;
export let FAKE_LEGACY_HIDDEN_TYPE: fakeSymbol = 0xeae3;
export let FAKE_CACHE_TYPE: fakeSymbol = 0xeae4;

if (typeof Symbol === 'function' && Symbol.for) {
  const symbolFor = Symbol.for;
  FAKE_ELEMENT_TYPE = symbolFor('fake.element');
  FAKE_PORTAL_TYPE = symbolFor('fake.portal');
  FAKE_FRAGMENT_TYPE = symbolFor('fake.fragment');
  FAKE_STRICT_MODE_TYPE = symbolFor('fake.strict_mode');
  FAKE_PROFILER_TYPE = symbolFor('fake.profiler');
  FAKE_PROVIDER_TYPE = symbolFor('fake.provider');
  FAKE_CONTEXT_TYPE = symbolFor('fake.context');
  FAKE_FORWARD_REF_TYPE = symbolFor('fake.forward_ref');
  FAKE_SUSPENSE_TYPE = symbolFor('fake.suspense');
  FAKE_SUSPENSE_LIST_TYPE = symbolFor('fake.suspense_list');
  FAKE_MEMO_TYPE = symbolFor('fake.memo');
  FAKE_LAZY_TYPE = symbolFor('fake.lazy');
  FAKE_SCOPE_TYPE = symbolFor('fake.scope');
  FAKE_OPAQUE_ID_TYPE = symbolFor('fake.opaque.id');
  FAKE_DEBUG_TRACING_MODE_TYPE = symbolFor('fake.debug_trace_mode');
  FAKE_OFFSCREEN_TYPE = symbolFor('fake.offscreen');
  FAKE_LEGACY_HIDDEN_TYPE = symbolFor('fake.legacy_hidden');
  FAKE_CACHE_TYPE = symbolFor('fake.cache');
}

const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
const FAUX_ITERATOR_SYMBOL = '@@iterator';

export function getIteratorFn(maybeIterable?: any): any {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }
  const maybeIterator =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}
