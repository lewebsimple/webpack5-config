/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const mode = process.argv.includes("production") ? "production" : "development";

module.exports = {
  output: {
    clean: true,
    devtoolModuleFilenameTemplate: ({ identifier, resourcePath, hash }) => {
      if (!/^.\/src\/.*.vue$/.test(identifier)) {
        return `sources:///${resourcePath}`;
      }
      return `vue:///${resourcePath}?${hash}`;
    },
    devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]",
  },

  module: {
    rules: [
      // CSS / SCSS
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true, importLoaders: 3 } },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "resolve-url-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "./fonts/[name][ext]",
        },
      },

      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "./images/[name][ext]",
        },
      },

      // JavaScript
      {
        test: /\.js$/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
        },
      },

      // TypeScript
      {
        test: /\.ts$/,
        loader: "esbuild-loader",
        options: {
          loader: "ts",
          target: "es2015",
        },
      },

      // SVG
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: ["esbuild-loader", "vue-svg-loader"],
          },
          {
            type: "asset/resource",
            generator: {
              filename: "./images/[name][ext]",
            },
          },
        ],
      },

      // Vue
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: { sourceMap: true },
      },
    ],
  },

  resolve: {
    alias: { vue: "vue/dist/vue.min.js" },
    extensions: [".js", ".ts", ".vue"],
  },

  plugins: [
    // Browser Sync
    ...(process.env.PROXY_HOST
      ? [
          new BrowserSyncPlugin({
            host: "localhost",
            port: process.env.PROXY_PORT || 3000,
            proxy: process.env.PROXY_HOST,
            notify: false,
            files: ["./**/*.php"],
          }),
        ]
      : []),

    // Extract CSS
    new MiniCssExtractPlugin({ filename: "css/[name].css" }),

    // VueJS
    new VueLoaderPlugin(),
  ],

  devtool: mode === "development" ? "eval-source-map" : false,

  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },

  performance: { hints: false, maxAssetSize: 8388608 },

  stats: {
    all: false,
    assets: true,
    assetsSort: "name",
    errors: true,
    warnings: true,
  },
};
