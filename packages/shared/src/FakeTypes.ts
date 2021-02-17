import { FakeElement } from './FakeElementType';

export type FakeNode = FakeElement | FakeText;

export type FakeEmpty = null | void | boolean;

export type FakeText = string | number;

export type FakeNodeList = FakeEmpty | FakeNode;

export type FakeProviderType<T> = {
  $$typeof: Symbol | number;
  _context: FakeContext<T>;
  [key: string]: any;
};

export type FakeContext<T> = {
  $$typeof: Symbol | number;
  Consumer: FakeContext<T>;
  Provider: FakeProviderType<T>;
  _calculateChangedBits: ((a: T, b: T) => number) | null;
  _currentValue: T;
  _currentValue2: T;
  _threadCount: number;
  // DEV only
  _currentRenderer?: Object | null;
  _currentRenderer2?: Object | null;
  // This value may be added by application code
  // to improve DEV tooling display names
  displayName?: string;
  [key: string]: any;
};
