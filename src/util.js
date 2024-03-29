export const isString = (x) => typeof x === 'string';
export const isNumber = (x) => typeof x === 'number';
export const isBoolean = (x) => typeof x === 'boolean';
export const isArray = (x) => Array.isArray(x);
export const isIterable = (x) => x != null && typeof x[Symbol.iterator] === 'function'
  && !isString(x);
export const isObject = (x) => x != null && typeof x === 'object' && !isArray(x) && !isIterable(x);

export const getString = (value) => {
  let result = undefined;

  if (isString(value) && value.length > 0) {
    result = value;
  }
  else if (isNumber(value)) {
    result = String(value);
  }
  else if (isBoolean(value) && value) {
    result = String(value);
  }
  return result;
};

export const get = (object, path) =>
  object == null
    ? undefined
    : path.length === 1
      ? object[path[0]]
      : get(object[path[0]], path.slice(1));

export const set = (object, path, value) => {
  if (path.length === 1) {
    if (isObject(object[path[0]])) {
      Object.assign(object[path[0]], value);
    }
    else {
      object[path[0]] = value;
    }
  }
  else {
    if (object[[path[0]]] == null) {
      object[[path[0]]] = {};
    }
    set(object[path[0]], path.slice(1), value);
  }
  return object;
};

// Credit: JSnoX https://github.com/af/JSnoX/blob/master/jsnox.js

// matches 'input', 'input:text'
const tagTypeRegex = /^([A-Za-z0-9-]+)(?::([a-z]+))?/;

// matches '#id', '.class', '[name=value]', '[required]'
const propsRegex = /((?:#|\.|@)[\w-]+)|(\[.*?\])/g;

// matches '[name=value]' or '[required]'
const attrRegex = /\[([\w-]+)(?:=([^\]]+))?\]/;

/*
returns tag properties: for example, 'input:password#duck.quack.yellow[name=pwd][required]'
{
  tag: 'input',
  class: 'quack yellow',
  attrs: { type: 'password', id: 'duck', name: 'pwd', required: true }
}
*/
export const getTagProperties = (selector) => {
  const result = {};

  let tagType = selector.match(tagTypeRegex);

  // Use div by default
  if (!tagType) {
    tagType = ['div', 'div'];
  }
  result.tag = tagType[1];

  if (tagType[2]) {
    result.attrs = { type: tagType[2] };
  }

  const tagProps = selector.match(propsRegex);

  if (tagProps) {
    const classes = [];

    tagProps.forEach((tagProp) => {
      const ch = tagProp[0];
      const prop = tagProp.slice(1);

      if (ch === '#') {
        set(result, ['attrs', 'id'], prop);
      }
      else if (ch === '.') {
        classes.push(prop);
      }
      else if (ch === '[') {
        const attrs = tagProp.match(attrRegex);
        set(result, ['attrs', attrs[1]], (attrs[2] || true));
      }
    });

    if (classes.length > 0) {
      set(result, ['attrs', 'class'], classes.join(' '));
    }
  }

  return result;
};

/*
returns node definition, expanding on the above tag properties and adding to obtain:
{
  tag: 'input',
  class: 'quack yellow',
  attrs: { type: 'password', id: 'duck', name: 'pwd', required: true, onClick: ... },
  children: [ { tag: ... }, 'text', ... ]
}
*/
const processChildren = (rest, result = []) => {
  rest.forEach((child) => {
    if (isIterable(child)) {
      child = Array.from(child);
    }
    // Text node
    if (getString(child)) {
      result.push(getString(child));
    }
    else if (isArray(child)) {
      // Nested array
      if (isArray(child[0]) || isIterable(child[0])) {
        processChildren(child, result);
      }
      // Regular node
      else if (child.length > 0) {
        result.push(nodeDef(child));
      }
    }
  });
  return result;
};

export const nodeDef = (node) => {
  // Tag
  let rest = node[2];
  let varArgsLimit = 3;

  // Process tag
  const result = isString(node[0])
    ? getTagProperties(node[0], 'class')
    : { tag: node[0] };

  // Process attrs
  if (isObject(node[1])) {
    const attrs = node[1];

    // Process class
    if (attrs['class'] !== undefined) {
      const classAttr = attrs['class'];
      delete attrs['class'];

      let addClasses = [];
      if (isString(classAttr)) {
        addClasses = classAttr.split(' ');
      }
      else if (isObject(classAttr)) {
        Object.keys(classAttr).forEach((key) => {
          if (classAttr[key]) {
            addClasses.push(key);
          }
        });
      }
      if (addClasses.length > 0) {
        const existingClass = get(result, ['attrs', 'class']);
        const addClass = addClasses.join(' ');
        set(result, ['attrs', 'class'],
          (existingClass ? existingClass + ' ' : '')
          + addClass
        );
      }
    }

    // Add remaining attributes
    if (Object.keys(attrs).length > 0) {
      if (result.attrs === undefined) {
        result.attrs = attrs;
      }
      else {
        result.attrs = Object.assign(result.attrs, attrs);
      }
    }
  }
  // No attrs, use second argument as rest
  else {
    rest = node[1];
    varArgsLimit = 2;
  }

  // Process children: varargs
  if (node.length > varArgsLimit) {
    result.children = processChildren(node.slice(varArgsLimit - 1));
  }
  // Process children: one child arg
  else {
    // Text node
    if (getString(rest)) {
      result.children = [getString(rest)];
    }

    if (isIterable(rest)) {
      rest = Array.from(rest);
    }
    if (isArray(rest)) {
      // Array of children vs One child node
      result.children = processChildren(isArray(rest[0]) ? rest : [rest]);
    }
  }
  return result;
};
