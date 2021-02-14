import { FakeNode } from './FakeTypes';
export type FakeElement = {
  $$typeof: any;
  type: any;
  key: any;
  ref: any;
  props: any;
  _owner?: any;
};

export interface FakeComponent<Props, State = void> {
  // fields

  props: Props;
  state: State;

  // action methods

  setState(partialState: any, callback?: () => void): void;

  forceUpdate(callback?: () => void): void;

  // lifecycle methods

  constructor(props?: Props, context?: any): void;
  render(): FakeNode;
  componentWillMount(): any;
  UNSAFE_componentWillMount(): any;
  componentDidMount(): any;
  componentWillReceiveProps(nextProps: Props, nextContext: any): any;
  UNSAFE_componentWillReceiveProps(nextProps: Props, nextContext: any): any;
  shouldComponentUpdate(
    nextProps: Props,
    nextState: State,
    nextContext: any,
  ): boolean;
  componentWillUpdate(
    nextProps: Props,
    nextState: State,
    nextContext: any,
  ): any;
  UNSAFE_componentWillUpdate(
    nextProps: Props,
    nextState: State,
    nextContext: any,
  ): any;
  componentDidUpdate(prevProps: Props, prevState: State, prevContext: any): any;
  componentWillUnmount(): any;
  componentDidCatch(error: any, info: { componentStack: string }): any;

  // long tail of other stuff not modeled very well

  refs: any;
  context: any;

  // We don't add a type for `defaultProps` so that its type may be entirely
  // inferred when we diff the type for `defaultProps` with `Props`. Otherwise
  // the user would need to define a type (which would be redundant) to override
  // the type we provide here in the base class.
  //
  // static defaultProps: $Shape<Props>;
}
