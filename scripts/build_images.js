const imagemin = require('imagemin');

imagemin(['./src/img/*.{gif,png}'], './dist/img').then(files => {
  console.log(`successfully built: ${files.length} images.`);
  // => [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
