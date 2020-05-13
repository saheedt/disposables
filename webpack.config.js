const path = require('path'),
    webpack = require('webpack'),
    miniCssExtractPlugin = require('mini-css-extract-plugin'),
    { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
    compressionPlugin = require('compression-webpack-plugin'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    terserJSPlugin = require('terser-webpack-plugin'),
    nodeExternals = require('webpack-node-externals'),
    distDir = path.resolve(__dirname, 'dist'),
    srcDir = path.resolve(__dirname, 'src'),
    extractPlugin = new miniCssExtractPlugin({
        filename: 'styles.[contenthash].css', //'styles.css',
        chunkFilename: 'styles-[hash].css',
        ignoreOrder: false
    }),
    environmentVariables = new webpack.DefinePlugin({
        'process.env.PORT': JSON.stringify(`${process.env.PORT}`),
    }),
    analyzeBundle = new BundleAnalyzerPlugin({
        analyzerMode: "static",
    }),
    gzip = new compressionPlugin(),
    htmlGenerator = new htmlWebpackPlugin({ template: 'src/index.html' }),
    cssMiniMizer = new optimizeCSSAssetsPlugin({}),
    jsMinimizer = new terserJSPlugin({});

    // WebpackShellPlugin = require('webpack-shell-plugin'),

    /**
     * This plugin helps run npm command on build completion.
     * The plugin was placed in the client config section as
     * the client build runs last, ensuring all files
     * needed by the script will be in place.
     */
    // shellPlugin = new WebpackShellPlugin({
    //     onBuildEnd: ['npm start']
    // });

/**
 *  The build config had to be splitted into two as one targets web (client),
 *  and the other node (server) to avoid various bundling errors.
 */

// Configuaration file for server side (Express and Socket.io)
const serverConfig = {
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".json"]
    },
    entry: {
        server: `${srcDir}/server.ts`
    },
    output: {
        path: `${distDir}/server`,
        filename: '[name].js'
    },
    target: 'node',
    // This helps to solve an issue where __dirname returns '/'
    // node installation path. This helps to set it to source path
    node: {
        __dirname: true
    },
    // this helps to avoid bundling node(server) dependencies like express
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: srcDir,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            // {
            //     enforce: "pre",
            //     test: /\.js?$/,
            //     loader: "source-map-loader",
            //     exclude: /node_modules/
            // },
        ]
    }
};

// configuration entry for client side (React)
const clientConfig = {
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".tsx", ".json"]
    },
    entry: {
        client: `${srcDir}/client/index.tsx`,
    },
    output: {
        path: `${distDir}/client`,
        filename: '[name].[contenthash].js'
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: srcDir,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        }
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            }
        ]
    },
    optimization: {
        minimizer: [jsMinimizer, cssMiniMizer]
    },
    plugins: [extractPlugin, environmentVariables, analyzeBundle, gzip, htmlGenerator] // shellPlugin
};

const testConfig = {
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".json"]
    },
    entry: {
        server: `${srcDir}/tests/server/server.spec.ts`
    },
    output: {
        path: `${distDir}/tests`,
        filename: '[name].spec.js'
    },
    target: 'node',
    // This helps to solve an issue where __dirname returns '/'
    // node installation path. This helps to set it to source path
    node: {
        __dirname: true
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: srcDir,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]

            }
        ]
    }
};


module.exports = [serverConfig, clientConfig, testConfig];