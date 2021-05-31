/**
 * Render a page.
 *
 * @param {Function} createElement Virtual dom function to create an element.
 *    Should accept the standard `component, props, ...children arguments.
 * @param {Object} page JSON representation of the page layout.
 * @param {Object} components Key value map of component ID's and render functions.
 * @param {Object} initialData Key value map of component ID's and initial data to render with.
 * @param {Function} [wrapperComponent=null] Optional component to wrap every parent component.
 * @returns Array of virtual dom elements
 */
function deconstruct(createElement, level, components, initialData, wrapperComponent) {
  return level.map((componentDescription) => {
    const { id, children } = componentDescription;

    const componentRenderFunction = components[id] || null;
    const initialProps = initialData[id] || {};

    // TODO: Fix this to account for react components with $$typeof property
    // if (!!componentRenderFunction && typeof componentRenderFunction !== 'function') {
    //   throw new Error(`Invalid render function given for component id:${id}`);
    // }

    const childElements =
      !!children && !!children.length
        ? deconstruct(createElement, children, components, initialData, wrapperComponent)
        : null;

    if (!!wrapperComponent) {
      return createElement(
        wrapperComponent,
        { key: id },
        createElement(componentRenderFunction, initialProps, childElements)
      );
    }

    const props = { ...initialProps, key: id };

    return createElement(componentRenderFunction, props, childElements, wrapperComponent);
  });
}

/**
 * Render a page.
 *
 * @param {Function} createElement Virtual dom function to create an element.
 *    Should accept the standard `component, props, ...children arguments.
 * @param {Object} page JSON representation of the page layout.
 * @param {Object} components Key value map of component ID's and render functions.
 * @param {Object} initialData Key value map of component ID's and initial data to render with.
 * @param {Function} [wrapperComponent=null] Optional component to wrap every parent component.
 * @returns Virtual dom element
 */
export default function render(createElement, page, components, initialData, wrapperComponent = null) {
  if (!createElement || typeof createElement !== 'function') {
    throw new Error('Invalid createElement argument');
  }

  if (!page || typeof page !== 'object' || !page.layout) {
    throw new Error('Failed to render page, invalid "page" syntax.');
  }

  if (!components || typeof components !== 'object') {
    throw new Error('Invalid components argument');
  }

  if (!initialData || typeof initialData !== 'object') {
    throw new Error('Invalid initialData argument');
  }

  if (!!wrapperComponent && typeof wrapperComponent !== 'function') {
    throw new Error('Invalid wrapperComponent argument');
  }

  const rootElement = createElement(
    'div',
    null,
    deconstruct(createElement, page.layout, components, initialData, wrapperComponent)
  );

  return rootElement;
}
