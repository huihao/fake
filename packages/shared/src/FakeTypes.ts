import { FakeElement } from './FakeElementType';

export type FakeNode = FakeElement | FakeText;

export type FakeEmpty = null | void | boolean;

export type FakeText = string | number;

export type FakeNodeList = FakeEmpty | FakeNode;
