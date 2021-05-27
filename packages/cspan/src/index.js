function deconstruct(createElement, level, components, initialData) {
  return level.map((componentDescription) => {
    const { id, children } = componentDescription;

    const componentRenderFunction = components[id] || null;
    const initialProps = initialData[id] || {};
    const props = { ...initialProps, key: id };

    const childElements = (!!children && !!children.length) 
      ? deconstruct(createElement, children, components, initialData) 
      : null;

    return createElement(
      componentRenderFunction || null,
      props,
      childElements,
    );
  });
}

/**
 * Render a page.
 * 
 * @param {Function} createElement Virtual dom function to create an element. 
 *    Should accept the standard `component, props, ...children arguments.
 * @param {Object} page JSON representation of the page layout.
 * @param {Object} components Key value map of component ID's and render functions
 * @param {*} initialData Key value map of component ID's and initial data to render with
 * @returns Virtual dom element
 */
export default function render(createElement, page, components, initialData) {
  if (!page || !page.layout) {
    throw new Error('Failed to render page, invalid "page" syntax.');
  }

  const rootElement = createElement(
    'div', 
    null, 
    deconstruct(
      createElement,
      page.layout,
      components,
      initialData,
    ),
  );

  return rootElement;
}