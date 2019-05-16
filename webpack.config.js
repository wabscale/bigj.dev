// const webpack = require('webpack')
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

OUT_DIR = 'src/';

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

console.log('NODE_ENV: ' + process.env.NODE_ENV);

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    'index': './components/index.js',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, OUT_DIR, 'static/js'),
  },
  watchOptions: {
    ignored: ['node_modules'],
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', {
              targets: {
                edge: '17',
                firefox: '60',
                chrome: '67',
                safari: '11.1',
              },
              useBuiltIns: 'entry', // if this errs out, npm install -D core-js@2 will resolve this
              corejs: '2',
            }
            ],
          ],
          plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /.scss/,
        use: [
          // fallback to style-loader in development
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      APIHOST: JSON.stringify(process.env.APIHOST || 'http://api.localhost:8080/graphql'),
    }),
    function () {
      this.plugin('done', async stats => {
        await new Promise((resolve, reject) => {
          fs.readFile(path.resolve(__dirname, 'src/views/index.base.pug'), (err, data) => {
            if (err) return reject(err);

            return resolve(data
            .toString('utf8')
            .replace('__SCRIPT__', 'index.' + stats.hash + '.js'));
          });
        }).catch(err => {
          console.log(err);
        }).then(template => {
          fs.writeFile(path.resolve(__dirname, 'src/views/index.pug'), template, err => {
            if (err) throw err;
          });
        });
      });
    },
  ],
};
