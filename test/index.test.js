import { sv } from "../src/index"
import { isString } from "../src/util"

const transform = node => {
  if (isString(node)) {
    return node
  }
  const children = node.children || []
  const childrenObj = children.length > 0 ? { children } : {}

  return {
    type: node.tag,
    props: Object.assign({}, node.attrs, childrenObj )
  }
}

const h = sv(transform)
const k = sv(transform, { className: "class" })

const p = sv(node => {
  if (isString(node)) {
    return node
  }
  const result = {
    nodeName: node.tag
  }
  if (node.attrs) {
    result.attributes = node.attrs
  }
  if (node.children) {
    result.subs = node.children
  }
  return result
})

const f = sv(node => {
  if (isString(node)) {
    return {
      type: "#text",
      nodeValue: node
    }
  }
  return {
    type: node.tag,
    attributes: node.attrs || {},
    content: node.children || []
  }
})

export default {
  basicText: [
    h(["div", { id: "test" }, "test"]),
    {
      type: "div",
      props: { id: "test", children: ["test"] }
    }
  ],
  basicChildren: [
    h(["div", { id: "test" }, [
      ["div", {}, "test1"],
      ["div", {}, "test2"]
    ]]),
    {
      type: "div",
      props: {
        id: "test",
        children: [
          { type: "div", props: { children: ["test1"] } },
          { type: "div", props: { children: ["test2"] } }
        ]
      }
    }
  ],
  justATag: [
    h(["hr"]),
    { type: "hr", props: {} }
  ],
  optionalAttrs: [
    h(["div", "test"]),
    { type: "div", props: { children: ["test"] } }
  ],
  optionalAttrsChildren: [
    h(["div", [
      ["div", "test1"],
      ["div", "test2"]
    ]]),
    {
      type: "div",
      props: { children: [
        { type: "div", props: { children: ["test1"] } },
        { type: "div", props: { children: ["test2"] } }
      ] }
    }
  ],
  combineClassName: [
    h(["button.btn", { className: "btn-default other" }]),
    {
      type: "button",
      props: { className: "btn btn-default other" }
    }
  ],
  combineClassNameWithDifferentProp: [
    k(["button.btn", { class: "btn-default other" }], { className: "class" }),
    {
      type: "button",
      props: { class: "btn btn-default other" }
    }
  ],
  classNameToggles: [
    h(["button.btn", { className: { "btn-primary": true, "btn-default": false }}]),
    {
      type: "button",
      props: { className: "btn btn-primary" }
    }
  ],
  classNameTogglesFalsy: [
    h(["button.btn", { className: { "btn-primary": true, "one": null, "two": undefined, "three": 0 }}]),
    {
      type: "button",
      props: { className: "btn btn-primary" }
    }
  ],
  basicVarArgs: [
    p(["div", {},
      ["div", "test1"],
      ["div", "test2"]
    ]),
    {
      nodeName: "div",
      subs: [
        { nodeName: "div", subs: ["test1"] },
        { nodeName: "div", subs: ["test2"] }
      ]
    }
  ],
  varArgsNoAttrs: [
    p(["div",
      ["div", "test1"],
      ["div", "test2"]
    ]),
    {
      nodeName: "div",
      subs: [
        { nodeName: "div", subs: ["test1"] },
        { nodeName: "div", subs: ["test2"] }
      ]
    }
  ],
  oneVarArg: [
    p(["div",
      ["div", "test1"]
    ]),
    {
      nodeName: "div",
      subs: [
        { nodeName: "div", subs: ["test1"] }
      ]
    }
  ],
  mixedChildrenVarArgs: [
    p(["div",
      "text 1",
      ["b", "in bold"]
    ]),
    {
      nodeName: "div",
      subs: [
        "text 1",
        { nodeName: "b", subs: ["in bold"] }
      ]
    }
  ],
  mixedChildrenArray: [
    p(["div", [
      ["b", "in bold"],
      "text 2"
    ]]),
    {
      nodeName: "div",
      subs: [
        { nodeName: "b", subs: ["in bold"] },
        "text 2"
      ]
    }
  ],
  deeplyNestedChildren: [
    p(["div",
      ["div",
        ["input:checkbox#sports", { checked: true }],
        ["label", { htmlFor: "sports" }, "Sports"]
      ]
    ]),
    {
      nodeName: "div",
      subs: [
        {
          nodeName: "div",
          subs: [
            {
              nodeName: "input",
              attributes: { type: "checkbox", id: "sports", checked: true }
            },
            {
              nodeName: "label",
              attributes: { htmlFor: "sports" },
              subs: ["Sports"]
            }
          ]
        }
      ]
    }
  ],
  processTextNodes: [
    f(["div",
      ["span", "test"]
    ]),
    {
      type: "div",
      attributes: {},
      content: [
        {
          type: "span",
          attributes: {},
          content: [
            {
              type: "#text",
              nodeValue: "test"
            }
          ]
        }
      ]
    }
  ]
}
