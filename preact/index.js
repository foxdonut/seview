import preact from 'preact';
import { seview } from '../src';

export const h = seview((node) => {
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
