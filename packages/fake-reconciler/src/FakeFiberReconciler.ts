import { FakeNodeList } from 'shared/src/FakeTypes';
import { Container } from 'fake-dom/src/FakeDOMHostConfig';
import { createFiberRoot } from './FakeFiberRoot';
import { FiberRoot } from './FakeInternalTypes';
import { RootTag } from './FakeRootTags';
import { scheduleUpdateOnFiber } from './FakeFiberWorkLoop';
import { createUpdate, enqueueUpdate } from './FakeUpdateQueue';

type OpaqueRoot = FiberRoot;

export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
): OpaqueRoot {
  return createFiberRoot(containerInfo, tag, hydrate);
}

export function updateContainer(
  element: FakeNodeList,
  container: OpaqueRoot,
  parentComponent: any,
  callback?: () => any,
) {
  console.log(parentComponent, 'updateContainer');
  const { current } = container;

  const update = createUpdate();
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = { element };

  if (callback !== null) {
    update.callback = callback;
  }

  enqueueUpdate(current, update, 0);
  scheduleUpdateOnFiber(current);
}
