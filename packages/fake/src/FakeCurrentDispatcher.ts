import { Dispatcher } from 'fake-reconciler/src/FakeInternalTypes';

/**
 * Keeps track of the current dispatcher.
 */
const FakeCurrentDispatcher = {
  /**
   * @internal
   * @type {FakeComponent}
   */
  current: null as null | Dispatcher,
};

export default FakeCurrentDispatcher;
