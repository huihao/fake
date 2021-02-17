/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import { shouldSetTextContent } from 'fake-dom/src/FakeDOMHostConfig';
import {
  cloneChildFibers,
  mountChildFibers,
  reconcileChildFibers,
} from './FakeChildFiber';
import {
  Update,
  DidCapture,
  NoFlags,
  ForceUpdateForLegacySuspense,
  ContentReset,
  PerformedWork,
  Placement,
} from './FakeFiberFlags';
import { includesSomeLane, Lanes, NoLanes } from './FakeFiberLane';
import { Fiber, FiberRoot } from './FakeInternalTypes';
import {
  cloneUpdateQueue,
  initializeUpdateQueue,
  processUpdateQueue,
} from './FakeUpdateQueue';
import {
  CacheComponent,
  ClassComponent,
  ContextProvider,
  FunctionComponent,
  HostComponent,
  HostPortal,
  HostRoot,
  HostText,
  IndeterminateComponent,
  LegacyHiddenComponent,
  OffscreenComponent,
  Profiler,
  SuspenseComponent,
  SuspenseListComponent,
} from './FakeWorkTags';

import {
  hasContextChanged,
  pushTopLevelContextObject,
} from './FakeFiberContext';
import {
  prepareToReadContext,
  pushHostContainer,
  pushHostContext,
} from './FakeFiberHostContext';
import {
  disableLegacyContext,
  disableModulePatternComponents,
} from 'shared/src/FakeFeatureFlags';
import { StrictMode } from './FakeTypeOfMode';
import { bailoutHooks, renderWithHooks } from './FakeFiberHooks';
import { resolveDefaultProps } from './FakeFiberLazyComponent';

let didReceiveUpdate: boolean = false;

export function beginWork(
  current: any,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null | undefined {
  const updateLanes = workInProgress.lanes;

  // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderLanes,
      );
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case HostText:
      return updateHostText(current, workInProgress);
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      );
    }
  }
}

function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  pushHostContext(workInProgress);
  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also has access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  // markRef(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  return null;
}

function pushHostRootContext(workInProgress) {
  const root = workInProgress.stateNode as FiberRoot;
  if (root.pendingContext) {
    pushTopLevelContextObject(
      workInProgress,
      root.pendingContext,
      root.pendingContext !== root.context,
    );
  } else if (root.context) {
    // Should always be set
    pushTopLevelContextObject(workInProgress, root.context, false);
  }
  pushHostContainer(workInProgress, root.containerInfo);
}

function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);
  const updateQueue = workInProgress.updateQueue;
  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  const nextState = workInProgress.memoizedState;

  const root: FiberRoot = workInProgress.stateNode;

  // Caution: React DevTools currently depends on this property
  // being called "element".
  const nextChildren = nextState.element;
  if (nextChildren === prevChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  // Otherwise reset hydration state in case we aborted and resumed another
  // root.
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);

  return workInProgress.child;
}

function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies;
  }
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}

function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderLanes,
) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null;
    // Since this is conceptually a new fiber, schedule a Placement effect
    workInProgress.flags |= Placement;
  }

  const props = workInProgress.pendingProps;
  /*let context;
  if (!disableLegacyContext) {
    const unmaskedContext = getUnmaskedContext(
      workInProgress,
      Component,
      false,
    );
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  prepareToReadContext(workInProgress, renderLanes);*/
  let value;

  value = renderWithHooks(
    null,
    workInProgress,
    Component,
    props,
    null,
    renderLanes,
  );

  // React DevTools reads this flag.
  workInProgress.flags |= PerformedWork;

  if (
    // Run these checks in production only if the flag is off.
    // Eventually we'll delete this branch altogether.
    !disableModulePatternComponents &&
    typeof value === 'object' &&
    value !== null &&
    typeof value.render === 'function' &&
    value.$$typeof === undefined
  ) {
    // Proceed under the assumption that this is a class instance
    /*
    workInProgress.tag = ClassComponent;

    // Throw out any hooks that were used.
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;

    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    let hasContext = false;
    if (isLegacyContextProvider(Component)) {
      hasContext = true;
      pushLegacyContextProvider(workInProgress);
    } else {
      hasContext = false;
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null;

    initializeUpdateQueue(workInProgress);

    const getDerivedStateFromProps = Component.getDerivedStateFromProps;
    if (typeof getDerivedStateFromProps === 'function') {
      applyDerivedStateFromProps(
        workInProgress,
        Component,
        getDerivedStateFromProps,
        props,
      );
    }

    adoptClassInstance(workInProgress, value);
    mountClassInstance(workInProgress, Component, props, renderLanes);
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderLanes,
    );*/
  } else {
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;
    reconcileChildren(null, workInProgress, value, renderLanes);
    return workInProgress.child;
  }
}

function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderLanes,
) {
  let context;

  let nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    context,
    renderLanes,
  );

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  // React DevTools reads this flag.
  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

export function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}
