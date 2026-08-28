/**
 * Talk With Dad - Production Builder & Packager
 * Generates the complete, standalone offline PWA distribution bundle in dist/
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

console.log('================================================================');
console.log('         TALK WITH DAD - PRODUCTION BUILD                       ');
console.log('================================================================');

// 1. Clean / create dist directories
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Compile production Tailwind CSS stylesheet
console.log('\nStep 1: Compiling production Tailwind CSS stylesheet...');
execSync('npx tailwindcss -i src/index.css -o dist/styles.css --minify', {
  cwd: rootDir,
  stdio: 'inherit',
});
fs.copyFileSync(path.join(distDir, 'styles.css'), path.join(rootDir, 'styles.css'));
console.log('✔ Compiled production dist/styles.css and copied to root styles.css.');

// 3. Execute Vite Production Bundler (Bundles all TS/TSX/React/Lucide/Dexie offline)
console.log('\nStep 2: Executing Vite production bundle (100% offline self-contained)...');
execSync('npx vite build', {
  cwd: rootDir,
  stdio: 'inherit',
});
console.log('✔ Vite production build complete.');

// 4. Ensure public static assets, models, and wasm are copied into dist/
console.log('\nStep 3: Verifying static assets and public directory sync...');
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, distDir);
}

// Ensure dist/styles.css exists (if vite build wiped it during outDir clean)
if (!fs.existsSync(path.join(distDir, 'styles.css')) && fs.existsSync(path.join(rootDir, 'styles.css'))) {
  fs.copyFileSync(path.join(rootDir, 'styles.css'), path.join(distDir, 'styles.css'));
}

// 5. Post-process dist/index.html to ensure styles.css is referenced and no CDN importmap exists
const distIndexHtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(distIndexHtmlPath)) {
  let distHtml = fs.readFileSync(distIndexHtmlPath, 'utf8');
  // Ensure styles.css is linked
  if (!distHtml.includes('styles.css')) {
    distHtml = distHtml.replace('</head>', '    <link rel="stylesheet" href="./styles.css" />\n  </head>');
  }
  // Ensure no esm.sh CDN importmap exists
  distHtml = distHtml.replace(/<script type="importmap">[\s\S]*?<\/script>/gi, '');
  fs.writeFileSync(distIndexHtmlPath, distHtml, 'utf8');
}

// 6. Write .nojekyll in dist/ and root to prevent GitHub Pages Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf8');

// 7. Verify dist bundle integrity
console.log('\nStep 4: Verifying production distribution bundle integrity...');
const requiredFiles = [
  'index.html',
  'styles.css',
  'manifest.json',
  'sw.js',
  'favicon.svg',
  'privacy.html',
  'terms.html',
];

let allFilesPresent = true;
for (const file of requiredFiles) {
  const fullPath = path.join(distDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing distribution file: ${file}`);
    allFilesPresent = false;
  } else {
    const stat = fs.statSync(fullPath);
    console.log(`  ✔ ${file} (${stat.size} bytes)`);
  }
}

// Verify assets/ directory exists and contains bundled JS and CSS
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  const assetFiles = fs.readdirSync(distAssetsDir);
  console.log(`  ✔ dist/assets/ contains ${assetFiles.length} bundled production chunks:`);
  for (const f of assetFiles) {
    const stat = fs.statSync(path.join(distAssetsDir, f));
    console.log(`    - ${f} (${stat.size} bytes)`);
  }
} else {
  console.error('❌ Missing dist/assets directory');
  allFilesPresent = false;
}

if (!allFilesPresent) {
  console.error('\n❌ Production build failed verification.');
  process.exit(1);
}

console.log('\n================================================================');
console.log('    ✅ PRODUCTION PWA BUILD COMPLETED SUCCESSFULLY (dist/)      ');
console.log('================================================================\n');
