import ResourceHintWebpackPlugin from 'resource-hints-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
// import StylishPlugin from 'eslint/lib/cli-engine/formatters/stylish';
import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import postcssNormalize from 'postcss-normalize';
import StyleLintPlugin from 'stylelint-webpack-plugin';

import pkg from '../package.json';
import { config } from 'dotenv';

import getEnvVariables from './env.js';

const dotenv = config({
    path: '.env',
});

const gitRevisionPlugin = new GitRevisionPlugin();

const appBase = process.cwd();
const eslintFile = path.resolve(appBase, '.eslintrc-loader.js');
const appSrc = path.resolve(appBase, 'src/');
const appDist = path.resolve(appBase, 'build/');
const appCache = path.resolve(appBase, 'build-dev-cache/');
const appIndexJs = path.resolve(appBase, 'src/index.tsx');
const appIndexHtml = path.resolve(appBase, 'public/index.html');
const appFavicon = path.resolve(appBase, 'public/favicon.ico');
const appFaviconImage = path.resolve(appBase, 'public/favicon.png');

const PUBLIC_PATH = '/';

module.exports = (env) => {
    const ENV_VARS = {
        ...dotenv.pared,
        ...getEnvVariables(env),
        REACT_APP_VERSION: JSON.stringify(gitRevisionPlugin.version()),
        REACT_APP_COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        REACT_APP_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
    };

    return {
        entry: appIndexJs,
        output: {
            path: appDist,
            publicPath: PUBLIC_PATH,
            sourceMapFilename: 'sourcemaps/[file].map',
            chunkFilename: 'js/[name].js',
            filename: 'js/[name].js',
            pathinfo: false,
        },

        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            symlinks: false,
        },

        mode: 'development',

        devtool: 'eval-cheap-module-source-map',

        node: {
            fs: 'empty',
        },

        performance: {
            hints: 'warning',
        },

        /*
        stats: {
            assets: true,
            colors: true,
            errors: true,
            errorDetails: true,
            hash: true,
        },
        */

        devServer: {
            host: '0.0.0.0',
            port: 3050,
            overlay: true,
            watchOptions: {
                ignored: /node_modules/,
            },
            // Don't show warnings in browser console
            clientLogLevel: 'none',

            hot: true,
            liveReload: false,
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    include: appSrc,
                    use: [
                        require.resolve('cache-loader'),
                        require.resolve('babel-loader'),
                        {
                            loader: require.resolve('eslint-loader'),
                            options: {
                                // cache: true,
                                configFile: eslintFile,
                                failOnError: true,
                                // NOTE: adding this because eslint 6 cannot find this
                                // https://github.com/webpack-contrib/eslint-loader/issues/271
                                // formatter: StylishPlugin,
                            },
                        },
                    ],
                },
                {
                    test: /\.(html)$/,
                    use: [
                        require.resolve('html-loader'),
                    ],
                },
                {
                    test: /\.(css|scss)$/,
                    include: appSrc,
                    use: [
                        require.resolve('style-loader'),
                        {
                            // NOTE: we may need to use postcss-modules instead of css-loader
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                modules: {
                                    localIdentName: '[name]_[local]_[hash:base64]',
                                },
                                esModule: true,
                                localsConvention: 'camelCaseOnly',
                                sourceMap: true,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    postcssPresetEnv(),
                                    postcssNested(),
                                    postcssNormalize(),
                                ],
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: require.resolve('file-loader'),
                            options: {
                                name: 'assets/[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            // NOTE: could try using react-hot-loader
            // https://github.com/gaearon/react-hot-loader
            new webpack.DefinePlugin({
                'process.env': ENV_VARS,
            }),
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: false,
                allowAsyncCycles: false,
                cwd: appBase,
            }),
            new StyleLintPlugin({
                files: ['**/*.css'],
                context: appSrc,
            }),
            new HtmlWebpackPlugin({
                template: appIndexHtml,
                filename: './index.html',
                title: 'MY_APP_NAME',
                favicon: path.resolve(appFavicon),
                chunksSortMode: 'none',
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: 'css/[id].css',
            }),
            new WebpackPwaManifest({
                short_name: 'MY_APP_NAME',
                // theme_color: 'MY_APP_COLOR',

                name: pkg.name,
                description: pkg.description,
                author: pkg.author,
                background_color: '#f0f0f0',
                orientation: 'portrait',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: path.resolve(appFaviconImage),
                        sizes: [96, 128, 192, 256, 384, 512],
                        destination: path.join('assets', 'icons'),
                    },
                ],
            }),
            new ResourceHintWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ],
    };
};
