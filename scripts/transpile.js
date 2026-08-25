/**
 * TalkWithDad Precision TypeScript to JavaScript Transpiler for Runtime Testing
 * Uses official TypeScript compiler API to correctly transpile TS/TSX to JS.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function cleanTypeScript(code, filePath = 'file.tsx') {
  const result = ts.transpileModule(code, {
    fileName: filePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
  });

  let js = result.outputText;
  // Normalize relative import paths to include .js extension for Node ESM resolution
  js = js.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, impPath) => {
    if (impPath.endsWith('.js')) return match;
    if (impPath.endsWith('.ts') || impPath.endsWith('.tsx')) {
      return `from '${impPath.replace(/\.tsx?$/, '.js')}'`;
    }
    if (impPath.endsWith('/index')) {
      return `from '${impPath}.js'`;
    }
    if (
      impPath.endsWith('/types') ||
      impPath.endsWith('/db') ||
      impPath.endsWith('/audio') ||
      impPath.endsWith('/syllables') ||
      impPath.endsWith('/keyboard') ||
      impPath.endsWith('/googleSheets')
    ) {
      return `from '${impPath}/index.js'`;
    }
    return `from '${impPath}.js'`;
  });

  // Also normalize dynamic imports
  js = js.replace(/import\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g, (match, impPath) => {
    let rewritten = impPath;
    if (rewritten.endsWith('.ts') || rewritten.endsWith('.tsx')) {
      rewritten = rewritten.replace(/\.tsx?$/, '.js');
    } else if (!rewritten.endsWith('.js')) {
      if (
        rewritten.endsWith('/types') ||
        rewritten.endsWith('/db') ||
        rewritten.endsWith('/audio') ||
        rewritten.endsWith('/syllables') ||
        rewritten.endsWith('/keyboard')
      ) {
        rewritten = `${rewritten}/index.js`;
      } else {
        rewritten = `${rewritten}.js`;
      }
    }
    return `import('${rewritten}')`;
  });

  return js;
}

export function processSourceDirectory(currentDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;

    const srcPath = path.join(currentDir, entry.name);
    const targetPath = path.join(targetDir, entry.name.replace(/\.tsx?$/, '.js'));

    if (entry.isDirectory()) {
      processSourceDirectory(srcPath, path.join(targetDir, entry.name));
    } else if (entry.name.endsWith('.d.ts')) {
      // Declaration files don't emit JS
      continue;
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(srcPath, 'utf8');
      const transpiled = cleanTypeScript(content, entry.name);
      fs.writeFileSync(targetPath, transpiled, 'utf8');
    } else {
      fs.copyFileSync(srcPath, targetPath);
    }
  }
}

export function processTestsDirectory(currentDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(currentDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      processTestsDirectory(srcPath, targetPath);
    } else if (entry.name.endsWith('.d.ts')) {
      continue;
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(srcPath, 'utf8');
      const transpiled = cleanTypeScript(content, entry.name);
      const targetJsPath = path.join(targetDir, entry.name.replace(/\.tsx?$/, '.js'));
      fs.writeFileSync(targetJsPath, transpiled, 'utf8');
    } else if (entry.name.endsWith('.js')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/from\s+['"]([^'"]+)\.tsx?['"]/g, "from '$1.js'");
      content = content.replace(/import\s*\(\s*['"]([^'"]+)\.tsx?['"]\s*\)/g, "import('$1.js')");
      fs.writeFileSync(targetPath, content, 'utf8');
    } else {
      fs.copyFileSync(srcPath, targetPath);
    }
  }
}

export function checkSyntax(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkSyntax(fullPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
      } catch (err) {
        console.error(`Syntax error in transpiled file: ${fullPath}`);
        console.error(err.stderr ? err.stderr.toString() : err.message);
        throw err;
      }
    }
  }
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('transpile.js')) {
  console.log('Transpiling sources to dist-test using TypeScript compiler...');
  processSourceDirectory(path.join(rootDir, 'src'), path.join(rootDir, 'dist-test/src'));
  processTestsDirectory(path.join(rootDir, 'tests'), path.join(rootDir, 'dist-test/tests'));
  checkSyntax(path.join(rootDir, 'dist-test'));
  console.log('Transpilation and syntax check completed successfully.');
}
