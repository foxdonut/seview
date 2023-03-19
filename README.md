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

```js
h('div', { id: 'home' }, [
  h('span', { className: 'instruction' }, 'Enter your name:'),
  h('input', { type: 'text', id: 'username', name: 'username', size: 10 }),
  isMessage && h('div', { className: 'message' + (isError ? ' error' : '') }, message)
])
```

You can write this with `seview`:

```js
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

## Installation

Using Node.js:

```
npm i seview
```

With a script tag:

```html
<script src="http://unpkg.com/seview"></script>
```

## Usage

Out of the box, `seview` supports 3 view libraries:

- [React](https://react.dev)
- [Preact](https://preactjs.com)
- [Mithril](https://mithril.js.org)

Using a different library is not difficult; TODO reference

When using `seview` with built-in support, we assume writing views with the following attributes:

- `class` for the HTML `class` attribute - converted to `className` for React
- `for` for the HTML `for` attribute - converted to `htmlFor` for React
- `innerHTML` for using unescaped HTML - converted appropriately for React, Preact, and Mithril
- `onClick`, `onChange`, etc. for DOM events - converted to lowercase for Mithril

> By writing views with the conventions above, you can switch between React, Preact, or Mithril
without changing any of your view code!

## React

To use `seview` with [React](https://react.dev):

```js
import { h } from 'seview/react';
import { createRoot } from 'react-dom/client';

const rootView = (...) =>
  ['div.container',
    [...]
  ];

const root = createRoot(document.getElementById('app'));
root.render(h(rootView(...)));
```

> [Click here for a live example: seview + React](https://flems.io/#0=N4IgtglgJlA2CmIBcA2FA6ALARgDQgGd4EBjAF3imRAEMAHO9AKwJHwDMIFWkBtUAHY0wiJLQboAFmTCw2IEgHsBFFdQA8UCADcABNAC8AHXF0TAPnUB6LdvMgAvrkHDRp5q3xKV8NWIhgdIoATmS6wLqSug667MGKYLoA5ETaEPAA7gACAEzoAAzo2FbB8DTkVhACUPAAHuhgLEkA3EYCbd4EYeVkEMoEugbhbbr6AiSlIipIugAUJMSwuLrCigCuKgCUg+Yjo7oLsLDoa3RQNBSzERSB8MEXa6Uzs7XbBua6tboA1Ctg6ypops2g5Wu1xv0wgAVeC3e5kR7wABq6QygzmhyWB0kXCgpQEb12AlGvCStiSuD2JKS6AotTIAFoCGsSAsCAQKckYXCHqUUZkkgBdSnE-akgh0GgCTlJbl0O68+AzTmY9BdC7wWmw+XwxHCqm6cWS6XLCJVAR3AASUIAsgAZGYmABkNQA5s0AMImaL60XU8ki-ZipIAIzWZDIynQIbIAmjsYZdGCARowQAnhSDUGIsoPbAICQANbPQkrch9AQEdBVCaw3xkeaLZbYbZOZIASXGk3rQsDQcNofDkbjMZHCZq7Boa1gZAasAZ2Ezfv7OYEeYLxbmpZ6FarNe7KkbR2WC9byySABF4LWpmQhQbfUGSDjYHjfHtBWCOrAaOzdAAlMpyH5NE6lUKABkAnp0A9BIggtQFgD2ToyGCFlI2CWYk0UOgCG2JDl2ZHUsPiXDNjBUYHD2fEakw-CDVKBFgmJWYs10TQdAOH92QAOVcYxwEZHILDY0YOL0EhuIIPiRAEulGWZVl4HZCwoOA1FrFsIl+32cTzAABV-IgoDGXRtBoWA1iVcIyBxKtsNw9BzMs+AHE0nRtJ0my7PQByq2fXF8So5cxJsDyDXIvZguCjpIRWBh0QI0YqggXoLJmJL9huHVFRmHJ8iivs0kyZ5MUJA1SXQbwyBoKo7iXHTSUkTAZVSVEfgAoCwjqYQ6AQXs2LlBUmORVEjyxUkA2SWCfEBSV2UoXRI10IbdT5VEhU2Psg14NSyBA00zIsqyZkwHJomWSadBlGbVDCebjKWxROp6EChUFB8QS-CFKzCTEBiGG14D6AgICrIgEToK54roIFvpQ3R4kUMIhj2i8AHkbSq0oNX-RRkdmKBFBINZb3QV14DIABRBBbwAITTdsoFmJJ6DoJJNki8ZFirMB6FmcbS0ypHZxou5ZkkWY2acsays5sEHC5+QlECLg7moEMaBDYhHGFEB8wEQseH4EAhBEagcfIdAam0YgcLJlh5EeOQxGkMhcKQKwrA2OhC1dKqEhKLqsmwAAOdA8nyb2wCgIPoJtu26AdzwQDINN5WoAgJggOgyEcZxTdcC2uoZImwGt+Bbdge36w8J3ghdkA3Y9r2fb9gOwDj8hS4SEPw8j6PY8txky4rqua5UOv8DTjOxCz5Nc-zlxzbnyvUSnkBneoZuCE972BF9-2VasNrMlyAoijCroT7XzIN5ntx55zvOnGXtwRBBsGmUp0568bne95tyPoHD+ihQYEG-pDLIGBsCX1AeAyBpx77p0ftnRer9C4rxACGfGZAuj3EYJAOMJB2R-23hGFuVg+a1BIFAEcuD8H0FocQwOODkaMLoFYTAF8o4kIIFYNheDUL0AaFUKqpDp4oMzmnBAut8Bm0frfNEe1HBAA)

## Preact

To use `seview` with [Preact](https://preactjs.com):

```js
import { h } from 'seview/preact';
import preact from 'preact';

const rootView = (...) =>
  ['div.container',
    [...]
  ];

const element = document.getElementById('app');
preact.render(h(rootView(...)), element);
```

> [Click here for a live example: seview + Preact](https://flems.io/#0=N4IgtglgJlA2CmIBcA2FA6ALARgDQgGd4EBjAF3imRAEMAHO9AKwJHwDMIFWkBtUAHY0wiJLQboAFmTCw2IEgHsBFFdQA8UCADcABNAC8AHXF0TAPnUB6LdvMgAvrkHDRp5q3xKV8NWKsAVLoAAiwAHrp0AE7wNORSugFWRgIQYHSKUWS6wLqSug667FGKYLoA5ETaEPAA7sEATOgADOjYVtGx5FYQAlDwYehgLOUA3Ckp3gTZcWQQygS6BjkpuvoCJDEiKki6ABQkxLC4usKKAK4qAJRL5qtruoewsOjndFA0FHu5FOnwUZ9zjFdnswjcDOZdBEANSnMAXFQFK4pBzjASTBbZAAq8D+ALIQPgADUarUlvsnsdHpIuFAYgJwXcBGteOVbOVcPcWeV0BQwmQALQEc4kQ4EAgcio4vGAmIkurlAC6nOZD1ZBDoNAEkvK0ro-1l8F2ksp6Gmn3gvNx+vxhOVXN06s12pOuV6An+AAksQBZAAyuxMADJ+gBzUYAYRMBXtqu57JVDzV5QARucyGRlOgU2QBNncwLomkaFEAJ4ch1J3LKCOwCAkADWIMZp3I8wEBHQvU2uN8ZAORxO2BuTgqAEkNls+0rE0nHan05m8znlwX+uwaOdYGQhrABdgK3G59WBLX6039i3Zu3O92pyoB88TvuRydygAReA97ZkJUO2NJiQNKwHSvj3IqaKTLANDiroAAKMSzPKZIDKoUCLJ0szoBGpQZB6iLAPcUxkFEIqZlEezRIodAEDchFHsKNqUSUNFXGiawOPc9L9BRdEOjEBJRMyeyVromg6I80HisY4CCg0FiiWs4l6CQUkEDJfKCsKorwOKFgIV0ZDIdYthMnODzKeYcEwUQUDrLo2g0LA5xGjkZA0p2VE0egjnOfADgmToZnmW5HnoF5nZAbS9KcUeSk2EFDpsfcsWxRiHYzAw5L0WsvQQHMTm7DlDy-Dahq7A0zQpbO1R1CClKMg6rLoN4ZA0L0-yHuZrKSJgOpVKSuiwgZsy6AMwh0AgM6iXqBqCcSpKPlSrIJhUOE+IimripQuiZros22nKpJKlcs5JrwI3kMhroOU5Lm7JgDQFCcK06Dq62qNkW22btijwYhV3HYqir-iikEbJijxHIsyw+vA8wEBAnZEASdDfKcWUOMl6IQxlY0ID+5JQIoJDnD+6ChvAZAAKIE32ABCpZjlAezlPQdDlNjlKdmA9B7EtLbFZh8Tcf8eySHs7M+YtDWnfjvbXGiWNovISjpFw-zUCmNApsQ8hEKQcwLNQ2BIM0jjKiAdYCA2PD8CAQgiNQws7mTUAePIQJyGI0hkDRSBWFYlx0A2oYtaUHQA2QwTYK02AAMxtAl0yR4ZrxgO7LDyGQpb6tQBCbBAdBkI4zgO64+fwLVtQe-gXvUL7-uB8Hofh2AVgDXUjQtEnWgp53NdZ-gOd52IBdREXJdOC4TtiCICNI0KVNvJ7UTeyAjcEAHQcCCHYdq1Y8+KIjBBL6jwQYNgSdHyfZ9vLXIAj244+T6XM9uCmiiKGQ0wAowkB5hIOKVe69N7b15mEEgUBlxfx-iRegUDAER0-t-X+9ArCYB7s0KwQCCBWBQXAv+QxegtWAcPXOz8c4IAtvgR2z8q6DUulPIAA)

## Mithril

To use `seview` with [Mithril](https://mithril.js.org):

```js
import { h } from 'seview/mithril';
import m from 'mithril';

const rootView = (...) =>
  ['div.container',
    [...]
  ];

m.mount(document.getElementById('app'), {
  view: () => h(rootView(...))
});
```

> [Click here for a live example: seview + Mithril](https://flems.io/#0=N4IgtglgJlA2CmIBcA2FA6ALARgDQgGd4EBjAF3imRAEMAHO9AKwJHwDMIFWkBtUAHY0wiJLQboAFmTCw2IEgHsBFFdQA8UCADcABNAC8AHXF0TAPnUB6LdvMgAvrkHDRp5q3xKV8NWIhgdIoATmS6wLqSug667MGKYLoA5ETaEPAA7gACAEzoAAzo2FaQZJLBXFYQAlDwAB7oYCxJANxGAu3eBGE05BDKBLoG4e26+gIkwfAiKki6ABQkxLC4usKKAK4qAJRD5qNjukuwsOgbdFA0FPMRFIHwwVcbU3PzdbsG5rp1ugDUa2BNipott2g42h0JgMwgAVaZ0B5PKYANXSGSGC2OKyOki4UCmAg++wEY14SVsSVwB1JSXQFDqZAAtAQNiQlgQCJTknD7o8yM94KjMkkALpUkmHMkEOg0ARcpI8hF8gVzLlY9DdK7wOnwxH8qZi6m6KUyuWrCLVAQPAASMIAsgAZOYmABktQA5i0AMImaKGiU0iniw6SpIAIw2ZDIynQYbIAlj8cZdAqYBowQAnpSjSGIsovbAICQANavIlrPoDdDVSbTXxkRbLVbYXZOZIASQmUxmZFFwZDxvDkejCbjo6TtXYNA2sDIjVgjOw2YDA7zAgLRdLC3LvTI-QEBGrXbrKkbJ1Wi9bqySABF4LWe6Kjf6QyRcbB8b4DiKIZ1obo7QgMoKlgIV0WGYADjSTJXgiK4yGCAhVjfPECRBPYjTAeZaTAJkcmXAddCw2l6SZFk2XgDl5UA4CuDApJtn7ENiKDZIAAUaA5Shxl0bQaFgDZ4FVVZ4MQ9A+IE+BGJzHFUK-FdQQEBx2j-A8egYDFIIlaogIgfi5i0kM7iVJEhN0HJ8gOJwoLRV4sSJI0yXQbwyBoaoHgIgcyUkTB5VSNE-gAoDyi4XR6mEOgED7GTFT1AUwLPbEyVYpIvWUVQwhlLioF0aNdFi5UUTRUVpJXUkaJC0C0XNXj+MEuZMByaJVmSnR5TSnxgSyogcryiqQPokURWfMFfyhNSjmWQZhjteB+gICBDyIfk6BuNYNIcbYxrARogQbKBFBIDYe3Qd14DIABRBAewAIQzdsoGw+g6AY80bJg7c9kieZnvEtFEoIeZtmBsEtpUiYpsaeh5iBr6dqmfEaAyIGwYEeQlECLgHmoMMaDDYhHDFEBCwEYseH4EAhBEahSkqjx5GeOQxGkMg6AIJArCsLY6GLd1nISEpgpA3J0DyHJBdo04WHkMgMwRagCEmCA6DIRxnEp1wFfgaCMnp-BGeoFm2Y5rmBB5vmMasfzMhFwpii0bore1tE9ZAWX5bERWKhVtWXGpsQRHmxbmXO84GeCJmQCN9nOe53n+bAEo5sUBaCBDlasgwbAiiToO0+W85XfdtwveV1WnD9tww0URQyG6R5GEgBMSA5cPI+jk20zqEgoFHGu64Q+ge+bgXq9r+v6CsTACgKKwW4IKwx4HhvGmqZzW-wYuFdlhBCfwKmS+dzIgslxwgA)

----------

`seview` exports a single function, `seview`, that you use to obtain a function which you can name
as you wish; in the examples, I name this function `h`. Calling `h(view)`, where `view` is the view
expressed as arrays as we have seen above, produces the final result suitable for your virtual DOM
library.

When you call `seview`, you pass it a function that gets called for every node in the view. Each
node has the following structure:

```js
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
virtual DOM library that you are using.

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

```js
['input', { type: 'password', name: 'password', placeholder: 'Enter your password here' }]
```

You can also mix selectors and attributes. If you specify something in both places, the attribute
overwrites the selector.

```js
['input:password[name=password]', { placeholder: 'Enter your password here' }]
```
```html
<input type="password" name="password" placeholder="Enter password name here">
```

```js
['input:password[name=username]', { type: 'text', placeholder: 'Enter your username here' }]
```
```html
<input type="text" name="username" placeholder="Enter your username here">
```

### Classes

Classes can be specified in the tag as a selector (as shown above), and/or in attributes using
`class`:

```js
['button.btn.info', { class: 'btn-default special' }]
```
```html
<button class="btn info btn-default special">
```

If you specify an object instead of a string for `class`, the keys are classes and the values
indicate whether or not to include the class. The class is only included if the value is truthy.

```js
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

```js
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

```js
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

```js
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

```js
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

```js
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
