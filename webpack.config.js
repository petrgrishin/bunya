const path = require('path');
const { BannerPlugin } = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    target: 'node',
    resolve: {
        modules: [ 'node_modules', '.' ]
    },
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc:false,
                        presets: [
                            [
                                'env',
                                {
                                    'targets': {
                                        'node': 'current'
                                    },
                                    'useBuiltIns': true,
                                    "exclude": [
                                        "transform-regenerator",
                                        "transform-async-to-generator"
                                    ]
                                }
                            ],
                        ],
                        plugins: [
                            "transform-object-rest-spread"
                        ],
                    },
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /bunya/,
        })],
    },
    plugins: [
        new BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    ],
    output: {
        filename: 'bunya',
        path: path.resolve(__dirname, 'bin'),
    },
};


