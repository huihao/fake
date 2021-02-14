import { disableLegacyContext } from 'shared/src/FakeFeatureFlags';
import { createCursor, push, StackCursor } from './FakeFiberStack';
import { Fiber } from './FakeInternalTypes';

export const emptyContextObject = {};
// A cursor to the current merged context object on the stack.
const contextStackCursor: StackCursor<Object> = createCursor(
  emptyContextObject,
);
// A cursor to a boolean indicating whether the context has changed.
const didPerformWorkStackCursor: StackCursor<boolean> = createCursor(false);

export function pushTopLevelContextObject(
  fiber: Fiber,
  context: Object,
  didChange: boolean,
): void {
  if (disableLegacyContext) {
    return;
  } else {
    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }
}

export function hasContextChanged(): boolean {
  if (disableLegacyContext) {
    return false;
  } else {
    return didPerformWorkStackCursor.current;
  }
}
