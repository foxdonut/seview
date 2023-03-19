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

export default {
  isString: {
    'true for string': [
      isString(string),
      true
    ],
    'false for number': [
      isString(number),
      false
    ],
    'false for boolean': [
      isString(boolean),
      false
    ],
    'false for object': [
      isString(object),
      false
    ],
    'false for array': [
      isString(array),
      false
    ],
    'false for iterable': [
      isString(iter),
      false
    ],
    'false for function': [
      isString(func),
      false
    ],
    'false for null': [
      isString(null),
      false
    ],
    'false for undefined': [
      isString(undefined),
      false
    ]
  },
  isNumber: {
    'false for string': [
      isNumber(string),
      false
    ],
    'true for number': [
      isNumber(number),
      true
    ],
    'false for boolean': [
      isNumber(boolean),
      false
    ],
    'false for object': [
      isNumber(object),
      false
    ],
    'false for array': [
      isNumber(array),
      false
    ],
    'false for iterable': [
      isNumber(iter),
      false
    ],
    'false for function': [
      isNumber(func),
      false
    ],
    'false for null': [
      isNumber(null),
      false
    ],
    'false for undefined': [
      isNumber(undefined),
      false
    ]
  },
  isBoolean: {
    'false for string': [
      isBoolean(string),
      false
    ],
    'false for number': [
      isBoolean(number),
      false
    ],
    'true for boolean': [
      isBoolean(boolean),
      true
    ],
    'false for object': [
      isBoolean(object),
      false
    ],
    'false for array': [
      isBoolean(array),
      false
    ],
    'false for iterable': [
      isBoolean(iter),
      false
    ],
    'false for function': [
      isBoolean(func),
      false
    ],
    'false for null': [
      isBoolean(null),
      false
    ],
    'false for undefined': [
      isBoolean(undefined),
      false
    ]
  },
  isArray: {
    'false for string': [
      isArray(string),
      false
    ],
    'false for number': [
      isArray(number),
      false
    ],
    'false for boolean': [
      isArray(boolean),
      false
    ],
    'false for object': [
      isArray(object),
      false
    ],
    'true for array': [
      isArray(array),
      true
    ],
    'false for iterable': [
      isArray(iter),
      false
    ],
    'false for function': [
      isArray(func),
      false
    ],
    'false for null': [
      isArray(null),
      false
    ],
    'false for undefined': [
      isArray(undefined),
      false
    ]
  },
  isIterable: {
    'false for string': [
      isIterable(string),
      false
    ],
    'false for number': [
      isIterable(number),
      false
    ],
    'false for boolean': [
      isIterable(boolean),
      false
    ],
    'false for object': [
      isIterable(object),
      false
    ],
    'false for array': [
      isIterable(array),
      true
    ],
    'true for Set': [
      isIterable(iter),
      true
    ],
    'false for function': [
      isIterable(func),
      false
    ],
    'false for null': [
      isIterable(null),
      false
    ],
    'false for undefined': [
      isIterable(undefined),
      false
    ]
  },
  isObject: {
    'false for string': [
      isObject(string),
      false
    ],
    'false for number': [
      isObject(number),
      false
    ],
    'false for boolean': [
      isObject(boolean),
      false
    ],
    'true for object': [
      isObject(object),
      true
    ],
    'false for array': [
      isObject(array),
      false
    ],
    'false for iterable': [
      isObject(iter),
      false
    ],
    'false for function': [
      isObject(func),
      false
    ],
    'false for null': [
      isObject(null),
      false
    ],
    'false for undefined': [
      isObject(undefined),
      false
    ]
  },
  getString: {
    basic: [
      getString(string),
      string
    ],
    excluded: [
      [
        getString(undefined),
        getString(null),
        getString(''),
        getString(false),
        getString(['test']),
        getString({ id: 'test' })
      ],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    included: [
      [getString(42), getString(NaN), getString(Infinity), getString(true)],
      ['42', 'NaN', 'Infinity', 'true']
    ]
  },
  get: {
    basic: [
      get({ tag: 'div' }, ['tag']),
      'div'
    ],
    deep: [
      get({ attrs: { onClick: func } }, ['attrs', 'onClick']),
      func
    ],
    noValue: [
      get({ tag: 'div' }, ['type']),
      undefined
    ],
    noPath: [
      get({ tag: 'div' }, ['type', 'value']),
      undefined
    ]
  },
  set: {
    basic: [
      set({ tag: 'div' }, ['tag'], 'span'),
      { tag: 'span' }
    ],
    deep: [
      set({ attrs: { onClick: null } }, ['attrs', 'onClick'], func),
      { attrs: { onClick: func } }
    ],
    noValue: [
      set({ tag: 'input' }, ['type'], 'password'),
      { tag: 'input', type: 'password' }
    ],
    noPath: [
      set({ tag: 'input' }, ['attrs', 'type'], 'password'),
      { tag: 'input', attrs: { type: 'password' } }
    ],
    merge: [
      set({ tag: 'input', props: { id: 'test' } }, ['props', 'children'], ['test']),
      { tag: 'input', props: { id: 'test', children: ['test'] } }
    ]
  },
  getTagProperties: {
    divByDefault: [
      getTagProperties(''),
      {
        tag: 'div'
      }
    ],
    divByDefaultWithClass: [
      getTagProperties('.btn'),
      {
        tag: 'div',
        attrs: { class: 'btn' }
      }
    ],
    divByDefaultWithId: [
      getTagProperties('#home'),
      {
        tag: 'div',
        attrs: { id: 'home' }
      }
    ],
    customTag: [
      getTagProperties('my-tag09.home'),
      {
        tag: 'my-tag09',
        attrs: { class: 'home' }
      }
    ],
    all: [
      getTagProperties('input:password#duck.quack.yellow[name=pwd][required]'),
      {
        tag: 'input',
        attrs: {
          type: 'password',
          id: 'duck',
          class: 'quack yellow',
          name: 'pwd',
          required: true
        }
      }
    ],
    valueWithSpaces: [
      getTagProperties('input[placeholder=Enter your name here]'),
      {
        tag: 'input',
        attrs: { placeholder: 'Enter your name here' }
      }
    ],
    extraTypesIgnored: [
      getTagProperties('input:text:password.form-input'),
      {
        tag: 'input',
        attrs: { type: 'text', class: 'form-input' }
      }
    ],
    optionForClass: [
      getTagProperties('input.form-input', 'class'),
      {
        tag: 'input',
        attrs: { class: 'form-input' }
      }
    ]
  },
  nodeDef: {
    basicText: [
      nodeDef(['div', { width: '100%' }, 'test']),
      {
        tag: 'div',
        attrs: { width: '100%' },
        children: ['test']
      }
    ],
    basicChildren: [
      nodeDef(['div', { id: 'test' }, [
        ['div', 'test1'],
        ['div', 'test2']
      ]]),
      {
        tag: 'div',
        attrs: { id: 'test' },
        children: [
          { tag: 'div', children: ['test1'] },
          { tag: 'div', children: ['test2'] }
        ]
      }
    ],
    uppercaseTag: [
      nodeDef(['MY-DIV', 'test']),
      {
        tag: 'MY-DIV',
        children: ['test']
      }
    ],
    basicIterable: [
      nodeDef(['div', { id: 'test' }, new Set([
        ['span[key=a]', 'hi'],
        ['span[key=b]', 'bye']
      ])]),
      {
        tag: 'div',
        attrs: { id: 'test' },
        children: [
          { tag: 'span', attrs: { key: 'a' }, children: ['hi'] },
          { tag: 'span', attrs: { key: 'b' }, children: ['bye'] }
        ]
      }
    ],
    nestedArrays: [
      nodeDef(['div', [
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
      ]]),
      {
        tag: 'div',
        children: [
          { tag: 'div', children: ['test1'] },
          { tag: 'div', children: ['test2'] },
          { tag: 'div', children: ['test3'] },
          { tag: 'div', children: ['test4'] },
          { tag: 'div', children: ['test5'] }
        ]
      }
    ],
    nestedArraysVarargs: [
      nodeDef(['div',
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
        ]]),
      {
        tag: 'div',
        children: [
          { tag: 'div', children: ['test1'] },
          { tag: 'div', children: ['test2'] },
          { tag: 'div', children: ['test3'] },
          { tag: 'div', children: ['test4'] },
          { tag: 'div', children: ['test5'] }
        ]
      }
    ],
    justATag: [
      nodeDef(['hr']),
      { tag: 'hr' }
    ],
    tagWithNumber: [
      nodeDef(['span', 0]),
      { tag: 'span', children: ['0'] }
    ],
    oneVarArg: [
      nodeDef(['div',
        ['div', 'test1']]),
      {
        tag: 'div',
        children: [
          { tag: 'div', children: ['test1'] }
        ]
      }
    ],
    mixedChildrenVarArgs: [
      nodeDef(['div',
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
        ['b', 'in bold']]),
      {
        tag: 'div',
        children: [
          'text 1',
          '42',
          'true',
          'NaN',
          'Infinity',
          { tag: 'b', children: ['in bold'] }
        ]
      }
    ],
    combineAttrs: [
      nodeDef(['input[name=duck]', { value: 'quack' }]),
      {
        tag: 'input',
        attrs: { name: 'duck', value: 'quack' }
      }
    ],
    combineAttrsOverride: [
      nodeDef(['input:text#one[name=horse]', { type: 'password', id: 'two', name: 'duck' }]),
      {
        tag: 'input',
        attrs: { type: 'password', id: 'two', name: 'duck' }
      }
    ],
    combineClass: [
      nodeDef(['button.btn', { class: 'btn-default other' }]),
      {
        tag: 'button',
        attrs: { class: 'btn btn-default other' }
      }
    ],
    combineClassWithDifferentProp: [
      nodeDef(['button.btn', { class: 'btn-default other' }], { class: 'class' }),
      {
        tag: 'button',
        attrs: { class: 'btn btn-default other' }
      }
    ],
    classToggles: [
      nodeDef(['button.btn', { class: { 'btn-primary': true, 'btn-default': false } }]),
      {
        tag: 'button',
        attrs: { class: 'btn btn-primary' }
      }
    ],
    classTogglesFalsy: [
      nodeDef([
        'button.btn',
        { class: { 'btn-primary': true, 'one': null, 'two': undefined, 'three': 0 } }
      ]),
      {
        tag: 'button',
        attrs: { class: 'btn btn-primary' }
      }
    ],
    events: [
      nodeDef(['button', { onClick: func, onBlur: func }]),
      {
        tag: 'button',
        attrs: {
          onClick: func,
          onBlur: func
        }
      }
    ],
    functionTag: [
      nodeDef([func, { name: 'test' }, [func, { id: 'child' }]]),
      {
        tag: func,
        attrs: { name: 'test' },
        children: [
          { tag: func, attrs: { id: 'child' } }
        ]
      }
    ],
    objectTag: [
      nodeDef([object, { name: 'test' }, [object, { id: 'child' }]]),
      {
        tag: object,
        attrs: { name: 'test' },
        children: [
          { tag: object, attrs: { id: 'child' } }
        ]
      }
    ]
  }
};
