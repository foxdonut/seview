import { get, isArray, isObject, isString, nodeDef, set } from "./util"

const transformNodeDef = (transform, def) => {
  if (isArray(def.children)) {
    const result = []
    def.children.forEach(child => {
      result.push(isString(child) ? transform(child) : transformNodeDef(transform, child))
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
  if (!isObject(object)) {
    return object
  }
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
