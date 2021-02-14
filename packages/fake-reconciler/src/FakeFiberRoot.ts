/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createHostRootFiber } from './FakeFiber';
import { FiberRoot } from './FakeInternalTypes';
import { RootTag } from './FakeRootTags';
import { initializeUpdateQueue } from './FakeUpdateQueue';

function FiberRootNode(this: any, containerInfo: any, tag: any, hydrate: any) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
}

export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
): FiberRoot {
  const root: FiberRoot = new (FiberRootNode as any)(
    containerInfo,
    tag,
    hydrate,
  );

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  const initialState = {
    element: null,
  };
  uninitializedFiber.memoizedState = initialState;

  initializeUpdateQueue(uninitializedFiber);

  return root;
}
