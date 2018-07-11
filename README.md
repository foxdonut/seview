# seview: S-Expression View

A simple way of writing views with [s-expressions](https://en.wikipedia.org/wiki/S-expression),
and meant to be used with a virtual DOM library.

## Why?

Because plain JavaScript is simpler to write and build than JSX, and it's great to
write views in a way that is independent of the virtual DOM library being used.
It's also nice to use convenient features even if the underlying virtual DOM library
does not support them.

## Example

Instead of writing this in JSX:

```jsx
<div id="home">
  <span className="instruction">Enter your name:</span>
  <input type="text" id="username" name="username" size="10"/>
  {isMessage ? <div className={"message" + (isError ? " error" : "")}>{message}</div> : null}
</div>
```

Or even this in hyperscript:

```javascript
h("div", { id: "home" }, [
  h("span", { className: "instruction" }, "Enter your name:"),
  h("input", { type: "text", id: "username", name: "username", size: 10 }),
  isMessage ? h("div", { className: "message" + (isError ? " error" : "") }, message) : null
])
```

You can write this with `seview`:

```javascript
["div#home",
  ["span.instruction", "Enter your name:"],
  ["input:text#username[name=username][size=10]"],
  isMessage && ["div.message", { className: { "error": isError } }, message]
])
```

Besides the conveniences of the syntax, you also don't have to write `h` at every element. To
switch from one virtual DOM library to another, you only need to make changes in **one** place.
All your view code can remain the same.

## Features

`seview` supports CSS-style selectors in tag names, `{ className: boolean }` for toggling classes,
using an array or varags for children, flattening of nested arrays, and removal of null/empty elements.

### Element

An element is an array:

```
[tag, attrs, children]
```

or a string (text node):

```
"this is a text node"
```

The `tag` can be a string, or something that your virtual DOM library understands; for example,
a `Component` in React. For the latter, `seview` just returns the selector as-is.

### Tag

When the tag is a string, it is assumed to be a tag name, possibly with CSS-style selectors:

- `"div"`, `"span"`, `"h1"`, `"input"`, etc.
- `"div.highlighted"`, `"button.btn.btn-default"` for classes
- `"div#home"` for `id`
- `"input:text"` for `<input type="text">`. There can only be one type, so additional types are
ignored. `"input:password:text"` would result in `<input type="password">`.
- `"input[name=username][required]"` results in `<input name="username" required="true">`
- if you need spaces, just use them: `"input[placeholder=Enter your name here]"`
- default tag is `"div"`, so you can write `""`, `".highlighted"`, `"#home"`, etc.
- these features can all be used together, for example
  `"input:password#duck.quack.yellow[name=pwd][required]"` results in
  `<input type="password" id="duck" class="quack yellow" name="pwd" required="true">`

### Attributes

If the second item is an object, it is considered to be the attributes for the element.

Of course, for everything that you can do with a CSS-style selector in a tag as shown in the
previous section, you can also use attributes:

```javascript
["input", { type: "password", name: "password", placeholder: "Enter your password here" }]
```

You can also mix selectors and attributes. If you specify something in both places, the attribute
overwrites the selector.

```javascript
["input:password[name=password]", { placeholder: "Enter your password here" }]
```
```html
<input type="password" name="password" placeholder="Enter password name here">
```

```javascript
["input:password[name=username]", { type: "text", placeholder: "Enter your username here" }]
```
```html
<input type="text" name="username" placeholder="Enter your username here">
```

### Classes

Classes can be specified in the tag as a selector (as shown above), and/or in attributes using
`className`:

```javascript
["button.btn.info", { className: "btn-default special" }]
```
```html
<button class="btn info btn-default special">
```

If you specify an object instead of a string for `className`, the keys are classes and the values
indicate whether or not to include the class. The class is only included if the value is truthy.

```javascript
// isDefault is true
// isError is false
["button.btn", { className: { "btn-default": isDefault, "error": isError } }]
```
```html
<button class="btn btn-default">
```

Note that `className` is the default key, but this can be configured to be something else, such
as `class`.

### Children (array or varags)

The last item(s), (starting with the second if there are no attributes, and starting with the
third if attributes are present), are the children. The children can be:

- an array, or
- varargs.

#### Using an array

You can specify children as an array:

```javascript
["div", [
  ["span", ["Hello"]],
  ["b", ["World"]]
]
```
```html
<div>
  <span>Hello</span>
  <b>World</b>
</div>
```

#### Using varargs

You can specify children as varargs:

```javascript
["div",
  ["span", "Hello"],
  ["b", "World"]
]
```
```html
<div>
  <span>Hello</span>
  <b>World</b>
</div>
```

### Varargs and text nodes

The problem with supporting varargs is, how do you differentiate a single element from two text nodes?

For example:

```js
["div", ["b", "hello"]]
```

vs

```js
["div", ["hello", "there"]]
```

For the second case, varargs **must** be used:

```js
["div", "hello", "there"]
```

### Flattened arrays

Whether using an array of children or varargs, nested arrays are automatically flattened:

```javascript
["div", [
  ["div", "one"],
  [
    ["div", "two"],
    [
      ["div", "three"]
    ]
  ]
]]
```

or

```javascript
["div",
  ["div", "one"],
  [
    ["div", "two"],
    [
      ["div", "three"]
    ]
  ]
]
```

Both result in

```html
<div>
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```

### Ignored elements

The following elements are ignored and not included in the output:

- `undefined`
- `null`
- `false`
- `""`
- `[]`

This makes it simple to conditionally include an element by writing:

```javascript
condition && ["div", "message"]
```

If `condition` is falsy, the `div` will not be included in the output. Because it is completely
excluded, this will work even if the virtual DOM library that you are using does not handle
`false`, `null`, or `undefined`.

### Elements converted to a string

The following elements will be converted to a string:

- `true`
- numbers
- `NaN`
- `Infinity`

## Installation

Using Node.js:

```
npm i -S seview
```

With a script tag:

```html
<script src="http://unpkg.com/seview"></script>
```

## Usage

`seview` exports a single function, `sv`, that you use to obtain a function which you can name
as you wish; in the examples, I name this function `h`. Calling `h(view)`, where `view` is the view
expressed as arrays as we have seen above, produces the final result suitable for your virtual DOM
library.

When you call `sv`, you pass it a function that gets called for every node in the view. Each
node has the following structure:

```javascript
{
  tag: "button",
  attrs: { id: "save", className: "btn btn-default", ... }
  children: [ ... ]
}
```

The function that you write needs to convert the structure above to what is expected by the
virtual DOM library that you are using. Note that your function will also be called for each
element in `children`.

You can optionally pass a second parameter to `sv` to indicate something other than `className`
as the property to use for CSS classes. For example:

```javascript
const h = sv(func, { className: "class" })
```

This would use the `class` property in the `attrs` to indicate the CSS classes.

So you need to write a snippet of code that you pass to `sv` to wire up `seview` with the virtual
DOM library that you are using. Below, you will find examples for 8 libraries. Using a different
library is not difficult; you should get a pretty good idea of what to do from the examples below.

Also, please note that the snippets below are just examples; feel free to change and adapt
according to your specific needs. In fact, this is why these snippets are not included in
`seview` or even as separate libraries. They are just a handful of code, and you might like
to tweak the code to your preference.

## [React](https://reactjs.org/)

```javascript
import React from "react";
import { sv } from "seview";

const h = sv(node => {
  if (typeof node === "string") {
    return node;
  }
  const attrs = node.attrs || {};
  if (attrs.innerHTML) {
    attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML };
    delete attrs.innerHTML;
  }
  const args = [node.tag, node.attrs || {}].concat(node.children || []);
  return React.createElement.apply(null, args);
});
```

[seview + React - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyucpXMgyKEADuuGAyABQMQkgQ3ppywCoMcgpkcmHwAJ5YEEKpkdHeSj5q7gBOFAwA5moAlPGJycmlEDalSfkQANwNckY9bh4Y8PClYN5yHbhDI2MAPrPxRt1JKWnTo7gVDBClABIAKgCyADJ1CSvJ62C4SBhVO0LWYFAZAMotAJIM23tHx+PAOQAfSBPD4qDkV023x2BxOvWWjTk0RgiEhww2W1hf0RvX6InckNKlTGPlok3gGEqxAmUQgUwxcwWwCMAF1cI5YEMInSOVwqEhmkl5nJaKyarjmq0kgAlCAYBAc5pDCAAURgrFEUxwLwi1igUBpGGJYAliSMZoYAkgMAQFAJ7AAjAAmVAABmMphATFY7GwdiIpEcYng7FgUAwYDGAGFHk5SnIIAAPMRIMZyhXwXCx5hYETODznZLCXP50QAdSoUEOcfgYTOPWS8H51ysr0piDCgOE1lEELdvUtyT6KwqsFK9fqFzkzYorZa7ZVXbkPb7M5bIQ79NXHgA1HJHYPcSOms5ohOG9OpdY2p4wrQ1Po1MRG40H+AsHdn3I1LHe4hSghNQ5H3WdWy3Dla1ZF9p2Sd8nxIV8kXfAAjaxhhEXAUPgBgsJwgBaLBymYY0Mm-QERGjKAKFgABrCEwOhccsIqJB0hbOoTB-EAvnHCBNXgNRWSQuRhOncVj3NRJEnDSMxgAQRwRMUzPdN5UVHM822UQp1PBhz0nItGmvW8uHvR9ZEg0QMAqHZnxE98uEdb8SggfwghAuQMwQZSWCwGAhJgpE4L-eMxKRCSehHEdvPgAARAB5Q5cCFAyzNoRSsHFI0cEtBwhFzKgdnYFCMBQ6BrWgOB4HtBgaBAR0ADZ3WMaCQGohhaJoehvXMdhlUVaIZGgIQsAEghAxAG9+HQHh4CwMBUB0HReywWjKkg5gdAG+AVuYJBtvUrMhpGsaCwmgRMmydgwHHCgsFDEwzF9dAdvwpACpuNzTvG+xSGm9g5oWpaVoYNaNpLQ7M3egq9oOt6PuYL7hqgUbfsmq6LHAO6Hs9Z6sZQoQhHgMpsFwZgKg5KMBAB2bhmB5aSKTWAkFwwnidJrAWdwyH2ZJkZsB0AAWXA3VFnRYCjHQ+c58nKcljGsix9wMhgPHepe8A3ICQIadKGaQCBxbltW9bNp0PwdYAATFgBWcXpHcC3taCC7SExm6ccetqfWVl3Ai8o7jCAA)

## [Preact](https://preactjs.com/)

```javascript
import preact from "preact";
import { sv } from "seview";

const h = sv(node => {
  if (typeof node === "string") {
    return node;
  }
  const attrs = node.attrs || {};
  if (attrs.innerHTML) {
    attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML };
    delete attrs.innerHTML;
  }
  return preact.h(node.tag, node.attrs || {}, node.children || []);
});
```

## [Inferno](https://infernojs.org/)

```javascript
import { h as hyper } from "inferno-hyperscript";
import { sv } from "seview";

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key === "htmlFor") {
      const value = attrs[key];
      delete attrs[key];
      attrs["for"] = value;
    }
    else if (attrs.innerHTML) {
      attrs.dangerouslySetInnerHTML = { __html: attrs.innerHTML };
      delete attrs.innerHTML;
    }
  })
  return attrs;
};

const h = sv(node =>
  (typeof node === "string")
  ? node
  : hyper(node.tag, processAttrs(node.attrs), node.children || [])
);
```

## [Mithril](http://mithril.js.org/)

```javascript
import m from "mithril";
import { sv } from "seview";

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key.startsWith("on")) {
      const value = attrs[key];
      delete attrs[key];
      attrs[key.toLowerCase()] = value;
    }
  })
  return attrs;
};

const h = sv(node =>
  (typeof node === "string")
  ? { tag: "#", children: node }
  : node.attrs && node.attrs.innerHTML
    ? m(node.tag, m.trust(node.attrs.innerHTML))
    : m(node.tag, processAttrs(node.attrs), node.children || [])
);
```

[seview + Mithril - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhysAJyGwIYMABBeHgvMDklOQAKDBCwiLlgIwBKCM1ElQY5OQB5ACN8OHhcAGsIAE8wGLiwZNwyIS8AUQxYLiiy8rSMrOyFMmjO3HcML3gwAHUKeHa1ETVk1OBMvr63DxkMKGsIBNjQsFpOgF0AbhXVuSRoCEQ5fbCjirOL1YfDofghABkhAHcIF4AMIYSBRZLHBKbbYQc69bJGC4pC5eW7WLxZd5woxwzLrORcBKQGQUCB-YYyKIMITXNIXKLwcpYCBCAbU2lKTlyNTuLwUBgAcwWFwA-Ik5PAMALUNyQABiNTEORtKhIVEMGXs3aI3qamkQXDvOQAMmNci1hpquH5DEBAAkACoAWW+rzkYuYVP1uElAqVzB9Xms7i910tB2tDFtXkdLsWbplnotvqV3l8-iCNVDBveySVFpVUDVzjkAB9S3JaMdkplknCBJAYAgKCIaCAAIwADlQAAZjKYQExWOxsHYiKRHGJ4Ox8UChNYnF4EmQF82ROCetkYB5hAuPJEe7jeiuGGusvzYF4N8t4cr56IANQPuEIzIotEYzd9ElkmUyLXdO0tBqPoiputkwHgFgGAMIqspznugIymocgPnee7HMQ4GViBshgbeqyQXk1ghCIuB5PADDkZRAC03gUMwozlHBwByCIQJQBQsAlDKF5LiYsoAJKnqirCiGoxzYZJt7Vki2JHvigQ4AkN7ZD+fx-gBSjpEBuEyLgk4YPygL4YRahcO2cE8hA6moXITrTFwfJQHIEAAB4sFgMASVht60Ahi7SdkskMDib4MAGzD3vAMQ4EqSlYHWmQOEIzBYFQgLsHkGB5NADY3GebbtgAbL2xiYSAnEMCUND0IO5jsMwjnOQI6L8OgPDwFgYCoDoOgLlgJQCgZqU6E1MzOQAAu2uAzcVY3NVQBDjiAjLMuwYCXhQWDTiYZjDugeRCEI4yhNguBNVRsABK1XjtSAnXdb1Y0YG5sBIFRR0nby2DvVdo1fadXjYDoAAsuA9hDOjXWAOiAz9eCXQZN2kGtFjgIyMD9vt6PEqSfy3fdj09X1A1DSNzA6HjZKTZDACsUPSO4VM2fjy0CGjG1bTt5WkEOuOs2S9mLfwRhAA)

## [Snabbdom](https://github.com/snabbdom/snabbdom/)

```javascript
import { html } from "snabbdom-jsx";
import { sv } from "seview";

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key.startsWith("on")) {
      const value = attrs[key];
      delete attrs[key];
      attrs["on-" + key.toLowerCase().substring(2)] = value;
    }
  })
  return attrs;
};

const h = sv(node =>
  (typeof node === "string")
  ? node
  : html(node.tag, processAttrs(node.attrs), node.children || [])
);
```

## [domvm](https://github.com/leeoniya/domvm)

```javascript
import { sv } from "seview";

const attrMappings = {
  "className": "class",
  "htmlFor": "for",
  "innerHTML": ".innerHTML"
};

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key.startsWith("on")) {
      const value = attrs[key];
      delete attrs[key];
      attrs[key.toLowerCase()] = value;
    }
    else {
      const to = attrMappings[key];
      if (to) {
        const value = attrs[key];
        delete attrs[key];
        attrs[to] = value;
      }
    }
  });
  return attrs;
};

const h = sv(node =>
  (typeof node === "string")
  ? node
  : defineElement(node.tag, processAttrs(node.attrs), node.children || null)
);
```

## [petit-dom](https://github.com/yelouafi/petit-dom)

```javascript
import { h as hyper } from "petit-dom";
import { sv } from "seview";

const attrMappings = {
  "className": "class",
  "htmlFor": "for"
};

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key.startsWith("on")) {
      const value = attrs[key];
      delete attrs[key];
      attrs[key.toLowerCase()] = value;
    }
    else {
      const to = attrMappings[key];
      if (to) {
        const value = attrs[key];
        delete attrs[key];
        attrs[to] = value;
      }
    }
  });
  return attrs;
};

const h = sv(node =>
  (typeof node === "string")
  ? node
  : hyper(node.tag, processAttrs(node.attrs), node.children || [])
);
```

## [DIO](https://dio.js.org/)

```javascript
import { h as hyper } from "dio.js";
import { sv } from "seview";

const h = sv(node =>
  (typeof node === "string")
  ? node
  : hyper(node.tag, node.attrs || {}, node.children || [])
);
```

## Credits

`seview` is inspired by the following. Credit goes to the authors and their communities - thank you
for your excellent work!

- [How to UI in 2018](https://medium.com/@thi.ng/how-to-ui-in-2018-ac2ae02acdf3)
- [ijk](https://github.com/lukejacksonn/ijk)
- [JSnoX](https://github.com/af/JSnoX)
- [Mithril](http://mithril.js.org)
- [domvm](https://domvm.github.io/domvm/)

----

_seview is developed by [foxdonut](https://github.com/foxdonut)
([@foxdonut00](http://twitter.com/foxdonut00)) and is released under the MIT license._
