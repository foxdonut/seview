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

If you are using the [Meiosis pattern](http://meiosis.js.org), `seview` is a great way to further
decouple your code from specific libraries. Your views become independent of the underlying
virtual DOM library API.

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

In these examples, we assume writing views with the following attributes:

- `className` for the HTML `class` attribute
- `htmlFor` for the HTML `for` attribute
- `innerHTML` for using unescaped HTML
- `onClick`, `onChange`, etc. for DOM events

> You can also see `seview` as a way to use the same view code for different virtual DOM libraries
by looking at the [seview + Meiosis examples](http://meiosis.js.org/examples/setup/index.html).

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

[seview + React - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyucpXMgyKEADuuGAyABQMQkgQ3ppywCoMcgpkcmHwAJ5YEEKpkdHeSj5q7gBOFAwA5moAlPGJycmlEDalSfkQANwNckY9bh4Y8PClYN5yHbhDI2MAPrPxRt1JKWnTo7gVDBClABIAKgCyADJ1CSvJ62C4SBhVO0LWYFAZAMotAJIM23tHx+PAOQAfSBPD4qDkV023x2BxOvWWjTk0RgiEhww2W1hf0RvX6InckNKlTGPlok3gGEqxAmUQgUwxcwWwCMAF1cI5YEMInSOVwqEhmkl5nJaKyarjmq0kgAlCAYBAc5pDCAAURgrFEUxwLwi1igUBpGGJYAliSMZoYAkgMAQFAJ7AAjAAmVAABmMphATFY7GwdiIpEcYng7AGcn8QXGYXcKqNdoJdSUmh6XDCtDU+jUxB6yQz4Cwd2zcjU+wgzGypSG1maEOLscQuEQFZ21earJzF1FJULDGLgKxvxOdZAADJopVOgBhNS9Du57sgLMkBd5tQAI2swxEuHX8AYu-3AFosOVmMaMv25CIp1AKLAANYQsJJuIK+D2hjXCqwZqa+Avr0NJqF8v7ls48BqKyC7QSs4rLIksBQBgYBjFOjxOKUcgQAAHmISBjHK764OhFYiBB9QrMIZHbKIADqVBQIcGEAWcC7hjaqQ+PA-JgLiyScSELSvJSiBhICzaVm2EAQs6bq9JaSKCe+n6kpRSLJD+f4QRCglaeBWrrhUSAxtAZA1AuSw9H0Kz6f+gHnEiPEUNcVgiSq4lyJJratDJXm8SEon0t5Va+XIADUciOgpuI2U0zjRKUDkLlKNZJJGgTpAFDYQDSznXCpiaxeaiSIchqFyAAgjg2F4QlhHyoqpFYORojqXIQqJclXapW0njppmsgciIlIVDs2arouXCOsWJQQBlEVyERCC1SwWAwFBnYaaK6HWJhsFIvB1klQwy3wAAIgA8ocuCdTsYRprQ1VYOKRo4JaDhCBWVA7Ow64YOu0DWtAcAfg66AABzusYHYgHeDAPjQ9DeuY7DKoq0QyNAQhYP+BCBiANb8OgPDwFgYCoDoOh7VgD6VMNzA6Oj8DU8wSBM418A3PN2O4xB+MCJk2TsGAv4UFgoYmGYvroMzR5IF93NY1AON4-YpBE+wpPk5T1MMLT9PURz77y19rPs3LCvMErvNqwTQsWOAYsS560uO+uQhCPAZTYLgzAVByqECJrJPDDrVPnjhsBIAeHtez7WDRweRtx97IzYDoAAsuBujnOiwKhOipwnfsBwX9tZI77gZDArsozL4DzQEgTB6UxMgNrFNUzTdMMzofjNwAArnACsefSO4-dN0EAukA7IvO5LsM+lX0+BEtnPGEAA)

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

[seview + Preact - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyucpXMgyKEADuuGAyABQMQkgQ3ppywCoMcgpkcmHwAJ5YEEKpkdHeSj5q7gBOFAwA5moAlPGJycmlEDalSfkQANwNckY9bh4Y8PClYN5yHbhDI2MAPrPxRt1JKWnTo7gVDBClABIAKgCyADJ1CSvJ62C4SBhVO0LWYFAZAMotAJIM23tHx+PAOQAfSBPD4qDkV023x2BxOvWWjTk0RgiEhww2W1hf0RvX6InckNKlTGPlok3gGEqxAmUQgUwxcwWwCMAF1cI5YEMInSOVwqEhmkl5nJaKyarjmq0klhmhgENwedFcJTqbTlVc5CKWTTJrB+VBBc4tQsxRLEkZzQwBJAYAgKAT2ABGAAMqAAbAB2YymEBMVjsbB2IikRxieDsAZyfxBcZhdxDCA0+XwB0MMB1JSaHpcMK0NT6NTEHrJfPgLB3ItyNT7CDMbKlIbWZoQqsJxAqusNpvNVnFi6ikoVhhVwFY34nVsgABk0UqnQAwmpen2S4OQIWSGvS2oAEbWYYiXC7+AMY+ngC0soozAwpQyo7kIgXUAosAA1hCwpm4im09cKlgZpWFEb9ehpNQviAutnHgNRWTXBCVnFZZElgKAMDAMYF0eJxSjkCAAA8xCQMZZQgFNcBw+sRFg+oVmEGjtlEAB1KgoEOXD4DA84kSjW1Uh8eB+TAXFkgEkIWleSlEDCQFEHrHYewgCEACYXV6K0kQkv8CQBbcFAYaCQPgCEJMA4DYOPCokHjaAyBqNclh6PoVgsmDQLONdhIoa4rGkxM5LkBTu1aFTgpEkIZPpEKlLCuQAGo5CdTTcVcppnGiUoeLXKVmySGNAnSSL2yTCLfKme0CS0vEGFctCMKwuQAEEcAI4jMrIuUFWorBaNEeiMoYLKcoHPK2k8PMC1kDkREpCodiLAyyy4J0qxKCBCsSuQAAVuo8IiWCwGB4P7JFSxw6w8KQpEUJci1EnIyihRG3NaFarBxWTHArQcIR6yoHZ2F3DBd2gG1oDgVNHXQAAOVAXWMPsQFfBh3xoeg-XMdgnoQARm34dAeHgLAwFQHQdCurB30qWbmB0XH4AAAVh3BVNwABOPRfPgBn9oIEMQEybJ2DAICKCwCMTDMAN0F3IQhHgMpsFwZgKg5LD8dKQmQGJ0nyZ0W9CNgJAz3lxXlawE2z0YnRzaVkZsB0AAWXAXTdnRYCwu2FYdxs8DVm3NdIYWLHATIYB9GWw78AJAi1nW9bJimqZpumdFjoImfdgBWD3pHcDPNrjgWBFD0XxclpHSH9GPi9jPaKLxowgA)

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

[seview + Inferno - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQiwD2AdmOTGmbVNpCqQGYCWMRqA2qJQwBbCPWx4AFvCFQSDSogX0APEg4A3AAQckAXgA6mHIYB8ygPRr1JkAF9iA4aPSR4AVzyE5FBRCXofMHhNLAAnclgIMDAAQXh4ULBNXU0ACgx4xOTNYFsASmSTHP1KTU0AeQAjfDh4XABrCABPMHTMsDzcNnJQgFEMWAlUxqbC4tKy7TY0keTdFMMpGQAxHsMC4BLJycDg9QwoNwhsjISwXhGAXQBuLe3NJGgIRE1TxIvmm7vtt-PDbtChku2X2hwgtwmZVs3000EgUzSv1wHEolAgoQAEgAVACyABkNjCykikBhKABzdHkNxgKBNADKzwAkqj0dj8dlgJoAPrcpZQVCvdrI1mY3F4zS2CH3B5PF5IlFosX46WTaETfJ3ULPNyhUq-CFSkolXaaCTZSDqDgQADuuDA6lSlHIj0Kd1S8CaWAg5Gmztd8wW4ASKPJ6zuAH5NP6IHdBSy2OjnbghjHcPAMOTiCFwpFonEzk6XRBcL88tm04MuEhtaUAD51zS8S55Ep5a5ySAwBAcKg8EAARgAHKgBwBmOwOECCERiHAEIikHyKeD0U1W23ZVJBDIQbMDeC96gFXQmO5DXiGKyGYgwy-gLBkm+aQxYiBCb2hDK6iCC587xB03fT9v21S5b0hJtDDAR9KGfLlFTZcU-xAAAyR5yWuABhQxJXAu8rw0G8iSgkBKjceIqFwSp4EoajaIAWjCDghAwUImngzQqCwqAOFgepBVSE8igPI8wBFWBtREBQhMlbNDBZST3z8eAgRhS47hbCETSYaJNCw6lfFCWEAA9FCQJIEyTchcAMj8qBU8Yygoey0QUAB1LgoBxQz4FkzZINNLtphSeAJA4MBVTKYL7WeekM0QVIuUQD90VA39NAAJgABkldsYRi0S+05EiUSU6T4EFGKyqklTqJRJBt2gNhW0go0NTuGrlJkwlILCiLYvgeLdySzQUpA9xtUFfrxIAktxrSybjgAak0Ac8tVdUylrR5Qn8mFtUm0oNxtD1wtmhK9zG87Sx7Pt8o6yh1R0jA9JiHBTPMyzKETPUbLsrAHIUJzNB29F9sgw7dVKC9CPUXBlwwFF0WIyCynvCQB2faCIBOzRVqsv7TOELAYCBCCZV4Ay3CMjTIK0u51XVQnkzBvaL3erAW33HAHu8cgPy4dF6EqDBKmgTsnju6h6BHbK7HAkBeMoeoeH4acnHoFFfuTLxSF1WR0CkeAsDAVBzHMGmsHqckEYF8xtesgABABWXAx1wbLLAi+AHZ+6yFzkT1vXoMBJI4LBV3sRxZ3QR2-oYiQvXRMPQgjuo9ZAA36GN03zctyhrdtly-Z18hE+TxJw8j133c972glL6yK8-VP08D0hg+ccBq6jqcZ27ypyHIeAgi-PAhBRBHojkbOjfiPOLdYkzYCQOih5HsfsFXuiS430eEmwcwABZPfr2BonMfet4nqeL8XEAu9Dz06GjjXY-AXHrRtWfQkNkBc5mwtlbG2dshDmEtN-J22VcBuy9moRukDbQd0fsnUOvcFakAHqHL+m4WbkDsEAA)

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

[seview + Mithril - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhysAJyGwIYMABBeHgvMDklOQAKDBCwiLlgIwBKCM1ElQY5OQB5ACN8OHhcAGsIAE8wGLiwZNwyIS8AUQxYLiiy8rSMrOyFMmjO3HcML3gwAHUKeHa1ETVk1OBMvr63DxkMKGsIBNjQsFpOgF0AbhXVuSRoCEQ5fbCjirOL1YfDofghABkhAHcIF4AMIYSBRZLHBKbbYQc69bJGC4pC5eW7WLxZd5woxwzLrORcBKQGQUCB-YYyKIMITXNIXKLwcpYCBCAbU2lKTlyNTuLwUBgAcwWFwA-Ik5PAMALUNyQABiNTEORtKhIVEMGXs3aI3qamkQXDvOQAMmNci1hpquH5DEBAAkACoAWW+rzkYuYVP1uElAqVzB9Xms7i910tB2tDFtXkdLsWbplnotvqV3l8-iCNVDBveySVFpVUDVzjkAB9S3JaMdkplknCBJAYAgKCIaCAAIwADlQAAZjKYQExWOxsHYiKRHGJ4Ox8SSyQkoiNEErWvAWwxanTeu1aGp9Iq3bvwFgMAxFbKHRBmMyvLF0RAZeelwbENfAXfUcdiIeeSezyRxRte1nW+R8QGNa4BVOIE1DkIwvx-EB9xIN1siPPJrBCERcDyeAGBwvCAFpvAoZhRnKc9gDkEQgSgChYBKGVwW6Vd1zASNYFRVhRGYkxZQASQYTir2ceA1GON0JN6atcSE1sPCBIRrCcLwEjIZTmxEZjll6GAPFfG8P12SIACYe1k7J1KEtcRAUISuNE7S3QM98bFRABqdy4QRTIUTRDEelWOc-hlGQtW6YKoiolzbzc7UlSo-lhO4jxkV6HFMgys85I3DxAhwBIdOyYLQvCpR0h3PdZFwScMH5QED3hSs1C4dtzx5CBgrkdy5CdaYuD5KA5AgAAPFgsBgcTvya2hFOUxAvCk7Jq0y2SA2YJSeNHJV8qwOtMgcIRryoQF2DyDA8mgBsbk0jd2G7Pt4NIOiGBKGh6EHcx2GYfrBoEdF+HQHh4CwMBUB0HRlKwEoBRqo6dB+mZBoAAXbXA0YANgR36qAIccQEZZl2DATiKCwacTDMYd0DyIQhHGUJsFwH78NgAJ-q8QGQGB0HwYRjARtgJB8Np+neWwIXWfh0WGdvLAdAAFlwHtlZ0NmwB0GXxbwFmavZ0hCYscBGRgfsqaN4lST+DmuZ5sGIahmG4eYHRLbJZGVYAVlV6R3FdzqrbxgRDeJ0nyeML9Pup8AA-nPqkaoYwgA)

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

[seview + Snabbdom - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0YJgCNrSIcwC0hAB4EipYaIjj0agK6QcmDwAE4UCGoA3CoMsTIYoXIAygBqAOIAcslySnIA5DzwWKg6OgDulbjlAMy4QqEA5joATAAMHTpgMo35MQwJScxCSP7U2blytIVCQgDW+cQFIosFIQCeMKv5sFAYYGDbWKFCWIdL+RjwYecFSFf7EPD5ALr9g8FQERCTAIKhoQw61wxyE8DB6ywEFwYC+sAg-ViZH8DAQFBECjAAAVwswKPBZBAABQJKAASjkwFicjkoSe-lCDBp8EhECEZDkpNySjy+RC4QYvRpcgAPiLqcLJczWezORgoNzeQx-MxrBBQvlhWKJVLhSyobKuTzedZZjAMAxNaLxUzdXqZRyjTy1utVUIoFbrTq7U68sqoAq7brtbag765CikBBKAxkP0jLEkSi0RiGA1mPKKAAvCC-a6hMBEq43JYMMAAVQASgBJJZRsjZJbDUbUClU20fDNYSbAORl1B9is1uRGfo0sgNOQkxIKSZtJYwJl5ZtjCBgXCLxrwLhRWcSOSL3cUADUx7b3s7I0mK+otAob29FDIRfzYFozZeZO9NK775GL0mYsCz-JAH1tBNbQnUJpySOYIHWBQmSAsBz1DBRnzghCAEJnXyTDNQAMgIuRMLkHDeV2fYwEycxDjkIiSPgsjcMgGAEAafJUN1D5FBcSZMNwCgGCjFwAHln3yRxOLHKUnyJXi5E0OQ2i-NDJQwJAkDzMIiQE2FviJecFCQFwySWPS4WJXjjwARjMuRkNoTDPxkyVoCCOSsN-ZzVKDDStPzIl60bRj1iWRyfNckcJQgmk6XgBkmS7RFIOTAkMX87ToKYVgwCwDB4XM+CllJLjhQ+Mtr2wWgcrXfL4QAsUp1-Wq8oKiAALyYAjDJKKyyc+DOrlKAZIgiCk1RdKmWsfwqCQAAxE5mGSMIhMaAAVDBGiJMsq1rORguSJsRlXMAlngLbwtfJZYC4Oa6QYVCJTk5CYWgOBwVCMrmS2yYLsaORjwc183rYz7Rue59Xsog4aNy765SSWBKryaG9lh2iov+v7fqB-JcE1IGiW-OR-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)

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
[seview + domvm - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyM8eACcAsthYFAwA5mBySnLAKgxycmqwUBhgYABy5mqo8YJJKWrEMXFqPHwAYkI+mdlkFfmF2cEMED4AEgAqfgAyVWq4jc3tXWoxRgDcMTFuHlg+QrAQKQCC3j7hkQAUXr5rUUYAlBGaUfUA8gBG+HDwuADWEACeYJsrYHu4NT4AohiwXOt390Ox1icQUZDk-weuHcGB88DAAHUKPA-moRGo9gdoiDQXIpnIZBgoNYIBFPC9aACALrjHGgpDQCCIcnbSkPGn1XFbVZs+64eBCTpCADuzQAwskIOs9lSyYTiRBabijJy5NBIMDcXF8QKydyAjhgmFeRy6XEKOD1gKsarcfj5SS9RTqUqtXEGTBmdywCbXW7vbQBbLIg7Fba5Cq6ZG4vtXT4mdYfLFvbSxhMGPiuGTIDIKBBhdCZOsGEIGYd6lb7lgIEJwSWy0pG9l3D4jRj6gB+OT1iD1LJIITMGTMXAMyhNT4wViiYuliD8jAhYhyGZzBZgZbbWcM3DevbLnu4X5UJDx2IAH3P3esUCgexie1GAkgMAQFBENBAACYAByoACMAAMximCATCsOwgQEEQpCOGI8DsPaebCmS6wwogy4-PA74MK85YgrQaj6HUdKEeAWAYAw+TZG0EDMNWPheImEBZNR6Hzog9HNEx8ZUgUpFqGAFFUSQUQKAwTStB0nSsSAABkDIhKMYpqBGfGqmRxEkOGZFnNY3giLgZzwAwRkmQAtDMFDMLC9zUcAcgiGKUAULANxZNKQJYThYB9Bm8bTvAnkmNkACS-l0c48BqFSqqxSCpqTB+HhikI1hOD4ZJkOlb4iJ52JxJ6cicQxPGkpEX6AbS9TZRm2EiOJsABVF+WqiV3E2PGADUXV+gSI7xqeGDCtKrqRvU8adbEBWgrm+YeQcShHHNI0Oe1jGdaSIUOcETWRaIEb3iCaYMCdSW4R4wjpYgmWRKl13NKN6b4osOBkjNK0LUCfyabIR4iPAGDBM0JG4mRXD-tRgkQCtchdXIA5DswaoAB4sFgMAxfxdppRluArdK9RUkdZ1URmyVyK9WAAGrIahi1HOsw7Lswc53kCVP48h6ysx6j7ne4-Vkojw5HvGXgQLT+brFTUvCvzDCi6z13rAOsDWIFuAhEyk77fAABC9yhUg6xqIEGIKw4g5BDAPjsGcGBnNAz6MrluHsH+wFGHxIAuQwNw0PQYHmOwIvMAIib8OgPDwFgYCoDoOjpVgNwhP9zB6IOw4AAIAMy4Pnud6BQ7g6Nlt6Z0j7w3lAuDMME0ECPAVYWOATUUFgCEmGYEHoGcQhCPCvjYHXDewCkEc+FHIAx3HCc6DZKOwEgpn94PLbYMvpnCBna9D4xWA6AALLggGnzo49gDoe8b3g9fbxPpDN9W7DuPcMAgT3rc5shk-T7P8dE7J1TunHQP98zZzPgAVnPtIUu4CCz2Cfi3V+7dO7GB9uBb+MM6Zh2MEAA)

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

[seview + petit-dom - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyM8eACcAsthYFAwA5mBySnLAKgxycmqwUBhgYABy5mqo8YJJKWrEMXFqPHwAYkI+mdlkFWoxRgDcMTFuHlg+QrAQKQCC3j7hkQAUXr6DUUYAlBGaUYVyAPIARvhw8LgA1hAAnmAj-WCTuDU+AKIYsFxDW9szc7FxCmRy1zu47hg+8GAA6hTwVzUIjUk2m0QejzkrTkMgwUGsEAingOtBuAF0mhDHkhoBBEMixqidhj5pDRgMidtcPAhAAZIQAdwgPgAwskIENJmikbD4RBMZCjKS5NBIPdIXFoTSkeSAjhgmFKSSsXEKM8hjSwcLIdDeQiZSj0QKJXEcTB8eSwErjSbLbQadzInr+dq5EKse64lNjT48dYfLFLZjGs0GNCuEjIDIKBAGe8ZEMGEIcTN5hrtlgIEJnkmU0p89l3D4FSD5gB+OS5iDzLKZ+D-AAiQmY3ETyYg1IwIWIcnanW6YD6YzbONwlsmParuEuVCQvtiAB8F3JaGjJjFJg0BJAYAgKCIaCAAEwAdlQAEYACzGUwgJisdiBAhEUiOMTwdi6mMMpFDD6IHsLnrA9piUTR5loNR9HyYVIPALAMAYfJsgAFQgZhMx8Lx-QgLJkP-DtEAw5lsN9NECixOCwAQpCSCiBQGAYZkAAkUL8Wk8JAAAyHEQgaFk1DdcjYKg2QYJVFc1CWaxvBEXAlngBh5MUgBadoKGYT5tmQ4A5BEFkoAoWANiyTk7iA-cGDAXBglgX1WFEMyTGyABJMN7OceA1DRYUfIeZUWgPDwWSEawnB8JEyDCvcRDM8E4nNOQiMw0jEUiI8AAZMXmKKw2A2JbI8xytSxZKSJsX0AGpKptORfXnHEfE5Y13XmX0KtieLHmjWNTNA2YeoZIZdLKrCKsRZzdMK9DPLddcHhDBhFsCqyPGEMLEAiyIQo25lmtDaEehwJEusGvq7iuOD9GnER4AwYJmXEyE4K4c9kLUKNvzkSrezxf4VKQZsRQADxYLAYG8iidVC8LcEGzl5jXepsoYRKZCrJEGGsKAoExaEOiEDxIkB2BrAc9YQjxU4YHJgAhbYXKQIY1ECEE8aCurmWcRrf368UoQ5jHIiOvB4fm1V1QAQnR9sSshAn1kCbmWS4WchjrRtm1wZgYfgEcIFBFr5lFREuriDX4CbFsEPgS59Z7GWcU3eZPRhIXK3bYNMXq7m9udhgHGbIIYB8dglgwJZoG3XEYqs9gAA5UAy4xyJAQyGA2Gh6Dvcx2AtgGteYYJnwEf1+HQHh4CwMBUB0HQwqwDYQhu5gdHzwHmAAAQy3Aj1wDK9Aodw27++AC5bIulPsUh4AzCxwDsigsA-EwzAfdAliEQmi2wbXi9gFJS58cuQEr6va50TTgdgJAlM37ffGwG+lOEVv7++R+sB0S9+-7nQD7ADod+O88CT2nIfGec92DuG2DAG8a956fVjEfE+Z8a51wbk3FuOgkEMm7rgAArH-aQw9cEl0gZmaBi9l4p1IPeRBEBBq-XrGPDuxggA)

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

[seview + DIO - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt0keAFc8hAcNERx6R2HhyucpXMgyKEADuuGAyABQMQkgQ3poqDHJyYfAAnlgQQmRykdHeSj5q7gBOFAwA5moAlPGJAPzZURA1cqhy0kLcEY248BhlxA3RuBjw8EVgcgA+k3LAJoMQuLBcVEhFzlMztAC61QyVANwCkDAIFCI0IADMqACcxqYgTKzs2HZEpI5i8OxuHv5BbxJdwjCADDBnC6VWLNWhqfRqYjNRJw8BYDAMRFyNQAFQgzHSRRG1nWrSxIMQPXxhOJ622SISiTkqLA6MxJFmCgYDAgRQAEjiALIAGTJIAAZNEygcAMJqORGenI5nw2SI5UotQAI2soxEuC18AYBqNAFosCVmBgiikscA5CIZVAKLAANatMLQpSaOQQ+DnBhgXClWDrViiT0KgZqACSDFD+Oc8DU22VqcZ2wO8XifzkMqE1icRSBZELkIYkeAzRgHkQBN5tJiPgATAAGLOYxml+P+kRchPh+CV5V1mk2dYAagnHaZcnW6wY0SKnpnCuzjPW44SVcZiQBgQ9Xp9+7C9tHDfHMXm9pDYaTCr2iSMHef69zwkLiGLPnzn95K7fC4PAAQRwIEdz3AIDySI9PDCVF9CWERelKXl1V3FUQC4ABGLFCggfc5AnOQABEYwAeTkCAAA8WCwGAUwZWcPyLXAT0fORdniV9O1zIohCEDwfCQIRYGsQdcDKCB4AAURgQcACEUhjJAwjUN4qg7PjeWcJcgUjb02nOXAFyXMJQLwdiBn4wTDnieddP-OyGAcIQCSoXl2C1DAtWgY5oDgXtA3YAAOVBW2MekQGdBhXRoegnnMdhxKQXBmFKAgPhAEl+HQHh4CwMBUB0HRCywV0yiQ5g9GMwgAAFblwbDcFbGr3FK5hUvS417FIVJ0nYMBQwoLAfhMMwXnQLUBPgYpsDSjLYDALKcvYfLCuKnQrWo2AkGNabBLmrBduNYRqoO2axmwHQABYWpanQlrAHQLqOhbTuWgR+oscBUhgB4Jp+vwoIEVa8tGDaSrKiqqp0YGgjq1tcAAVge6R2vh4JepAb7BuG0bItIZ4gYIqDSIo4wgA)

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
