const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {

  output: {
    clean: true,
  },

  module: {
    rules: [

      // CSS / SCSS
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: 'file-loader',
        options: { name: 'fonts/[name].[ext]' },
      },

      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: 'file-loader',
        options: { name: 'images/[name].[ext]' },
      },

      // Inline SVG
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: ['swc-loader', 'vue-svg-loader'],
          },
          {
            loader: 'file-loader',
            options: { name: 'images/[name].[ext]' },
          },
        ],
      },

      // JavaScript
      {
        test: /\.m?js$/,
        use: 'swc-loader',
        exclude: /node_modules/,
      },

      // TypeScript
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'swc-loader' },
          { loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/] } },
        ],
        exclude: /node_modules/,
      },

      // VueJS
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }, 

    ],
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.min.js',
    },
    extensions: ['.js', '.ts', '.vue'],
  },

  plugins: [

    // Browser Sync
    ...(process.env.PROXY_HOST ? [
      new BrowserSyncPlugin({
        host: 'localhost',
        port: process.env.PROXY_PORT || 3000,
        proxy: process.env.PROXY_HOST,
        notify: false,
        files: ['./**/*.php'],
      }),
    ] : []),

    // Extract CSS
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),

    // VueJS
    new VueLoaderPlugin(),

  ],

  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  },

  performance: { hints: false, maxAssetSize: 8388608 },

  stats: {
    all: false,
    assets: true,
    assetsSort: 'name',
    errors: true,
    warnings: true,
  },

};
