/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-cycle */
/* eslint-disable import/order */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { RootType } from './FakeDOMRoot';
import {
  ELEMENT_NODE,
  DOCUMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from 'shared/src/HTMLNodeType';
import {
  createElement,
  createTextNode,
  diffProperties,
  setInitialProperties,
  updateProperties,
} from 'fake-dom/src/FakeDOMComponent';
import { precacheFiberNode, updateFiberProps } from './FakeDOMComponentTree';
import setTextContent from './setTextContent';
import { getChildNamespace } from './shared/DOMNamespaces';

export type NoTimeout = -1;
export const noTimeout = -1;
export type UpdatePayload = Array<any>;

export const cancelTimeout: any =
  typeof clearTimeout === 'function' ? clearTimeout : undefined;

export type Container =
  | (Element & { _fakeRootContainer?: RootType; [key: string]: any })
  | (Document & { _fakeRootContainer?: RootType; [key: string]: any });

export type Instance = Element;
export type TextInstance = Text;

type HostContextDev = {
  namespace: string;
  ancestorInfo: any;
  [key: string]: any;
};
type HostContextProd = string;
export type HostContext = HostContextDev | HostContextProd;

export type Type = string;
export type Props = {
  autoFocus?: boolean;
  children?: any;
  disabled?: boolean;
  hidden?: boolean;
  suppressHydrationWarning?: boolean;
  dangerouslySetInnerHTML?: any;
  style?: { display?: string; [key: string]: any };
  bottom?: null | number;
  left?: null | number;
  right?: null | number;
  top?: null | number;
  [key: string]: any;
};

export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  parentInstance.appendChild(child);
}

export function clearContainer(container: Container): void {
  if (container.nodeType === ELEMENT_NODE) {
    (container as Element).textContent = '';
  } else if (container.nodeType === DOCUMENT_NODE) {
    const body = (container as Document).body;
    if (body != null) {
      body.textContent = '';
    }
  }
}

export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance,
): void {
  parentInstance.insertBefore(child, beforeChild);
}

export function appendChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  parentInstance.appendChild(child);
}

export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    (container.parentNode as any).insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}

export function appendChildToContainer(
  container: Container,
  child: Instance | TextInstance,
): void {
  let parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode as any;
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  }
  // This container might be used for a portal.
  // If something inside a portal is clicked, that click should bubble
  // through the React tree. However, on Mobile Safari the click would
  // never bubble through the *DOM* tree unless an ancestor with onclick
  // event exists. So we wouldn't see it and dispatch it.
  // This is why we ensure that non React root containers have inline onclick
  // defined.
  // https://github.com/facebook/react/issues/11918
  const reactRootContainer = container._fakeRootContainer;
  if (
    (reactRootContainer === null || reactRootContainer === undefined) &&
    parentNode.onclick === null
  ) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
    // trapClickOnNonInteractiveElement(((parentNode: any): HTMLElement));
  }
}

export function prepareUpdate(
  domElement: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext | null,
): null | Array<any> {
  return diffProperties(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
  );
}

export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: any,
): Instance {
  let parentNamespace: string;

  parentNamespace = (hostContext as any) as HostContextProd;

  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}

function shouldAutoFocusHostComponent(type: string, props: Props): boolean {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
  }
  return false;
}

export function finalizeInitialChildren(
  domElement: Instance,
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): boolean {
  setInitialProperties(domElement, type, props, rootContainerInstance);
  return shouldAutoFocusHostComponent(type, props);
}

export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<any>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
): void {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  updateFiberProps(domElement, newProps);
  // Apply the diff to the DOM node.
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}

export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string,
): void {
  textInstance.nodeValue = newText;
}

export function resetTextContent(domElement: Instance): void {
  setTextContent(domElement, '');
}

export function removeChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  parentInstance.removeChild(child);
}

export function removeChildFromContainer(
  container: Container,
  child: Instance | TextInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    (container.parentNode as any).removeChild(child);
  } else {
    container.removeChild(child);
  }
}

export function shouldSetTextContent(type: string, props: Props): boolean {
  return (
    type === 'textarea' ||
    type === 'option' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  );
}

export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: any,
): TextInstance {
  const textNode: TextInstance = createTextNode(text, rootContainerInstance);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}

export function getRootHostContext(
  rootContainerInstance: Container,
): HostContext {
  let type;
  let namespace;
  const nodeType = rootContainerInstance.nodeType;
  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE: {
      type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
      const root = (rootContainerInstance as any).documentElement;
      namespace = root ? root.namespaceURI : getChildNamespace(null, '');
      break;
    }
    default: {
      const container: any =
        nodeType === COMMENT_NODE
          ? rootContainerInstance.parentNode
          : rootContainerInstance;
      const ownNamespace = container.namespaceURI || null;
      type = container.tagName;
      namespace = getChildNamespace(ownNamespace, type);
      break;
    }
  }
  return namespace;
}

export function getChildHostContext(
  parentHostContext: HostContext,
  type: string,
  rootContainerInstance: Container,
): HostContext {
  const parentNamespace = (parentHostContext as any) as HostContextProd;
  return getChildNamespace(parentNamespace, type);
}
