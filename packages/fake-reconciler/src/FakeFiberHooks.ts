import { Lane, Lanes } from './FakeFiberLane';
import { FakePriorityLevel } from './FakeInternalTypes';

type Update<S, A> = {
  lane: Lane;
  action: A;
  eagerReducer: ((S, A) => S) | null;
  eagerState: S | null;
  next: Update<S, A>;
  priority?: FakePriorityLevel;
};

export type UpdateQueue<S, A> = {
  pending: Update<S, A> | null;
  interleaved: Update<S, A> | null;
  lanes: Lanes;
  dispatch: (action: A) => any | null;
  lastRenderedReducer: ((state: S, action: A) => S) | null;
  lastRenderedState: S | null;
};
