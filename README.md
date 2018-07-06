# seview: S-Expression View

A simple way of expressing views, meant to be used with a virtual DOM library.

## Why?

Because plain JavaScript is simpler to write and build than JSX, and it's great to
write views in a way that is independent of the virtual DOM library being used.

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

You would write this with `seview`:

```javascript
["div#home",
  ["span.instruction", "Enter your name:"],
  ["input:text#username[name=username][size=10]"],
  isMessage && ["div.message", { className: { "error": isError } }, message]
])
```

Besides the conveniences of the syntax, you also have no `h` anywhere. To switching from one virtual
DOM library to another, you only need to make changes in **one** place. All your views can remain
the same.

## More Content to come

_This README is a work-in-progress, more content is forthcoming._

## Varargs and text nodes

The problem with supporting varargs is, how do you differentiate a single element from two text nodes?

For example:

```js
["div", ["b", "hello"]]
```

vs

```js
["div", ["hello", "there"]]
```

For the second case, varargs MUST be used:

```js
["div", "hello", "there"]
```

## Credits

`seview` is inspired by the following. Credit goes to the authors and their communities.

- [How to UI in 2018](https://medium.com/@thi.ng/how-to-ui-in-2018-ac2ae02acdf3)
- [ijk](https://github.com/lukejacksonn/ijk)
- [JSnoX](https://github.com/af/JSnoX)
- [Mithril](http://mithril.js.org)
- [domvm](https://domvm.github.io/domvm/)

----

_seview is developed by [foxdonut](https://github.com/foxdonut)
([@foxdonut00](http://twitter.com/foxdonut00)) and is released under the MIT license._