import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import buble from "rollup-plugin-buble"
import { uglify } from "rollup-plugin-uglify"

export default [
  {
    input: "./src/index.js",
    output: {
      file: "dist/seview.js",
      name: "seview",
      format: "umd",
    },
    plugins: [
      resolve(),
      commonjs(),
      buble({
        exclude: ["node_modules/**"]
      })
    ]
  },
  {
    input: "./src/index.js",
    output: {
      file: "dist/seview.min.js",
      name: "seview",
      format: "umd",
    },
    plugins: [
      resolve(),
      commonjs(),
      buble({
        exclude: ["node_modules/**"]
      }),
      uglify()
    ]
  }/*,
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/seview.cjs.js",
        name: "seview",
        format: "cjs",
      },
      {
        file: "dist/seview.es.js",
        name: "seview",
        format: "es",
      }
    ],
    plugins: [
      buble({
        exclude: ["node_modules/**"]
      })
    ]
  }
  */
]
