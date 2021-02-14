/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { Fiber } from 'fake-reconciler/src/FakeInternalTypes';
import { Container, Instance, Props, TextInstance } from './FakeDOMHostConfig';

const randomKey = Math.random().toString(36).slice(2);

const internalContainerInstanceKey = `__reactContainer$${randomKey}`;
const internalInstanceKey = '__reactFiber$' + randomKey;
const internalPropsKey = '__reactProps$' + randomKey;

export function markContainerAsRoot(hostRoot: Fiber, node: Container): void {
  // eslint-disable-next-line no-param-reassign
  node[internalContainerInstanceKey] = hostRoot;
}
export function precacheFiberNode(
  hostInst: Fiber,
  node: Instance | TextInstance,
): void {
  (node as any)[internalInstanceKey] = hostInst;
}

export function updateFiberProps(
  node: Instance | TextInstance,
  props: Props,
): void {
  (node as any)[internalPropsKey] = props;
}
