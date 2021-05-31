const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const BlockStorage = require('../services/BlockStorage');
const logger = require('../utils/logger');
const promiseAllWithErrorCheck = require('../utils/promiseAllWithErrorCheck');

const COMPONENT_IMPORTS_FLAG = `/* %% COMPONENT IMPORTS %% */`;
const COMPONENT_MAP_FLAG = `/* %% COMPONENT MAP %% */`;

async function renderTemplate(name, bundleId, precomputed) {
  try {
    const templateSource = await fs.readFile(path.join(__dirname, `/entrypointTemplates/${name}.js`));
    const filled = `${templateSource}`
      .replace(COMPONENT_IMPORTS_FLAG, precomputed.importStatements)
      .replace(COMPONENT_MAP_FLAG, precomputed.componentMap);

    const result = await BlockStorage.writeFile(`/bundles/${bundleId}/${name}.js`, filled);
    if (result instanceof Error) throw result;
  } catch (error) {
    return error;
  }
}

async function entrypointGenerator(page, bundleId) {
  logger.info('Generating entrypoints...');

  const { components } = page;

  const customComponentNames = {};

  const importStatements = Object.keys(components)
    .map((id) => {
      const component = components[id];
      const uniqueName = `Component${crypto.randomUUID().replace(/-/g, '')}`;
      customComponentNames[id] = uniqueName;

      return `import { ${component.name} as ${uniqueName} } from '${component.package}';`;
    })
    .join('\n');

  const componentMappings = Object.keys(components)
    .map((componentId) => `"${componentId}": ${customComponentNames[componentId]},`)
    .join('\n');

  const componentMap = `const components = {
    ${componentMappings}
  }`;

  const precomputed = {
    importStatements,
    componentMap,
  };

  const result = await promiseAllWithErrorCheck(
    renderTemplate('hydrate', bundleId, precomputed),
    renderTemplate('ssr', bundleId, precomputed),
  );

  return result;
}

module.exports = entrypointGenerator;
