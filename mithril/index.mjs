/* global m, seview */
const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach((key) => {
    if (key.startsWith('on')) {
      attrs[key.toLowerCase()] = attrs[key];
      delete attrs[key];
    }
  });
  return attrs;
};

const h = seview.seview((node) =>
  (typeof node === 'string')
    ? { tag: '#', children: node }
    : node.attrs && node.attrs.innerHTML
      ? m(node.tag, m.trust(node.attrs.innerHTML))
      : m(node.tag, processAttrs(node.attrs), node.children || [])
);

export { h };
