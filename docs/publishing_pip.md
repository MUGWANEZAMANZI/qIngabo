# Publishing to PyPI (Pip)

This guide explains how to publish the Python wrapper for the `qIngabo` SDK.

## 1. Prerequisites
- A [PyPI account](https://pypi.org/).
- The C library for the target platforms.

## 2. Package Configuration
Ensure `wrappers/python/pyproject.toml` or `setup.py` is correctly configured:
- `name`: Should be unique (e.g., `qingabo-pqc`).
- `version`: Use semantic versioning.
- `include`: Ensure the C library files are included in the package.

## 3. Bundling the Shared Library
For Python packages, the best approach is to include pre-built shared libraries (`.so`, `.dll`, `.dylib`) as "data files" within the package. Update `src/pqc_sdk/core_binder.py` to find them within the installed package directory.

## 4. Building the Wheel
```bash
cd wrappers/python
python -m pip install --upgrade build
python -m build
```
This generates a source distribution (`.tar.gz`) and a built distribution (`.whl`) in the `dist/` directory.

## 5. Publishing with Twine
```bash
python -m pip install --upgrade twine
python -m twine upload dist/*
```

## 6. Testing the Package
```bash
pip install qingabo-pqc
```
Verify the installation by running a simple test script.
