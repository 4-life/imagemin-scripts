import imagemin from 'imagemin';
import { deleteAsync } from 'del';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

import { performance } from 'node:perf_hooks';

const generateWebp = process.env.WEBP;

(async () => {
  const start = performance.now();
  await deleteAsync(['dist']);

  await imagemin(['images/*.{jpg,png}'], {
    destination: 'dist',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });

  if (generateWebp) {
    await imagemin(['dist/*.{jpg,png}'], {
      destination: 'dist/webp',
      plugins: [
        imageminWebp({ quality: 50 })
      ]
    });
  }

  const difference = (performance.now() - start)/1000;
  console.log('\x1b[42m%s\x1b[0m', `Completed!`);
  console.log('\x1b[36m%s\x1b[0m', `${difference.toFixed(2)}s`);
})();
