export const isString = x => typeof x === "string"
export const isNumber = x => typeof x === "number"
export const isBoolean = x => typeof x === "boolean"
export const isArray = x => Array.isArray(x)
export const isObject = x => typeof x === "object" && !isArray(x) && x !== null && x !== undefined

export const getString = value => {
  let result = undefined

  if (isString(value) && value.length > 0) {
    result = value
  }
  else if (isNumber(value)) {
    result = String(value)
  }
  else if (isBoolean(value) && value) {
    result = String(value)
  }
  return result
}

export const get = (object, path) =>
  object == null
    ? undefined
    : path.length === 1
      ? object[path[0]]
      : get(object[path[0]], path.slice(1))

export const set = (object, path, value) => {
  if (path.length === 1) {
    if (isObject(object[path[0]])) {
      Object.assign(object[path[0]], value)
    }
    else {
      object[path[0]] = value
    }
  }
  else {
    if (object[[path[0]]] == null) {
      object[[path[0]]] = {}
    }
    set(object[path[0]], path.slice(1), value)
  }
  return object
}

// Credit: JSnoX https://github.com/af/JSnoX/blob/master/jsnox.js

// matches "input", "input:text"
const tagTypeRegex = /^([a-z1-6]+)(?::([a-z]+))?/

// matches "#id", ".class", "[name=value]", "[required]"
const propsRegex = /((?:#|\.|@)[\w-]+)|(\[.*?\])/g

// matches "[name=value]" or "[required]"
const attrRegex = /\[([\w-]+)(?:=([^\]]+))?\]/

/*
returns tag properties: for example, "input:password#duck.quack.yellow[name=pwd][required]"
{
  tag: "input",
  className: "quack yellow",
  attrs: { type: "password", id: "duck", name: "pwd", required: true }
}
*/
export const getTagProperties = selector => {
  const result = {}

  let tagType = selector.match(tagTypeRegex)

  // Use div by default
  if (!tagType) {
    tagType = ["div", "div"]
  }
  result.tag = tagType[1]

  if (tagType[2]) {
    result.attrs = { type: tagType[2] }
  }

  const tagProps = selector.match(propsRegex)

  if (tagProps) {
    const classes =[]

    tagProps.forEach(tagProp => {
      const ch = tagProp[0]
      const prop = tagProp.slice(1)

      if (ch === "#") {
        set(result, ["attrs", "id"], prop)
      }
      else if (ch === ".") {
        classes.push(prop)
      }
      else if (ch === "[") {
        const attrs = tagProp.match(attrRegex)
        set(result, ["attrs", attrs[1]], (attrs[2] || true))
      }
    })

    if (classes.length > 0) {
      set(result, ["attrs", "className"], classes.join(" "))
    }
  }

  return result
}

/*
returns node definition, expanding on the above tag properties and adding to obtain:
{
  tag: "input",
  className: "quack yellow",
  attrs: { type: "password", id: "duck", name: "pwd", required: true, onClick: ... },
  children: [ { tag: ... }, "text", ... ]
}
*/
const processChildren = rest => {
  const ch = []
  rest.forEach(child => {
    // Text node
    if (getString(child)) {
      ch.push(getString(child))
    }
    else if (isArray(child)) {
      ch.push(nodeDef(child))
    }
  })
  return ch
}

export const nodeDef = node => {
  // Tag
  let rest = node[2]
  let varArgsLimit = 3

  // Process tag
  const result = isString(node[0])
    ? getTagProperties(node[0])
    : { tag: node[0] }

  // Process attrs
  if (isObject(node[1])) {
    const attrs = node[1]

    // Process className
    if (attrs["className"] !== undefined) {
      const classAttr = attrs["className"]
      delete attrs["className"]

      let addClasses = []
      if (isString(classAttr)) {
        addClasses = classAttr.split(" ")
      }
      else if (isObject(classAttr)) {
        Object.keys(classAttr).forEach(key => {
          if (classAttr[key]) {
            addClasses.push(key)
          }
        })
      }
      if (addClasses.length > 0) {
        const existingClassName = get(result, ["attrs", "className"])
        const addClassName = addClasses.join(" ")
        set(result, ["attrs", "className"],
          (existingClassName ? existingClassName + " " : "")
          + addClassName
        )
      }
    }

    // Add remaining attributes
    if (Object.keys(attrs).length > 0) {
      if (result.attrs === undefined) {
        result.attrs = attrs
      }
      else {
        result.attrs = Object.assign(result.attrs, attrs)
      }
    }
  }
  // No attrs, use second argument as rest
  else {
    rest = node[1]
    varArgsLimit = 2
  }

  // Process children: varargs
  if (node.length > varArgsLimit) {
    result.children = processChildren(node.slice(varArgsLimit - 1))
  }
  // Process children: one child arg
  else {
    // Text node
    if (getString(rest)) {
      result.children = [ getString(rest) ]
    }

    if (isArray(rest)) {
      // One child node vs Array of children
      result.children = processChildren( isArray(rest[0]) ? rest : [ rest ] )
    }
  }
  return result
}
