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
  {isMessage && <div className={"message" + (isError ? " error" : "")}>{message}</div>}
</div>
```

Or even this in hyperscript:

```javascript
h("div", { id: "home" }, [
  h("span", { className: "instruction" }, "Enter your name:"),
  h("input", { type: "text", id: "username", name: "username", size: 10 }),
  isMessage && h("div", { className: "message" + (isError ? " error" : "") }, message)
])
```

You can write this with `seview`:

```javascript
["div#home",
  ["span.instruction", "Enter your name:"],
  ["input:text#username[name=username][size=10]"],
  isMessage && ["div.message", { className: { "error": isError } }, message]
]
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
DOM library that you are using. Below, you will find examples for 3 libraries. Using a different
library is not difficult; you should get a pretty good idea of what to do from the examples below.

In these examples, we assume writing views with the following attributes:

- `className` for the HTML `class` attribute
- `htmlFor` for the HTML `for` attribute
- `innerHTML` for using unescaped HTML
- `onClick`, `onChange`, etc. for DOM events

Also, please note that the snippets below are just examples; feel free to change and adapt
according to your specific needs. For your convenience, these snippets are available in 
`seview`. They are just a handful of code, though, so feel free to copy them into your
project and tweak the code to your preference.

## [React](https://reactjs.org/)

You can import this snippet into your project with:

```javascript
import { h } from "seview/react";
```

The snippet is as follows:

```javascript
import React from "react";
import { sv } from "seview";

export const h = sv(node => {
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

[seview + React - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIADLgAjABMuHE6bhAYCDoUDEgQAB64zIRqANwqDFV2YJ4R0XJKcgAUdRiIxHLZ8BQiYACUTZpVcj4ttGr6asSjY3KT4FgY1SShIAAqEC4Qbh0Arpmo613tiLiIO3vwhxAAurMM8wthy6td3nkMuwASGwCyABljmoAGQFADm5QAwmo-A85mNFtMSIj5osAEb7eDwES4DHwBj4wkAWiwbmcGDcAE8Zl45CJoVAKLAANbHFpDJSaboIPoMMC4PKwTKsUScvxdNQASQYIu2DngajuaJVTzkdwGlWqcqgGDAYDk0KE+3sbjkRTESENACUsghcMaXCJFV45sJnd9RAB1KhQf4m8VDYBo2qeSBQMhNOTwLgUMDa54Rsi4SDwADK8A6EBa3kuWF2ByOcmScT8WrRydwPX5huaIfVz2FosVxyrzYVonxeSQbWgZAGaKMib8cw7YvgEobz1j8dTEAzWcQuZj2wL11ux1ngrOEAua8LN0ycgA1HJEuWR0Y5pl8rsp2jMkeng0oi1t6mlxAuh+a-0K+q14MEBNR6gacgAII4BahRWra9rwI6wSuF6njTnIt4FG4D6NhhC6HE8XATFMsi4HYWZ5LsMxokiahcIkdJhBAr6nnIdo9DBLBYDAyqPM8SLGqaiBuGqzyaleVRAexCAACIAPL-LgmH3kRtBQVgmpdFYAG2MhVC7OwGIYBi0ACBGcC9P07CJKgcTGA8IDMgwrI0PQIBMKw7CZD0uAFDI0BCFgE4EEQpCHPw6A8PAWBgKgOg6KaWCshCZHBBkCEJcwSDpT5fkBUFiohQI8DUgW7BgCKFBYPAximO55heQhJJIMEvnMflwU2GFbgRSAUUxXFCUMElKUejlCDNWl+xZeN8CTcwbX+VAgWdaFIAlWV6AVRS1W1WYnnoBiQhCPAdR7HgzB5GRBoCOF7D9bF8XMBghSwEgRJHSdZ3YG9RJjZ9p3wOdOgACxpGkOiwAaOgA99F1XVDa0bRY4AlTAe31Qd4DMZEUS3T1904gN8WJclqXMDo4S4-EuAAKwQ9IdSUzj0RFaQyPlZVu1GA5Hko1TjTSTVRhAA)

## [Preact](https://preactjs.com/)

You can import this snippet into your project with:

```javascript
import { h } from "seview/preact";
```

The snippet is as follows:

```javascript
import preact from "preact";
import { sv } from "seview";

export const h = sv(node => {
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

[seview + Preact - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIADLgAjABMuHE6WG4QGAg6FAxIEAAeuMyEagDcKgzVdmCeEdFySnIAFPUYiMRyOfAUImAAlM2a1XI+rbRq+mrEY+NyU+BYGDUkoSAAKhAuEG6dAK5ZqBvdHYi4iLv78EcQALpzDAuLYStr3d75DHsAEpsAWQAMic1AAyQoAcwqAGE1H5HvNxksZiQkQslgAjA7weAiXCY+AMAlEgC0mWcGDcAE9Zl45CIYVAKLAANYnVrDJSaHoIfoMMC4fKwLKsUScvzdNQASQYIp2Dnganu6JVzzk90GVRqcqgGDAYDkMKEB3sbjkxTESENmWyCFwxpcIkVXnmwidP1EAHUqFAASbxcNgOi6p5IFAyM05PAuBQwNqXuGyLhIPAAMrwToQVreK5YPaHY5yZJxPxa9FJ3C9fmGlrB9UvYWixUnStNhWiAn5JDtaBkQboowJvzzdti+AS+svGNxlMQdOZxA56M7fM3O4nGeC84QS6rgu3LJyADUckSZeHRnmWQKe0n6Kyh+ejSirS3KcXEG67+rA3L6qvBhANqPUDTkABBHALSKK0bSyXoHWCVxPU8Kc5BvQo3HvBt0PnI5ni4SZplkXA7EzfI9lmdFkTULhEjpMIIBfE85AABXghBoJYLAYGVJ4XmRY1TUQNw1ReTVL2qQDbQQjC70I2hIKwTVuisf9bCQqg9nYTEMExaABHDOA+gGdhElQOJjEeEBmQYVkaHoEAmFYdgZIQAQjn4dAeHgLAwFQHQdFNLBWUhUjggyDj4BiAAOXBUgATj0ON4Eiu14AIIhSHgal83YMARQoLB4GMUwnPMHShCEeB6n2PBmHyUiDQ8twvJAHy-ICnRmAwIpYCQYlMSqmr4Dq-riXdHQhuq2rsB0AAWNI0h0WADSm4bZvqxrVqykAcry9B6mpGBSrMFzDqYyIohatqOv8wLgtC8LmB0cIrviXAAFZlukepXsu6JMoEfaLHAQriqs0hnNBt6mnY9LjCAA)

## [Mithril](http://mithril.js.org/)

You can import this snippet into your project with:

```javascript
import { h } from "seview/mithril";
```

The snippet is as follows:

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

export const h = sv(node =>
  (typeof node === "string")
  ? { tag: "#", children: node }
  : node.attrs && node.attrs.innerHTML
    ? m(node.tag, m.trust(node.attrs.innerHTML))
    : m(node.tag, processAttrs(node.attrs), node.children || [])
);
```

[seview + Mithril - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIADLgAjABMuHE6zBTwXG5UOhQMSBAAHrjMhGoA3CoMNXZgnhHRckpyABQNGIjEchgIFCJgAJQtmjVyPm20avpqxOMTctPgWBi1JKEgACoQLhBuXQCubhComz2diLiIewfwxxAAuvMMi0thq+s93gUM+wASWwAsgAZM5qABkRQA5pUAMJqPzPBYTZazEgoxbLABGh3g8BEuGx8AYRJJAFosLlmBg3ABPOZeOQiOFQCiwADWZzaIyUml6-UGuAKsBOrFEPL8PTUAEkGKLdg54GpHpjVa85I8htVavLBp44UJDvY3C0AsbBQxJcAFjBPDcsPsjiczck4jqFmQLfABq8RWKldbMQ6nfcTgBqcM6iZGGoLE5h142jUTJpRM4yBhCIqjORptreEN3B5Spn+xWiPxDBZGHW1uN6hgNOQAQRwZuTqci6bzWZzfMmaNkuDs8AwBX2c0xyy4iUZYQgabk4bkQKyOSochKLCwMBVLzetENxsQbnVEy1NXruuYZSNEqsPTbWG1NVswSwVH27GxGGx0AESAYEtGgQESVA4mMZ4QDZBgORoegQCYVh2EybJcn4Uhjn4dAeHgLAwFQHQdGNLAOWhEdggydcMJiRIklwAA2aj0KoAgiFIeA6UddgwFFCgsHgYxTCQ8wfyEIR4AaA48EyUlYDADiQGw9g8IIoiMgwYpYCQUlsQkqT4BknT5Ko-TJOk7AdAAFjSNIdAUsAdHMwyZLKAoR0UgQuJ49AGjpGBhLMFC-MXbsBBU3D8XU4jSPIyjmB0cJu3iXAAFZ7OkBokrC6J2O87iLHAfjBKg0hkKK5LmjXVj+CMIA)

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
