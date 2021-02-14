/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-cycle */
import { FakeNodeList } from 'shared/src/FakeTypes';
import { FiberRoot } from 'fake-reconciler/src/FakeInternalTypes';
import {
  createContainer,
  updateContainer,
} from 'fake-reconciler/src/FakeFiberReconciler';
import { RootTag, LegacyRoot } from 'fake-reconciler/src/FakeRootTags';
import { Container } from './FakeDOMHostConfig';
import { markContainerAsRoot } from './FakeDOMComponentTree';

export type RootType = {
  render: (children: FakeNodeList) => void;
  unmount: () => void;
  _internalRoot: FiberRoot;
};

function FakeDOMBlockingRoot(
  this: any,
  container: Container,
  tag: RootTag,
  options: any,
) {
  this._internalRoot = createRootImpl(container, tag, options);
}

FakeDOMBlockingRoot.prototype.render = function (children: FakeNodeList): void {
  const root = this._internalRoot;
  updateContainer(children, root, null);
};

export function createLegacyRoot(
  container: Container,
  options?: any,
): RootType {
  return new (FakeDOMBlockingRoot as any)(container, LegacyRoot, options);
}

function createRootImpl(container: Container, tag: RootTag, options: any) {
  console.log(options);
  const root = createContainer(container, tag, false);
  markContainerAsRoot(root.current, container);

  return root;
}
