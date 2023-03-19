# seview: S-Expression View

A simple way of writing views with [s-expressions](https://en.wikipedia.org/wiki/S-expression),
and meant to be used with a virtual DOM library.

## Why?

Because plain JavaScript is simpler to write and build than JSX or HTML string literals, and it's
great to write views in a way that is independent of the virtual DOM library being used. It's also
nice to use convenient features even if the underlying virtual DOM library does not support them.

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
h('div', { id: 'home' }, [
  h('span', { className: 'instruction' }, 'Enter your name:'),
  h('input', { type: 'text', id: 'username', name: 'username', size: 10 }),
  isMessage && h('div', { className: 'message' + (isError ? ' error' : '') }, message)
])
```

You can write this with `seview`:

```javascript
['div#home',
  ['span.instruction', 'Enter your name:'],
  ['input:text#username[name=username][size=10]'],
  isMessage && ['div.message', { class: { 'error': isError } }, message]
]
```

Besides the conveniences of the syntax, you also don't have to write `h` at every element. To
switch from one virtual DOM library to another, you only need to make changes in **one** place.
All your view code can remain the same.

If you are using the [Meiosis pattern](http://meiosis.js.org), `seview` is a great way to further
decouple your code from specific libraries. Your views become independent of the underlying
virtual DOM library API.

## Features

`seview` supports CSS-style selectors in tag names, `{ class: boolean }` for toggling classes, using
an array or varags for children, flattening of nested arrays, and removal of null/empty elements.

### Element

An element is an array:

```
[tag, attrs, children]
```

or a string (text node):

```
'this is a text node'
```

The `tag` can be a string, or something that your virtual DOM library understands; for example,
a `Component` in React. For the latter, `seview` just returns the selector as-is.

### Tag

When the tag is a string, it is assumed to be a tag name, possibly with CSS-style selectors:

- `'div'`, `'span'`, `'h1'`, `'input'`, etc.
- `'div.highlighted'`, `'button.btn.btn-default'` for classes
- `'div#home'` for `id`
- `'input:text'` for `<input type="text">`. There can only be one type, so additional types are
ignored. `'input:password:text'` would result in `<input type="password">`.
- `'input[name=username][required]'` results in `<input name="username" required="true">`
- if you need spaces, just use them: `'input[placeholder=Enter your name here]'`
- default tag is `'div'`, so you can write `''`, `'.highlighted'`, `'#home'`, etc.
- these features can all be used together, for example
  `'input:password#duck.quack.yellow[name=pwd][required]'` results in
  `<input type="password" id="duck" class="quack yellow" name="pwd" required="true">`

### Attributes

If the second item is an object, it is considered to be the attributes for the element.

Of course, for everything that you can do with a CSS-style selector in a tag as shown in the
previous section, you can also use attributes:

```javascript
['input', { type: 'password', name: 'password', placeholder: 'Enter your password here' }]
```

You can also mix selectors and attributes. If you specify something in both places, the attribute
overwrites the selector.

```javascript
['input:password[name=password]', { placeholder: 'Enter your password here' }]
```
```html
<input type="password" name="password" placeholder="Enter password name here">
```

```javascript
['input:password[name=username]', { type: 'text', placeholder: 'Enter your username here' }]
```
```html
<input type="text" name="username" placeholder="Enter your username here">
```

### Classes

Classes can be specified in the tag as a selector (as shown above), and/or in attributes using
`class`:

```javascript
['button.btn.info', { class: 'btn-default special' }]
```
```html
<button class="btn info btn-default special">
```

If you specify an object instead of a string for `class`, the keys are classes and the values
indicate whether or not to include the class. The class is only included if the value is truthy.

```javascript
// isDefault is true
// isError is false
['button.btn', { class: { 'btn-default': isDefault, 'error': isError } }]
```
```html
<button class="btn btn-default">
```

### Children (array or varags)

The last item(s), (starting with the second if there are no attributes, and starting with the
third if attributes are present), are the children. The children can be:

- an array, or
- varargs.

#### Using an array

You can specify children as an array:

```javascript
['div', [
  ['span', ['Hello']],
  ['b', ['World']]
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
['div',
  ['span', 'Hello'],
  ['b', 'World']
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
['div', ['b', 'hello']]
```

vs

```js
['div', ['hello', 'there']]
```

For the second case, varargs **must** be used:

```js
['div', 'hello', 'there']
```

### Flattened arrays

Whether using an array of children or varargs, nested arrays are automatically flattened:

```javascript
['div', [
  ['div', 'one'],
  [
    ['div', 'two'],
    [
      ['div', 'three']
    ]
  ]
]]
```

or

```javascript
['div',
  ['div', 'one'],
  [
    ['div', 'two'],
    [
      ['div', 'three']
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
- `''`
- `[]`

This makes it simple to conditionally include an element by writing:

```javascript
condition && ['div', 'message']
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

`seview` exports a single function, `seview`, that you use to obtain a function which you can name
as you wish; in the examples, I name this function `h`. Calling `h(view)`, where `view` is the view
expressed as arrays as we have seen above, produces the final result suitable for your virtual DOM
library.

When you call `seview`, you pass it a function that gets called for every node in the view. Each
node has the following structure:

```javascript
{
  tag: 'button',
  attrs: { id: 'save', class: 'btn btn-default', ... }
  children: [ ... ]
}
```

The function that you write needs to convert the structure above to what is expected by the
virtual DOM library that you are using. Note that your function will also be called for each
element in `children`.

So you need to write a snippet of code that you pass to `seview` to wire up `seview` with the
virtual DOM library that you are using. Below, you will find examples for 3 libraries. Using a
different library is not difficult; you should get a pretty good idea of what to do from the
examples below.

In these examples, we assume writing views with the following attributes:

- `class` for the HTML `class` attribute, to be converted to `className` for React
- `for` for the HTML `for` attribute, to be converted to `htmlFor` for React
- `innerHTML` for using unescaped HTML
- `onClick`, `onChange`, etc. for DOM events, to be converted to lowercase for Mithril

Also, please note that the snippets below are just examples; feel free to change and adapt
according to your specific needs. For your convenience, these snippets are available in
`seview`. They are just a handful of code, though, so feel free to copy them into your
project and tweak the code to your preference.

## [React](https://reactjs.org/)

You can import this snippet into your project with:

```javascript
import { h } from 'seview/react';
```

The snippet is as follows:

```javascript
import React from 'react';
import { seview } from 'seview';

export const h = seview(node => {
  if (typeof node === 'string') {
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

[seview + React - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIAjLgADLhxOm4QGAg6FAxIEAAeuMyEagDcKgwVdmCeEdFySnIAFDUYiMRymfAUImAAlA2aFXI+TbRq+mrEwyNy4+BYGJUkoSAAKhAuEG5tAK7pqKsdrYi4iFs78PsQALrTDLNzYYvLHd45DNsAEmsAsgAyhzUADI8gBzUoAYTUfjuMxG80mJHhs3mACNdvB4CJcGj4AxcfiALRYNzODBuACeUy8chEkKgFFgAGtDk0BkpNJ0ED0GGBcDlYOlWKJ2X4OmoAJIMIWbBzwNQ3FFKh5yG59cqVGVQDBgMBySFCXb2NxyApiJD6gBKGQQuENLhE8q8M2q8DcuwQ7iapKEWH6LtVIzAuyw2x9QX9GpRbrkkCgZAacngXAoYE1j3jZFwJwgSe85zDl2uhwATIk-BnZlncF1efrGsAUSNBcL5Yca625aJcTkkC1oGQ+iijFWjDMuyL4GKm0Hk6n+ZB4ABleBtCBNAubIt7A7ztM5tenQvbXd5gDUcjifmjqvHqvSuXDA1nj3SVzcDzqUSaKYPuY6P9+TrXpbxGe97yqHU9TkABBHAzXyC1rVteB7WCVxPlEQMRkfPI3BnFF332B4uDGCZZFwOw1xybYpmbJ4QC4OIaTCCBvzkS8bS6RCWCwGBFXuR4EUNY1EDcFVHnVMcKnvbiEAAEQAeV+XA8PDMjaHgrB1Q6Kxb1sDCqG2dg0QwNFoGMO4QEZBhmRoegQCYVh2HSLpcDyGRoD9KcCCIUh9n4dAeHgf1UB0HRjSwZkwSo4I0lQyLmCQBL3M87ysF8mxSHgSkw3YMAhQoLB4GMUwnPMVzUKJJBgg89iMqy-yQEC9gQrCiKopiuLmFShAavi3Zkr6+ABuYeqvKgHz5T8gRcvy9BCrJEqyrMFz0DRIQhHgGodjwZgciovUBFa4KsQ6nRmAwfJYCQAlNu23bsFuglhF6h6dvdbAdAAFiSJIdFgPUdA+p79sOoHmvmixwFymBVoq9bwHYyIohOtwgqY86wHCyKGGi2K3p0cJUZiZIAFYAekGpiZR6JZpyvKYaW4rSqMaznOZumojkeS2aAA)

## [Preact](https://preactjs.com/)

You can import this snippet into your project with:

```javascript
import { h } from 'seview/preact';
```

The snippet is as follows:

```javascript
import preact from 'preact';
import { seview } from 'seview';

export const h = seview(node => {
  if (typeof node === 'string') {
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

[seview + Preact - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIAjLgADLhxOlhuEBgIOhQMSBAAHrjMhGoA3CoMlXZgnhHRckpyABS1GIjEclnwFCJgAJSNmpVyPs20avpqxCOjchPgWBhVJKEgACoQLhBu7QCuGahrnW2IuIjbu-AHEAC6Mwxz82FLK53euQw7ABLrALIAGSOagAZPkAOZlADCaj891mowWUxICLmCwARnt4PARLh0fAGHiCQBadLODBuACe0y8chEUKgFFgAGsjs1BkpNF0EL0GGBcLlYBlWKJ2X5OmoAJIMIVbBzwNS3VFKx5yW79CpVGVQDBgMByKFCPb2NxyQpiJD69KZBC4Q0uETyryzYQOr6iADqVCgfyNosGwFRNU8kCgZEacngXAoYE1T1DZFwkHgAGV4O0IM1vBcsDt9oc5AAmRJ+DWohO4bq8-VNQOqp6C4Xyo4Vxty0R43JIVrQMj9VFGON+WZtkXwMV1p5RmNJiCp9OILORra5q43I7T-mnCDnFd564ZOQAajkcVLQ6MswyeR2E9RGQPj3qUWam6TC4gnTfVb6ZdVl4YADqh1PU5AAQRwM0CgtK0Mm6O1glcd1PEnORr3yNw73rNC5wOR4uHGSZZFwOx01yHZplRRE1C4OIaTCCBn2POQAAU4IQKCWCwGBFQeJ5EUNY1EDcFUnnVC9KgA614PQ28CNoCCsHVTorD-WxEKoHZ2HRDB0WgYx7hARkGGZGh6BAJhWHYaSEAEA5+HQHh4CwMBUB0HRjSwZlwRI4I0nY+AYgADlwQtcAATj0GN4H8m14AIIhSHgSlc3YMAhQoLB4GMUwLPMbShCEeBal2PBmFyEi9TstwHJAJyXLcnRmAwApYCQQl0UK4r4FKtrCVdHROqKkrsB0AAWJIkh0WA9UGrqRrKiqZsSkBktS9BakpGAcrMKyNsYyIomq2r6tc9zPO83zmB0cJDpiZIAFYpukWoboO6IEoENaLHADKsoM0hLJ+26GjYuLjCAA)

## [Mithril](http://mithril.js.org/)

You can import this snippet into your project with:

```javascript
import { h } from 'seview/mithril';
```

The snippet is as follows:

```javascript
import m from 'mithril';
import { seview } from 'seview';

const processAttrs = (attrs = {}) => {
  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on')) {
      const value = attrs[key];
      delete attrs[key];
      attrs[key.toLowerCase()] = value;
    }
  })
  return attrs;
};

export const h = seview(node =>
  (typeof node === 'string')
  ? { tag: '#', children: node }
  : node.attrs && node.attrs.innerHTML
    ? m(node.tag, m.trust(node.attrs.innerHTML))
    : m(node.tag, processAttrs(node.attrs), node.children || [])
);
```

[seview + Mithril - live example](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcICGAHLA6AVmCADQgBmAljEagNqgB2GAthGpjrgBbzNQkhYAewaJR7ADxIKANwAEFJAF4AOhyxqAfBID00mZpABfYoxZt02PIQHDREcegrMsQgE7w5wOVzlG5ZG5CzHJqkDIUEADuAAIAjLgADLhxOswU8FxuVDoUDEgQAB64zIRqANwqDFV2YJ4R0XJKcgAUdRiIxHIYCBQiYACUTZpVcj4ttGr6asSjY3KT4FgY1SShIAAqEC4Qbh0Arm4QqOtd7Yi4iDt78IcQALqzDPMLYcurXd55DLsAEhsAWQAMic1AAyAoAc3KAGE1H5HnMxotpiQkfNFgAjfbweAiXCY+AMAlEgC0WGyzAwbgAnjMvHIRDCoBRYABrE4tIZKTTdXr9XB5WBHViiLl+LpqACSDGF2wc8DU93RyuecnuA0q1Vl-U8MKE+3sbiaAUN-IY4uAcxgniuWF2ByOJoATIktXMyGb4H1nkKRQrLei7Q7bkcANRhrVjIxVOZHUPPK1qsYNKInGQMIQFYZyVMtbzBm53CUMv3y0R+AZzIxamuxnUMOpyACCOBNSZTkTTucz2Z54xRslwdngGDyuxm6MWXDi9LCEFTcjDcgBGSyVDkRRYWBgSqeL1o+sNiDcqrGGqqde1zBKBrFVi6rawmqqtmCWCou3YmIwmOgxkeEAWQYNkaHoEAmFYdh0kybJ+FIQ5+HQHh4CwMBUB0HRDSwNlIWHYI0jXOD4hSXAADZCNgqgCCIUh4Bpe12DAYUKCweBjFMCDzG-IQhHgOo9jwdJiVgMBaJARD2BQtCMLSDBClgJBiUxXj+PgQTFJEgiVL4gTsB0AAWJIkh0USwB0HS1MEko8mHMSBHoxj0DqGkYA4swoOchcuwESTkNxGTMOw3D8OYHRwi7GJkgAVhM6Q6nC7zohohyGIscAWLYgDSEg9KIsaVcqP4IwgA)

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
