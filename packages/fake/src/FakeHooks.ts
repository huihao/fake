import { Dispatcher } from 'fake-reconciler/src/FakeInternalTypes';
import FakeSharedInternals from './FakeSharedInternals';

type BasicStateAction<S> = ((S) => S) | S;
type Dispatch<A> = (A) => void;

const { FakeCurrentDispatcher } = FakeSharedInternals;

function resolveDispatcher() {
  const dispatcher = FakeCurrentDispatcher.current;
  // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.
  return (dispatcher as any) as Dispatcher;
}

export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
