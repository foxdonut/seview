/* global preact, seview */
const h = seview.seview((node) => {
  if (typeof node === 'string') {
    return node;
  }
  const attrs = node.attrs || {};
  if (attrs.innerHTML) {
    attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML };
    delete attrs.innerHTML;
  }
  return preact.h(node.tag, attrs, node.children || []);
});

export { h };
