module.exports = {
    entry: './src/srv_life.js',
    output : {
        path: './dist',
        filename: 'srv_life_bundle.js'
    },

    module: {
    loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: "babel",
            query: {
                presets:["es2015","react","react-native"],
            },
          },
          {
          test: /\.rt$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
                presets:["react-templates"],
            },
          },
         ]
    }
};
