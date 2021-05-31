import React from 'react';
import { renderToString } from 'react-dom/server';

import renderPageComponents from './helpers/renderPageComponents';

/* %% COMPONENT IMPORTS %% */

/* %% COMPONENT MAP %% */

export default function ssr(page, initialData) {
  return renderToString(
    renderPageComponents(
      React.createElement,
      page,
      components,
      initialData,
    ),
  );
}
