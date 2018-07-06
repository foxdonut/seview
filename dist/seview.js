(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.seview = {})));
}(this, (function (exports) { 'use strict';

  var isString = function (x) { return typeof x === "string"; };
  var isNumber = function (x) { return typeof x === "number"; };
  var isBoolean = function (x) { return typeof x === "boolean"; };
  var isArray = function (x) { return Array.isArray(x); };
  var isObject = function (x) { return typeof x === "object" && !isArray(x) && x !== null && x !== undefined; };

  var getString = function (value) {
    var result = undefined;

    if (isString(value) && value.length > 0) {
      result = value;
    }
    else if (isNumber(value)) {
      result = String(value);
    }
    else if (isBoolean(value) && value) {
      result = String(value);
    }
    return result
  };

  var get = function (object, path) { return object == null
      ? undefined
      : path.length === 1
        ? object[path[0]]
        : get(object[path[0]], path.slice(1)); };

  var set = function (object, path, value) {
    if (path.length === 1) {
      if (isObject(object[path[0]])) {
        Object.assign(object[path[0]], value);
      }
      else {
        object[path[0]] = value;
      }
    }
    else {
      if (object[[path[0]]] == null) {
        object[[path[0]]] = {};
      }
      set(object[path[0]], path.slice(1), value);
    }
    return object
  };

  // Credit: JSnoX https://github.com/af/JSnoX/blob/master/jsnox.js

  // matches "input", "input:text"
  var tagTypeRegex = /^([a-z1-6]+)(?::([a-z]+))?/;

  // matches "#id", ".class", "[name=value]", "[required]"
  var propsRegex = /((?:#|\.|@)[\w-]+)|(\[.*?\])/g;

  // matches "[name=value]" or "[required]"
  var attrRegex = /\[([\w-]+)(?:=([^\]]+))?\]/;

  /*
  returns tag properties: for example, "input:password#duck.quack.yellow[name=pwd][required]"
  {
    tag: "input",
    className: "quack yellow",
    attrs: { type: "password", id: "duck", name: "pwd", required: true }
  }
  */
  var getTagProperties = function (selector) {
    var result = {};

    var tagType = selector.match(tagTypeRegex);

    // Use div by default
    if (!tagType) {
      tagType = ["div", "div"];
    }
    result.tag = tagType[1];

    if (tagType[2]) {
      result.attrs = { type: tagType[2] };
    }

    var tagProps = selector.match(propsRegex);

    if (tagProps) {
      var classes =[];

      tagProps.forEach(function (tagProp) {
        var ch = tagProp[0];
        var prop = tagProp.slice(1);

        if (ch === "#") {
          set(result, ["attrs", "id"], prop);
        }
        else if (ch === ".") {
          classes.push(prop);
        }
        else if (ch === "[") {
          var attrs = tagProp.match(attrRegex);
          set(result, ["attrs", attrs[1]], (attrs[2] || true));
        }
      });

      if (classes.length > 0) {
        set(result, ["attrs", "className"], classes.join(" "));
      }
    }

    return result
  };

  /*
  returns node definition, expanding on the above tag properties and adding to obtain:
  {
    tag: "input",
    className: "quack yellow",
    attrs: { type: "password", id: "duck", name: "pwd", required: true, onClick: ... },
    children: [ { tag: ... }, "text", ... ]
  }
  */
  var processChildren = function (rest) {
    var ch = [];
    rest.forEach(function (child) {
      // Text node
      if (getString(child)) {
        ch.push(getString(child));
      }
      else if (isArray(child)) {
        ch.push(nodeDef(child));
      }
    });
    return ch
  };

  var nodeDef = function (node) {
    // Tag
    var rest = node[2];
    var varArgsLimit = 3;

    // Process tag
    var result = getTagProperties(node[0]);

    // Process attrs
    if (isObject(node[1])) {
      var attrs = node[1];

      // Process className
      if (attrs["className"] !== undefined) {
        var classAttr = attrs["className"];
        delete attrs["className"];

        var addClasses = [];
        if (isString(classAttr)) {
          addClasses = classAttr.split(" ");
        }
        else if (isObject(classAttr)) {
          Object.keys(classAttr).forEach(function (key) {
            if (classAttr[key]) {
              addClasses.push(key);
            }
          });
        }
        if (addClasses.length > 0) {
          var existingClassName = get(result, ["attrs", "className"]);
          var addClassName = addClasses.join(" ");
          set(result, ["attrs", "className"],
            (existingClassName ? existingClassName + " " : "")
            + addClassName
          );
        }
      }

      // Add remaining attributes
      if (Object.keys(attrs).length > 0) {
        if (result.attrs === undefined) {
          result.attrs = attrs;
        }
        else {
          result.attrs = Object.assign(result.attrs, attrs);
        }
      }
    }
    // No attrs, use second argument as rest
    else {
      rest = node[1];
      varArgsLimit = 2;
    }

    // Process children: varargs
    if (node.length > varArgsLimit) {
      result.children = processChildren(node.slice(varArgsLimit - 1));
    }
    // Process children: one child arg
    else {
      // Text node
      if (getString(rest)) {
        result.children = [ getString(rest) ];
      }

      if (isArray(rest)) {
        // One child node vs Array of children
        result.children = processChildren( isString(rest[0]) ? [ rest ] : rest );
      }
    }
    return result
  };

  var transformNodeDef = function (transform, def) {
    if (isArray(def.children)) {
      var result = [];
      def.children.forEach(function (child) {
        result.push(isString(child) ? child : transformNodeDef(transform, child));
      });
      def.children = result;
    }
    return transform(def)
  };

  var sv = function (transform) { return function (node) {
    var def = nodeDef(node);
    return transformNodeDef(transform, def)
  }; };

  var mapKeys = function (mappings) { return function (object) {
    var result = {};

    Object.keys(mappings).forEach(function (key) {
      var from = key.split(".");
      var to = mappings[key].split(".");
      var value = get(object, from);
      if (value != null) {
        set(result, to, value);
      }
    });

    return result
  }; };

  exports.sv = sv;
  exports.mapKeys = mapKeys;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
