import React from 'react';
import renderer from 'react-test-renderer';
import cspanRenderer from '../src';

test('Renders the tree as expected', () => {
  const RootElement = cspanRenderer(
    React.createElement,
    {
      layout: [
        {
          id: '1',
          children: [
            {
              id: '2',
            },
            {
              id: '3',
              children: [
                {
                  id: '4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      '1': (props) => React.createElement('div', props),
      '2': (props) => React.createElement('h1', null, null, props.title),
      '3': (props) => React.createElement('div', props),
      '4': (props) => React.createElement('p', null, props.subtitle),
    },
    {
      '2': { title: 'Test title' },
      '4': { subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
    },
  );

  const component = renderer.create(RootElement);

  expect(JSON.stringify(component.toJSON())).toEqual(`{"type":"div","props":{},"children":[{"type":"div","props":{},"children":[{"type":"h1","props":{},"children":["Test title"]},{"type":"div","props":{},"children":[{"type":"p","props":{},"children":["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]}]}]}]}`);
});

test('Renders the tree with a wrapper component as expected', () => {
  const RootElement = cspanRenderer(
    React.createElement,
    {
      layout: [
        {
          id: '1',
          children: [
            {
              id: '2',
            },
            {
              id: '3',
              children: [
                {
                  id: '4',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      '1': (props) => React.createElement('div', props),
      '2': (props) => React.createElement('h1', null, null, props.title),
      '3': (props) => React.createElement('div', props),
      '4': (props) => React.createElement('p', null, props.subtitle),
    },
    {
      '2': { title: 'Test title' },
      '4': { subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
    },
    ({ children }) => React.createElement('article', null, children),
  );

  const component = renderer.create(RootElement);
  expect(JSON.stringify(component.toJSON())).toEqual(`{"type":"div","props":{},"children":[{"type":"article","props":{},"children":[{"type":"div","props":{},"children":[{"type":"article","props":{},"children":[{"type":"h1","props":{},"children":["Test title"]}]},{"type":"article","props":{},"children":[{"type":"div","props":{},"children":[{"type":"article","props":{},"children":[{"type":"p","props":{},"children":["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]}]}]}]}]}]}]}`);
});

test('Throws error for invalid page data', () => {
  expect(() => cspanRenderer()).toThrow();
  expect(() => cspanRenderer(React.createElement)).toThrow();
  expect(() => cspanRenderer(React.createElement, {})).toThrow();
  expect(() => cspanRenderer(React.createElement, { layout: [] })).toThrow();
  expect(() => cspanRenderer(React.createElement, { layout: [] }, '')).toThrow();
  expect(() => cspanRenderer(React.createElement, { layout: [] }, {})).toThrow();
  expect(() => cspanRenderer(React.createElement, { layout: [] }, {}, 1)).toThrow();
});