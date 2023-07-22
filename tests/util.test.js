/* eslint-env jest */

import {
  isString, isNumber, isBoolean, isArray, isIterable, isObject, get, set,
  getString, getTagProperties, nodeDef
} from '../src/util';

const string = 'test';
const number = 42;
const boolean = false;
const object = { key: 'value' };
const array = ['div', 'test'];
const iter = new Set(['div', 'test']);
const func = (x) => x;

describe('seview util', () => {
  describe('isString', () => {
    it('is true for string', () => {
      expect(isString(string)).toEqual(true);
    });

    it('is false for number', () => {
      expect(isString(number)).toEqual(false);
    });

    it('is false for boolean', () => {
      expect(isString(boolean)).toEqual(false);
    });

    it('is false for object', () => {
      expect(isString(object)).toEqual(false);
    });

    it('is false for array', () => {
      expect(isString(array)).toEqual(false);
    });

    it('is false for iterable', () => {
      expect(isString(iter)).toEqual(false);
    });

    it('is false for function', () => {
      expect(isString(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isString(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isString(undefined)).toEqual(false);
    });
  });

  describe('isNumber', () => {
    it('is false for string', () => {
      expect(isNumber(string)).toEqual(false);
    });

    it('is true for number', () => {
      expect(isNumber(number)).toEqual(true);
    });

    it('is false for boolean', () => {
      expect(isNumber(boolean)).toEqual(false);
    });

    it('is false for object', () => {
      expect(isNumber(object)).toEqual(false);
    });

    it('is false for array', () => {
      expect(isNumber(array)).toEqual(false);
    });

    it('is false for iterable', () => {
      expect(isNumber(iter)).toEqual(false);
    });

    it('is false for function', () => {
      expect(isNumber(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isNumber(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isNumber(undefined)).toEqual(false);
    });

  });

  describe('isBoolean', () => {
    it('is false for string', () => {
      expect(isBoolean(string)).toEqual(false);
    });

    it('is false for number', () => {
      expect(isBoolean(number)).toEqual(false);
    });

    it('is true for boolean', () => {
      expect(isBoolean(boolean)).toEqual(true);
    });

    it('is false for object', () => {
      expect(isBoolean(object)).toEqual(false);
    });

    it('is false for array', () => {
      expect(isBoolean(array)).toEqual(false);
    });

    it('is false for iterable', () => {
      expect(isBoolean(iter)).toEqual(false);
    });

    it('is false for function', () => {
      expect(isBoolean(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isBoolean(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isBoolean(undefined)).toEqual(false);
    });
  });

  describe('isArray', () => {
    it('is false for string', () => {
      expect(isArray(string)).toEqual(false);
    });

    it('is false for number', () => {
      expect(isArray(number)).toEqual(false);
    });

    it('is false for boolean', () => {
      expect(isArray(boolean)).toEqual(false);
    });

    it('is false for object', () => {
      expect(isArray(object)).toEqual(false);
    });

    it('is true for array', () => {
      expect(isArray(array)).toEqual(true);
    });

    it('is false for iterable', () => {
      expect(isArray(iter)).toEqual(false);
    });

    it('is false for function', () => {
      expect(isArray(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isArray(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isArray(undefined)).toEqual(false);
    });
  });

  describe('isIterable', () => {
    it('is false for string', () => {
      expect(isIterable(string)).toEqual(false);
    });

    it('is false for number', () => {
      expect(isIterable(number)).toEqual(false);
    });

    it('is false for boolean', () => {
      expect(isIterable(boolean)).toEqual(false);
    });

    it('is false for object', () => {
      expect(isIterable(object)).toEqual(false);
    });

    it('is false for array', () => {
      expect(isIterable(array)).toEqual(true);
    });

    it('is true for Set', () => {
      expect(isIterable(iter)).toEqual(true);
    });

    it('is false for function', () => {
      expect(isIterable(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isIterable(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isIterable(undefined)).toEqual(false);
    });
  });

  describe('isObject', () => {
    it('is false for string', () => {
      expect(isObject(string)).toEqual(false);
    });

    it('is false for number', () => {
      expect(isObject(number)).toEqual(false);
    });

    it('is false for boolean', () => {
      expect(isObject(boolean)).toEqual(false);
    });

    it('is true for object', () => {
      expect(isObject(object)).toEqual(true);
    });

    it('is false for array', () => {
      expect(isObject(array)).toEqual(false);
    });

    it('is false for iterable', () => {
      expect(isObject(iter)).toEqual(false);
    });

    it('is false for function', () => {
      expect(isObject(func)).toEqual(false);
    });

    it('is false for null', () => {
      expect(isObject(null)).toEqual(false);
    });

    it('is false for undefined', () => {
      expect(isObject(undefined)).toEqual(false);
    });
  });

  describe('getString', () => {
    it('basic', () => {
      expect(getString(string)).toEqual(string);
    });

    it('excluded', () => {
      expect([
        getString(undefined),
        getString(null),
        getString(''),
        getString(false),
        getString(['test']),
        getString({ id: 'test' })
      ])
        .toEqual([undefined, undefined, undefined, undefined, undefined, undefined]);
    });

    it('included', () => {
      expect([getString(42), getString(NaN), getString(Infinity), getString(true)])
        .toEqual(['42', 'NaN', 'Infinity', 'true']);
    });
  });

  describe('get', () => {
    it('basic', () => {
      expect(get({ tag: 'div' }, ['tag'])).toEqual('div');
    });

    it('deep', () => {
      expect(get({ attrs: { onClick: func } }, ['attrs', 'onClick'])).toEqual(func);
    });

    it('noValue', () => {
      expect(get({ tag: 'div' }, ['type'])).toBeUndefined();
    });

    it('noPath', () => {
      expect(get({ tag: 'div' }, ['type', 'value'])).toBeUndefined();
    });
  });

  describe('set', () => {
    it('basic', () => {
      expect(set({ tag: 'div' }, ['tag'], 'span'))
        .toEqual({ tag: 'span' });
    });

    it('deep', () => {
      expect(set({ attrs: { onClick: null } }, ['attrs', 'onClick'], func))
        .toEqual({ attrs: { onClick: func } });
    });

    it('noValue', () => {
      expect(set({ tag: 'input' }, ['type'], 'password'))
        .toEqual({ tag: 'input', type: 'password' });
    });

    it('noPath', () => {
      expect(set({ tag: 'input' }, ['attrs', 'type'], 'password'))
        .toEqual({ tag: 'input', attrs: { type: 'password' } });
    });

    it('merge', () => {
      expect(set({ tag: 'input', props: { id: 'test' } }, ['props', 'children'], ['test']))
        .toEqual({ tag: 'input', props: { id: 'test', children: ['test'] } });
    });
  });

  describe('getTagProperties', () => {
    it('divByDefault', () => {
      expect(getTagProperties(''))
        .toEqual({
          tag: 'div'
        });
    });

    it('divByDefaultWithClass', () => {
      expect(getTagProperties('.btn'))
        .toEqual({
          tag: 'div',
          attrs: { class: 'btn' }
        });
    });

    it('divByDefaultWithId', () => {
      expect(getTagProperties('#home'))
        .toEqual({
          tag: 'div',
          attrs: { id: 'home' }
        });
    });

    it('customTag', () => {
      expect(getTagProperties('my-tag09.home'))
        .toEqual({
          tag: 'my-tag09',
          attrs: { class: 'home' }
        });
    });

    it('all', () => {
      expect(getTagProperties('input:password#duck.quack.yellow[name=pwd][required]'))
        .toEqual({
          tag: 'input',
          attrs: {
            type: 'password',
            id: 'duck',
            class: 'quack yellow',
            name: 'pwd',
            required: true
          }
        });
    });

    it('valueWithSpaces', () => {
      expect(getTagProperties('input[placeholder=Enter your name here]'))
        .toEqual({
          tag: 'input',
          attrs: { placeholder: 'Enter your name here' }
        });
    });

    it('extraTypesIgnored', () => {
      expect(getTagProperties('input:text:password.form-input'))
        .toEqual({
          tag: 'input',
          attrs: { type: 'text', class: 'form-input' }
        });
    });

    it('optionForClass', () => {
      expect(getTagProperties('input.form-input', 'class'))
        .toEqual({
          tag: 'input',
          attrs: { class: 'form-input' }
        });
    });
  });

  describe('nodeDef', () => {
    it('basicText', () => {
      expect(nodeDef(['div', { width: '100%' }, 'test']))
        .toEqual({
          tag: 'div',
          attrs: { width: '100%' },
          children: ['test']
        });
    });

    it('basicChildren', () => {
      expect(nodeDef(['div', { id: 'test' }, [
        ['div', 'test1'],
        ['div', 'test2']
      ]]))
        .toEqual({
          tag: 'div',
          attrs: { id: 'test' },
          children: [
            { tag: 'div', children: ['test1'] },
            { tag: 'div', children: ['test2'] }
          ]
        });
    });

    it('uppercaseTag', () => {
      expect(nodeDef(['MY-DIV', 'test']))
        .toEqual({
          tag: 'MY-DIV',
          children: ['test']
        });
    });

    it('basicIterable', () => {
      expect(nodeDef(['div', { id: 'test' }, new Set([
        ['span[key=a]', 'hi'],
        ['span[key=b]', 'bye']
      ])]))
        .toEqual({
          tag: 'div',
          attrs: { id: 'test' },
          children: [
            { tag: 'span', attrs: { key: 'a' }, children: ['hi'] },
            { tag: 'span', attrs: { key: 'b' }, children: ['bye'] }
          ]
        });
    });

    it('nestedArrays', () => {
      expect(nodeDef(['div', [
        ['div', 'test1'],
        [
          ['div', 'test2'],
          ['div', 'test3']
        ],
        [],
        [[]],
        [
          ['div', 'test4'],
          [
            ['div', 'test5']
          ]
        ]
      ]]))
        .toEqual({
          tag: 'div',
          children: [
            { tag: 'div', children: ['test1'] },
            { tag: 'div', children: ['test2'] },
            { tag: 'div', children: ['test3'] },
            { tag: 'div', children: ['test4'] },
            { tag: 'div', children: ['test5'] }
          ]
        });
    });

    it('nestedArraysVarargs', () => {
      expect(nodeDef(['div',
        ['div', 'test1'],
        [
          ['div', 'test2'],
          ['div', 'test3']
        ],
        [],
        [[]],
        [
          ['div', 'test4'],
          [
            ['div', 'test5']
          ]
        ]]))
        .toEqual({
          tag: 'div',
          children: [
            { tag: 'div', children: ['test1'] },
            { tag: 'div', children: ['test2'] },
            { tag: 'div', children: ['test3'] },
            { tag: 'div', children: ['test4'] },
            { tag: 'div', children: ['test5'] }
          ]
        });
    });

    it('justATag', () => {
      expect(nodeDef(['hr'])).toEqual({ tag: 'hr' });
    });

    it('tagWithNumber', () => {
      expect(nodeDef(['span', 0])).toEqual({ tag: 'span', children: ['0'] });
    });

    it('oneVarArg', () => {
      expect(nodeDef(['div',
        ['div', 'test1']]))
        .toEqual({
          tag: 'div',
          children: [
            { tag: 'div', children: ['test1'] }
          ]
        });
    });

    it('mixedChildrenVarArgs', () => {
      expect(nodeDef(['div',
        'text 1',
        42,
        undefined,
        null,
        false,
        [],
        [[]],
        '',
        true,
        NaN,
        Infinity,
        ['b', 'in bold']]))
        .toEqual({
          tag: 'div',
          children: [
            'text 1',
            '42',
            'true',
            'NaN',
            'Infinity',
            { tag: 'b', children: ['in bold'] }
          ]
        });
    });

    it('combineAttrs', () => {
      expect(nodeDef(['input[name=duck]', { value: 'quack' }]))
        .toEqual({
          tag: 'input',
          attrs: { name: 'duck', value: 'quack' }
        });
    });

    it('combineAttrsOverride', () => {
      expect(nodeDef(['input:text#one[name=horse]', { type: 'password', id: 'two', name: 'duck' }]))
        .toEqual({
          tag: 'input',
          attrs: { type: 'password', id: 'two', name: 'duck' }
        });
    });

    it('combineClass', () => {
      expect(nodeDef(['button.btn', { class: 'btn-default other' }]))
        .toEqual({
          tag: 'button',
          attrs: { class: 'btn btn-default other' }
        });
    });

    it('combineClassWithDifferentProp', () => {
      expect(nodeDef(['button.btn', { class: 'btn-default other' }], { class: 'class' }))
        .toEqual({
          tag: 'button',
          attrs: { class: 'btn btn-default other' }
        });
    });

    it('classToggles', () => {
      expect(nodeDef(['button.btn', { class: { 'btn-primary': true, 'btn-default': false } }]))
        .toEqual({
          tag: 'button',
          attrs: { class: 'btn btn-primary' }
        });
    });

    it('classTogglesFalsy', () => {
      expect(nodeDef([
        'button.btn',
        { class: { 'btn-primary': true, 'one': null, 'two': undefined, 'three': 0 } }
      ]))
        .toEqual({
          tag: 'button',
          attrs: { class: 'btn btn-primary' }
        });
    });

    it('events', () => {
      expect(nodeDef(['button', { onClick: func, onBlur: func }]))
        .toEqual({
          tag: 'button',
          attrs: {
            onClick: func,
            onBlur: func
          }
        });
    });

    it('functionTag', () => {
      expect(nodeDef([func, { name: 'test' }, [func, { id: 'child' }]]))
        .toEqual({
          tag: func,
          attrs: { name: 'test' },
          children: [
            { tag: func, attrs: { id: 'child' } }
          ]
        });
    });

    it('objectTag', () => {
      expect(nodeDef([object, { name: 'test' }, [object, { id: 'child' }]]))
        .toEqual({
          tag: object,
          attrs: { name: 'test' },
          children: [
            { tag: object, attrs: { id: 'child' } }
          ]
        });
    });
  });
});
