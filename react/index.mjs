/* global React, seview */
const attrMap = {
  onInput: 'onChange',
  class: 'className',
  for: 'htmlFor'
};

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach((key) => {
    const mappedKey = attrMap[key];
    if (mappedKey) {
      attrs[mappedKey] = attrs[key];
      delete attrs[key];
    }
  });
  return attrs;
};

const h = seview.seview((node) => {
  if (typeof node === 'string') {
    return node;
  }
  const attrs = processAttrs(node.attrs);
  if (attrs.innerHTML) {
    attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML };
    delete attrs.innerHTML;
  }
  const args = [node.tag, attrs].concat(node.children || []);
  return React.createElement.apply(null, args);
});

export { h };
