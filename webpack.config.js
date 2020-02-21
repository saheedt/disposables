const path = require('path'),
    miniCssExtractPlugin = require('mini-css-extract-plugin'),
    WebpackShellPlugin = require('webpack-shell-plugin'),
    nodeExternals = require('webpack-node-externals'),
    distDir = path.resolve(__dirname, 'dist'),
    srcDir = path.resolve(__dirname, 'src'),

    extractPlugin = new miniCssExtractPlugin({
        filename: 'styles.css',
        chunkFilename: 'styles-[hash].css',
        ignoreOrder: false
    }),

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
    devtool: "source-map",
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
            {
                enforce: "pre",
                test: /\.js?$/,
                loader: "source-map-loader",
                exclude: /node_modules/
            },
        ]
    }
};

// configuration entry for client side (React)
const clientConfig = {
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".tsx", ".json"]
    },
    entry: {
        client: `${srcDir}/client/index.tsx`,
    },
    output: {
        path: `${distDir}/client`,
        filename: '[name].js'
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
                        loader: 'ts-loader'
                    }
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
            },
            {
                enforce: "pre",
                test: /\.js?$/,
                loader: "source-map-loader",
                exclude: /node_modules/
            },
        ]
    },
    plugins: [extractPlugin, shellPlugin]
};

module.exports = [serverConfig, clientConfig];