/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-multi-assign */
import { updateContainer } from 'fake-reconciler/src/FakeFiberReconciler';
import { FakeElement } from 'shared/src/FakeElementType';
import { FakeNodeList } from 'shared/src/FakeTypes';
import { Container } from './FakeDOMHostConfig';
import { RootType, createLegacyRoot } from './FakeDOMRoot';

function legacyRenderSubtreeIntoContainer(
  parentComponent: any,
  children: FakeNodeList,
  container: Container,
  forceHydrate: boolean,
  callback?: () => void,
) {
  let root: RootType | undefined = container._fakeRootContainer;
  let fiberRoot;
  if (!root) {
    console.log(root);
    // Initial mount
    root = container._fakeRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;

    updateContainer(children, fiberRoot, parentComponent, callback);
  } else {
    fiberRoot = root._internalRoot;

    updateContainer(children, fiberRoot, parentComponent, callback);
  }
}

function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  const shouldHydrate = forceHydrate;
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}

export function render(
  element: FakeElement,
  container: Element,
  callback?: () => void,
) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
