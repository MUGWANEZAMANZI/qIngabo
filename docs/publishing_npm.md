# Publishing to NPM

This guide explains how to publish the Node.js wrapper for the `qIngabo` SDK.

## 1. Prerequisites
- An [NPM account](https://www.npmjs.com/).
- The C library must be built for the target platforms if you plan to bundle it.

## 2. Package Configuration
Ensure `wrappers/js/package.json` is correctly configured:
- `name`: Should be unique (e.g., `@your-username/qingabo`).
- `version`: Follow [Semantic Versioning](https://semver.org/).
- `files`: Ensure the C library and relevant JS files are included.

## 3. Bundling the Shared Library
Since the JS wrapper depends on the C library, you have two options:
1. **Pre-built Binaries**: Build the `.so`, `.dll`, and `.dylib` files and include them in the package under a `bin/` or `lib/` directory. Update `index.js` to look in these locations.
2. **Post-install Build**: Add a `postinstall` script to `package.json` that runs CMake to build the library on the user's machine.

## 4. Publishing Steps
```bash
cd wrappers/js
npm login
npm publish --access public
```

## 5. Testing the Package
After publishing, test it by installing it in a new project:
```bash
npm install @your-username/qingabo
```
