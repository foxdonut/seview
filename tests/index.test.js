/* eslint-env jest */

import { seview } from '../src/index';
import { isString } from '../src/util';

const transform = (node) => {
  if (isString(node)) {
    return node;
  }
  const children = node.children || [];
  const childrenObj = children.length > 0 ? { children } : {};

  return {
    type: node.tag,
    props: Object.assign({}, node.attrs, childrenObj)
  };
};

const h = seview(transform);

const p = seview((node) => {
  if (isString(node)) {
    return node;
  }
  const result = {
    nodeName: node.tag
  };
  if (node.attrs) {
    result.attributes = node.attrs;
  }
  if (node.children) {
    result.subs = node.children;
  }
  return result;
});

const f = seview((node) => {
  if (isString(node)) {
    return {
      type: '#text',
      nodeValue: node
    };
  }
  return {
    type: node.tag,
    attributes: node.attrs || {},
    content: node.children || []
  };
});

describe('seview index', () => {
  it('basicText', () => {
    expect(h(['div', { id: 'test' }, 'test']))
      .toEqual({
        type: 'div',
        props: { id: 'test', children: ['test'] }
      });
  });

  it('basicChildren', () => {
    expect(h(['div', { id: 'test' }, [
      ['div', {}, 'test1'],
      ['div', {}, 'test2']
    ]]))
      .toEqual({
        type: 'div',
        props: {
          id: 'test',
          children: [
            { type: 'div', props: { children: ['test1'] } },
            { type: 'div', props: { children: ['test2'] } }
          ]
        }
      });
  });

  it('justATag', () => {
    expect(h(['hr']))
      .toEqual({ type: 'hr', props: {} });
  });

  it('optionalAttrs', () => {
    expect(h(['div', 'test']))
      .toEqual({ type: 'div', props: { children: ['test'] } }
      );
  });

  it('optionalAttrsChildren', () => {
    expect(h(['div', [
      ['div', 'test1'],
      ['div', 'test2']
    ]]))
      .toEqual({
        type: 'div',
        props: {
          children: [
            { type: 'div', props: { children: ['test1'] } },
            { type: 'div', props: { children: ['test2'] } }
          ]
        }
      });
  });

  it('combineClass', () => {
    expect(h(['button.btn', { class: 'btn-default other' }]))
      .toEqual({
        type: 'button',
        props: { class: 'btn btn-default other' }
      });
  });

  it('combineClassWithDifferentProp', () => {
    expect(h(['button.btn', { class: 'btn-default other' }], { class: 'class' }))
      .toEqual({
        type: 'button',
        props: { class: 'btn btn-default other' }
      });
  });

  it('classToggles', () => {
    expect(h(['button.btn', { class: { 'btn-primary': true, 'btn-default': false } }]))
      .toEqual({
        type: 'button',
        props: { class: 'btn btn-primary' }
      });
  });

  it('classTogglesFalsy', () => {
    expect(h(['button.btn',
      { class: { 'btn-primary': true, 'one': null, 'two': undefined, 'three': 0 } }]))
      .toEqual({
        type: 'button',
        props: { class: 'btn btn-primary' }
      });
  });

  it('basicVarArgs', () => {
    expect(p(['div', {},
      ['div', 'test1'],
      ['div', 'test2']]))
      .toEqual({
        nodeName: 'div',
        subs: [
          { nodeName: 'div', subs: ['test1'] },
          { nodeName: 'div', subs: ['test2'] }
        ]
      });
  });

  it('varArgsNoAttrs', () => {
    expect(p(['div',
      ['div', 'test1'],
      ['div', 'test2']]))
      .toEqual({
        nodeName: 'div',
        subs: [
          { nodeName: 'div', subs: ['test1'] },
          { nodeName: 'div', subs: ['test2'] }
        ]
      });
  });

  it('oneVarArg', () => {
    expect(p(['div',
      ['div', 'test1']]))
      .toEqual({
        nodeName: 'div',
        subs: [
          { nodeName: 'div', subs: ['test1'] }
        ]
      });
  });

  it('mixedChildrenVarArgs', () => {
    expect(p(['div',
      'text 1',
      ['b', 'in bold']]))
      .toEqual({
        nodeName: 'div',
        subs: [
          'text 1',
          { nodeName: 'b', subs: ['in bold'] }
        ]
      });
  });

  it('mixedChildrenArray', () => {
    expect(p(['div', [
      ['b', 'in bold'],
      'text 2'
    ]]))
      .toEqual({
        nodeName: 'div',
        subs: [
          { nodeName: 'b', subs: ['in bold'] },
          'text 2'
        ]
      });
  });

  it('deeplyNestedChildren', () => {
    expect(p(['div',
      ['div',
        ['input:checkbox#sports', { checked: true }],
        ['label', { htmlFor: 'sports' }, 'Sports']]]))
      .toEqual({
        nodeName: 'div',
        subs: [
          {
            nodeName: 'div',
            subs: [
              {
                nodeName: 'input',
                attributes: { type: 'checkbox', id: 'sports', checked: true }
              },
              {
                nodeName: 'label',
                attributes: { htmlFor: 'sports' },
                subs: ['Sports']
              }
            ]
          }
        ]
      });
  });

  it('processTextNodes', () => {
    expect(f(['div',
      ['span', 'test']]))
      .toEqual({
        type: 'div',
        attributes: {},
        content: [
          {
            type: 'span',
            attributes: {},
            content: [
              {
                type: '#text',
                nodeValue: 'test'
              }
            ]
          }
        ]
      });
  });
});
