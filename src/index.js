import { get, isArray, isString, nodeDef, set } from "./util"

const transformNodeDef = (transform, def) => {
  if (isArray(def.children)) {
    const result = []
    def.children.forEach(child => {
      result.push(isString(child) ? child : transformNodeDef(transform, child))
    })
    def.children = result
  }
  return transform(def)
}

export const sv = transform => node => {
  const def = nodeDef(node)
  return transformNodeDef(transform, def)
}

export const mapKeys = mappings => object => {
  const result = {}

  Object.keys(mappings).forEach(key => {
    const from = key.split(".")
    const to = mappings[key].split(".")
    const value = get(object, from)
    if (value != null) {
      set(result, to, value)
    }
  })

  return result
}
