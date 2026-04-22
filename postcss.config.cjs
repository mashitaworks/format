const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');

console.log('NODE_ENV:', process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  plugins: [
    postcssUrl({
      url: asset => {
        if (isProduction && asset.url.startsWith('/assets/images/')) {
          return asset.url.replace('/assets/images/', '../images/');
        }
        return asset.url;
      },
    }),
    require('postcss-sort-media-queries')({
      sort: 'mobile-first',
    }),
    autoprefixer(),
  ],
};

module.exports = config;
