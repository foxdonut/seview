import { mapKeys, sv } from "../src/index"
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

const p = sv(mapKeys({
  tag: "nodeName",
  attrs: "attributes",
  children: "subs"
}))

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
  mapKeys: {
    basic: [
      mapKeys({
        tag: "type",
        attrs: "props",
        children: "props.children"
      })({
        tag: "div",
        attrs: { className: "duck yellow" },
        children: ["text"]
      }),
      {
        type: "div",
        props: {
          className: "duck yellow",
          children: ["text"]
        }
      }
    ],
    mappedOnly: [
      mapKeys({
        tag: "nodeName",
        attrs: "attributes"
      })({
        tag: "div",
        attrs: { id: "test" },
        children: ["test"]
      }),
      {
        nodeName: "div",
        attributes: { id: "test" }
      }
    ],
    mapOnlyPresent: [
      mapKeys({
        tag: "nodeName",
        attrs: "attributes"
      })({
        tag: "hr"
      }),
      {
        nodeName: "hr"
      }
    ],
    mapOnlyObjects: [
      mapKeys({
        tag: "type"
      })(
        "test"
      ),
      "test"
    ]
  },
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
