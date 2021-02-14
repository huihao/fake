import { FAKE_ELEMENT_TYPE } from 'shared/src/FakeSymbols';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

export function createElement(
  type: any,
  config?: Record<string, any>,
  ...children: any[]
) {
  let propName;

  // Reserved names are extracted
  const props: Record<string, any> = {};

  let key = null;
  let ref = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return FakeElement(type, key, ref, null, props);
}

export function FakeElement(
  type: string,
  key: string | object | null,
  ref: string | object | null,
  owner: any,
  props: any,
) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: FAKE_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
  return element;
}

function hasValidRef(config: Record<string, any>) {
  return config.ref !== undefined;
}
function hasValidKey(config: Record<string, any>) {
  return config.key !== undefined;
}
