/* global React, seview */
const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach((key) => {
    if (key === 'onInput') {
      const value = attrs[key];
      delete attrs[key];
      attrs['onChange'] = value;
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
