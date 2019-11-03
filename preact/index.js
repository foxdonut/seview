import { h as hPreact } from "preact"
import { sv } from "../src"

export const h = sv(node => {
  if (typeof node === "string") {
    return node
  }
  const attrs = node.attrs || {}
  if (attrs.innerHTML) {
    attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML }
    delete attrs.innerHTML
  }
  return hPreact(node.tag, node.attrs || {}, node.children || [])
})
