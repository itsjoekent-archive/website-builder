import React from 'react';
import { hydrate } from 'react-dom';

import renderPageComponents from './helpers/renderPageComponents';

/* %% COMPONENT IMPORTS %% */

/* %% COMPONENT MAP %% */

hydrate(
  renderPageComponents(
    React.createElement,
    window.__page,
    components,
    window.__initialData || {},
  ),
  document.getElementById('root'),
);
