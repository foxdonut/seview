import { isString, isNumber, isBoolean, isArray, isObject, isFunction, get, set,
  getString, getTagProperties, nodeDef } from "../src/util"

const string = "test"
const number = 42
const boolean = false
const object = { key: "value" }
const array = ["div", "test"]
const func = x => x

export default {
  isString: {
    "true for string": [
      isString(string),
      true
    ],
    "false for number": [
      isString(number),
      false
    ],
    "false for boolean": [
      isString(boolean),
      false
    ],
    "false for object": [
      isString(object),
      false
    ],
    "false for array": [
      isString(array),
      false
    ],
    "false for function": [
      isString(func),
      false
    ],
    "false for null": [
      isString(null),
      false
    ],
    "false for undefined": [
      isString(undefined),
      false
    ]
  },
  isNumber: {
    "false for string": [
      isNumber(string),
      false
    ],
    "true for number": [
      isNumber(number),
      true
    ],
    "false for boolean": [
      isNumber(boolean),
      false
    ],
    "false for object": [
      isNumber(object),
      false
    ],
    "false for array": [
      isNumber(array),
      false
    ],
    "false for function": [
      isNumber(func),
      false
    ],
    "false for null": [
      isNumber(null),
      false
    ],
    "false for undefined": [
      isNumber(undefined),
      false
    ]
  },
  isBoolean: {
    "false for string": [
      isBoolean(string),
      false
    ],
    "false for number": [
      isBoolean(number),
      false
    ],
    "true for boolean": [
      isBoolean(boolean),
      true
    ],
    "false for object": [
      isBoolean(object),
      false
    ],
    "false for array": [
      isBoolean(array),
      false
    ],
    "false for function": [
      isBoolean(func),
      false
    ],
    "false for null": [
      isBoolean(null),
      false
    ],
    "false for undefined": [
      isBoolean(undefined),
      false
    ]
  },
  isArray: {
    "false for string": [
      isArray(string),
      false
    ],
    "false for number": [
      isArray(number),
      false
    ],
    "false for boolean": [
      isArray(boolean),
      false
    ],
    "false for object": [
      isArray(object),
      false
    ],
    "true for array": [
      isArray(array),
      true
    ],
    "false for function": [
      isArray(func),
      false
    ],
    "false for null": [
      isArray(null),
      false
    ],
    "false for undefined": [
      isArray(undefined),
      false
    ]
  },
  isObject: {
    "false for string": [
      isObject(string),
      false
    ],
    "false for number": [
      isObject(number),
      false
    ],
    "false for boolean": [
      isObject(boolean),
      false
    ],
    "true for object": [
      isObject(object),
      true
    ],
    "false for array": [
      isObject(array),
      false
    ],
    "false for function": [
      isObject(func),
      false
    ],
    "false for null": [
      isObject(null),
      false
    ],
    "false for undefined": [
      isObject(undefined),
      false
    ]
  },
  isFunction: {
    "false for string": [
      isFunction(string),
      false
    ],
    "false for number": [
      isFunction(number),
      false
    ],
    "false for boolean": [
      isFunction(boolean),
      false
    ],
    "false for object": [
      isFunction(object),
      false
    ],
    "false for array": [
      isFunction(array),
      false
    ],
    "true for function": [
      isFunction(func),
      true
    ],
    "false for null": [
      isFunction(null),
      false
    ],
    "false for undefined": [
      isFunction(undefined),
      false
    ]
  },
  getString: {
    basic: [
      getString(string),
      string
    ],
    excluded: [
      [ getString(undefined), getString(null), getString(""), getString(false), getString(["test"]), getString({ id: "test" }) ],
      [ undefined, undefined, undefined, undefined, undefined, undefined ]
    ],
    included: [
      [ getString(42), getString(NaN), getString(Infinity), getString(true) ],
      [ "42", "NaN", "Infinity", "true" ]
    ]
  },
  get: {
    basic: [
      get({ tag: "div" }, ["tag"]),
      "div"
    ],
    deep: [
      get({ attrs: { onClick: func } }, ["attrs", "onClick"]),
      func
    ],
    noValue: [
      get({ tag: "div" }, ["type"]),
      undefined
    ],
    noPath: [
      get({ tag: "div" }, ["type", "value"]),
      undefined
    ]
  },
  set: {
    basic: [
      set({ tag: "div" }, ["tag"], "span"),
      { tag: "span" }
    ],
    deep: [
      set({ attrs: { onClick: null } }, ["attrs", "onClick"], func),
      { attrs: { onClick: func } }
    ],
    noValue: [
      set({ tag: "input" }, ["type"], "password"),
      { tag: "input", type: "password" }
    ],
    noPath: [
      set({ tag: "input" }, ["attrs", "type"], "password"),
      { tag: "input", attrs: { type: "password" } }
    ],
    merge: [
      set({ tag: "input", props: { id: "test" } }, ["props", "children"], ["test"]),
      { tag: "input", props: { id: "test", children: ["test"] } }
    ]
  },
  getTagProperties: {
    divByDefaultWithClass: [
      getTagProperties(".btn"),
      {
        tag: "div",
        attrs: { className: "btn" }
      }
    ],
    divByDefaultWithId: [
      getTagProperties("#home"),
      {
        tag: "div",
        attrs: { id: "home" }
      }
    ],
    all: [
      getTagProperties("input:password#duck.quack.yellow[name=pwd][required]"),
      {
        tag: "input",
        attrs: { type: "password", id: "duck", className: "quack yellow", name: "pwd", required: true }
      }
    ],
    extraTypesIgnored: [
      getTagProperties("input:text:password.form-input"),
      {
        tag: "input",
        attrs: { type: "text", className: "form-input" }
      }
    ]
  },
  nodeDef: {
    basicText: [
      nodeDef(["div", { width: "100%" }, "test"]),
      {
        tag: "div",
        attrs: { width: "100%" },
        children: ["test"]
      }
    ],
    basicChildren: [
      nodeDef(["div", { id: "test" }, [
        ["div", "test1"],
        ["div", "test2"]
      ]]),
      {
        tag: "div",
        attrs: { id: "test" },
        children: [
          { tag: "div", children: ["test1"] },
          { tag: "div", children: ["test2"] }
        ]
      }
    ],
    justATag: [
      nodeDef(["hr"]),
      { tag: "hr" }
    ],
    tagWithNumber: [
      nodeDef(["span", 0]),
      { tag: "span", children: ["0"] }
    ],
    oneVarArg: [
      nodeDef(["div",
        ["div", "test1"]
      ]),
      {
        tag: "div",
        children: [
          { tag: "div", children: ["test1"] }
        ]
      }
    ],
    mixedChildrenVarArgs: [
      nodeDef(["div",
        "text 1",
        42,
        undefined,
        null,
        false,
        "",
        true,
        NaN,
        Infinity,
        ["b", "in bold"]
      ]),
      {
        tag: "div",
        children: [
          "text 1",
          "42",
          "true",
          "NaN",
          "Infinity",
          { tag: "b", children: ["in bold"] }
        ]
      }
    ],
    combineAttrs: [
      nodeDef(["input[name=duck]", { value: "quack" }]),
      {
        tag: "input",
        attrs: { name: "duck", value: "quack" }
      }
    ],
    combineAttrsOverride: [
      nodeDef(["input:text#one[name=horse]", { type: "password", id: "two", name: "duck" }]),
      {
        tag: "input",
        attrs: { type: "password", id: "two", name: "duck" }
      }
    ],
    combineClassName: [
      nodeDef(["button.btn", { className: "btn-default other" }]),
      {
        tag: "button",
        attrs: { className: "btn btn-default other" }
      }
    ],
    classNameToggles: [
      nodeDef(["button.btn", { className: { "btn-primary": true, "btn-default": false }}]),
      {
        tag: "button",
        attrs: { className: "btn btn-primary" }
      }
    ],
    classNameTogglesFalsy: [
      nodeDef(["button.btn", { className: { "btn-primary": true, "one": null, "two": undefined, "three": 0 }}]),
      {
        tag: "button",
        attrs: { className: "btn btn-primary" }
      }
    ],
    events: [
      nodeDef(["button", { onClick: func, onBlur: func }]),
      {
        tag: "button",
        attrs: {
          onClick: func,
          onBlur: func
        }
      }
    ]
  }
}