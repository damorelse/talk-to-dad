/**
 * TalkWithDad AAC Progressive Web App - Production Builder & Packager
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
const distSrcDir = path.resolve(distDir, 'src');

console.log('================================================================');
console.log('    TALKWITHDAD AAC PROGRESSIVE WEB APP - PRODUCTION BUILD      ');
console.log('================================================================');

// 1. Clean / create dist directories
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(distSrcDir, { recursive: true });

// 2. Transpile TypeScript source files to dist-test/src
console.log('\nStep 1: Transpiling TypeScript source files...');
execSync('node scripts/transpile.js', {
  cwd: rootDir,
  stdio: 'inherit',
});

// 3. Copy compiled JavaScript modules from dist-test/src to dist/src
console.log('\nStep 2: Copying compiled application modules...');
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const isText = ['.js', '.mjs', '.ts', '.tsx', '.json', '.html', '.css', '.svg', '.txt', '.md'].includes(ext);
      if (isText) {
        let content = fs.readFileSync(srcPath, 'utf8');
        // In dist/src/main.js, remove raw css imports if present
        if (entry.name === 'main.js') {
          content = content.replace(/import\s+['"][^'"]+\.css['"];?/g, '');
        }
        fs.writeFileSync(destPath, content, 'utf8');
      } else {
        // Binary files (.wasm, .onnx, .png, .jpg, .wav, etc.) must be copied byte-for-byte
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const sourceSrc = path.join(rootDir, 'dist-test/src');
copyRecursive(sourceSrc, distSrcDir);
console.log('✔ Copied application modules to dist/src.');

// 3. Copy public static assets
console.log('\nStep 2: Copying public static assets...');
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, distDir);
  console.log('  ✔ Copied all public static assets (including models).');
}

// 4. Compile production Tailwind CSS stylesheet
console.log('\nStep 3: Compiling production Tailwind CSS stylesheet...');
execSync('npx tailwindcss -i src/index.css -o dist/styles.css --minify', {
  cwd: rootDir,
  stdio: 'inherit',
});
fs.copyFileSync(path.join(distDir, 'styles.css'), path.join(rootDir, 'styles.css'));
console.log('✔ Compiled production dist/styles.css and copied to root styles.css.');

// 5. Generate production index.html for dist/ and root
console.log('\nStep 4: Generating production index.html with Import Map...');
function createIndexHtml(mainScriptSrc) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>TalkWithDad - AAC Progressive Web App</title>
    
    <!-- PWA & Apple Web App Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="TalkWithDad" />
    <meta name="application-name" content="TalkWithDad" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="description" content="iPad-optimized offline AAC application for stroke recovery, aphasia rehabilitation, and family caregiving." />
    
    <link rel="manifest" href="./manifest.json" />
    <link rel="apple-touch-icon" href="./icon-192.png" />
    <link rel="apple-touch-startup-image" href="./splash.png" />
    
    <!-- Compiled Production Tailwind CSS -->
    <link rel="stylesheet" href="./styles.css" />
    
    <!-- Import Map for Browser ES Modules -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.3.1",
        "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
        "react-dom": "https://esm.sh/react-dom@18.3.1",
        "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
        "lucide-react": "https://esm.sh/lucide-react@0.475.0?external=react",
        "dexie": "https://esm.sh/dexie@4.0.11",
        "clsx": "https://esm.sh/clsx@2.1.1",
        "tailwind-merge": "https://esm.sh/tailwind-merge@2.5.4",
        "onnxruntime-web": "./vendor/onnxruntime-web.js"
      }
    }
    </script>
    
    <!-- Prevent standard double-tap zoom, viewport shift & bounce scrolling on iOS Safari -->
    <style>
      html, body {
        height: 100%;
        height: 100dvh;
        height: -webkit-fill-available;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        overscroll-behavior: none;
        overscroll-behavior-y: none;
        -webkit-overflow-scrolling: auto;
        position: fixed;
        inset: 0;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        touch-action: manipulation;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      html.light, html.light body {
        background-color: #f8fafc;
        color: #0f172a;
      }
      html.dark, html.dark body {
        background-color: #0f172a;
        color: #f8fafc;
      }
      #root {
        height: 100%;
        height: 100dvh;
        height: -webkit-fill-available;
        width: 100%;
        overflow: hidden;
        overscroll-behavior: none;
      }
      /* Shake animation for PIN errors */
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
      /* Custom scrollbar hiding */
      .scrollbar-none::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-none {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    </style>
  </head>
  <body class="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 antialiased select-none transition-colors">
    <div id="root"></div>
    <script type="module" src="${mainScriptSrc}"></script>
  </body>
</html>`;
}

// Write dist/index.html (for standalone production distribution)
fs.writeFileSync(path.join(distDir, 'index.html'), createIndexHtml('./src/main.js'), 'utf8');

// Write root index.html (for local Vite development server with live HMR)
fs.writeFileSync(path.join(rootDir, 'index.html'), createIndexHtml('/src/main.tsx'), 'utf8');

// Write .nojekyll in dist/ and root to prevent GitHub Pages Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf8');

// Copy public assets to root directory
if (fs.existsSync(publicDir)) {
  const publicEntries = fs.readdirSync(publicDir, { withFileTypes: true });
  for (const entry of publicEntries) {
    if (entry.isFile()) {
      fs.copyFileSync(path.join(publicDir, entry.name), path.join(rootDir, entry.name));
    }
  }
}
console.log('✔ Generated dist/index.html (standalone production) and root index.html (Vite dev server).');

// 6. Verify dist bundle integrity
console.log('\nStep 5: Verifying production distribution bundle integrity...');
const requiredFiles = [
  'index.html',
  'styles.css',
  'manifest.json',
  'sw.js',
  'favicon.svg',
  'src/main.js',
  'src/App.js',
  'src/components/layout/MainContainer.js',
  'src/components/layout/NavigationBar.js',
  'src/components/layout/EmergencyBar.js',
  'src/components/grid/CardGrid.js',
  'src/services/audio/AudioService.js',
  'src/services/audio/iOSAudioUnlock.js',
  'src/services/db/AppDatabase.js',
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

if (!allFilesPresent) {
  console.error('\n❌ Production build failed verification.');
  process.exit(1);
}

console.log('\n================================================================');
console.log('    ✅ PRODUCTION PWA BUILD COMPLETED SUCCESSFULLY (dist/)      ');
console.log('================================================================\n');
