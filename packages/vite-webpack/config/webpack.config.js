const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['postcss-preset-env'],
    },
  },
};

const commonCssLoader = [MiniCssExtractPlugin.loader, 'css-loader', postcssLoader];

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/main.tsx'),
  target: 'web',
  cache: {
    type: 'filesystem',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    assetModuleFilename: '[name].[contenthash:8][ext]',
    libraryTarget: 'umd',
    library: 'genesis-web-newvp',
    chunkLoadingGlobal: `webpackJsonp_genesis-web-newvp`,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    modules: ["node_modules", path.resolve(__dirname, '../src')],
  },

  optimization: {
    runtimeChunk: true,
    moduleIds: 'deterministic',
    minimizer: [
      '....',
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
      minSize: 3000,
      minChunks: 2,
      usedExports: true,
      cacheGroups: {
        designable: {
          name: 'designable',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/](@designable)[\\/]/,
          priority: 50,
          minChunks: 1,
        },
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|moment|antd|antd-mobile|@ant-design)[\\/]/,
          priority: 20,
          minChunks: 1,
        },
        formily: {
          name: 'formily',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/](@formily|core-js)[\\/]/,
          priority: 15,
          minChunks: 1,
        },
        antv: {
          name: 'antv',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/](@antv)[\\/]/,
          priority: 10,
          minChunks: 1,
        },
        common: {
          name: 'common',
          chunks: 'all',
          priority: 7,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(s[ac])ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]',
                exportLocalsConvention: 'camelCase',
                auto: /\.module\.(s[ac])ss$/i,
              },
            },
          },
          postcssLoader,
          {
            loader: "thread-loader",
            options: {
              workerParallelJobs: 2,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 默认是8kb
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      VITE_EDITOR_MODE: JSON.stringify(process.env.VITE_EDITOR_MODE),
      VITE_NODE_ENV: JSON.stringify('production'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: 'config/public.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CleanWebpackPlugin(),
    new WebpackBar(),
    // new BundleAnalyzerPlugin(),
  ],
};
