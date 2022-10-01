//@ts-check
const { resolve } = require("path");
const cwd = process.cwd();
const dirs = [cwd];
/** @type {import('webpack').Configuration} */
const config = {
  entry: {},
  mode: "production",
  devtool: 'source-map',
  devServer: {
    compress: true,
    port: 3001,
    static: [
      ...dirs.map((public) => ({
        directory: public,
        publicPath: "/",
        serveIndex: true,
        staticOptions: {
          maxAge: 0,
        },
        watch: true,
      })),
    ],
  },
};
module.exports = config;
