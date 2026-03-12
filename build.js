const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Build configuration
async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/app.js'],
      bundle: true,
      platform: 'node',
      target: 'node22',
      outfile: 'dist/app.js',
      format: 'cjs',
      sourcemap: true,
      minify: false,
      external: [
        // Mark all node_modules as external to avoid bundling them
        'pg-native',
        'applicationinsights-native-metrics',
        // Add other native modules if needed
      ],
      packages: 'external', // Don't bundle node_modules
      logLevel: 'info',
      loader: {
        '.node': 'file',
      },
      banner: {
        js: '#!/usr/bin/env node',
      },
    });

    // Copy static assets
    console.log('Copying static assets...');
    const assetDirs = [
      'src/pages',
      'src/styles',
      'src/scripts',
      'src/images',
      'src/defaultContent',
    ];

    assetDirs.forEach((dir) => {
      const src = path.join(__dirname, dir);
      const destDir = path.basename(dir);
      const dest = path.join(__dirname, 'dist', destDir);
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`Copied ${dir} to dist/${destDir}`);
      }
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
