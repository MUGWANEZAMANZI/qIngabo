# Quantum-Safe SDK (qIngabo)

`qIngabo` is a lightweight, high-performance, and cross-platform cryptographic SDK providing Post-Quantum Cryptography (PQC) based on Lattice-based algorithms. It implements a variant of the Learning With Errors (LWE) problem for secure key exchange and encryption.

## Features
- **Lattice-based Security**: Resistant to Shor's algorithm for quantum computing threats.
- **High-Performance C Core**: Optimized C implementation with cross-platform support (Windows, Linux, macOS).
- **Multi-language Support**: Native wrappers for:
  - 🐍 **Python** (via `ctypes`)
  - ☕ **Java** (via JNA)
  - 🟢 **Node.js** (via `ffi-napi`)
  - 🐘 **PHP** (via `FFI`)
- **Automated CI/CD**: Seamless deployment and testing across operating systems using GitHub Actions.

## Project Structure
- `core/`: C implementation and headers.
- `wrappers/`: Language-specific bindings and examples.
- `tests/`: Integration and unit tests.
- `.github/workflows/`: CI/CD pipelines.

## Getting Started

### Prerequisites
- CMake (3.10+)
- C Compiler (GCC, Clang, or MSVC)
- Language runtimes (Python 3.10+, Node 18+, JDK 11+, PHP 8.1+ with FFI)

### Building the Core Library
To build the shared library (`.so`, `.dll`, or `.dylib`):
```bash
cd core
mkdir build && cd build
cmake ..
cmake --build . --config Release
```

## Language-Specific Usage
... (existing content)

## Publishing
Detailed guides for publishing each wrapper can be found in the `/docs` directory:
- [Publishing to NPM (JS)](docs/publishing_npm.md)
- [Publishing to PyPI (Python)](docs/publishing_pip.md)
- [Publishing to Packagist (PHP)](docs/publishing_composer.md)

## Security Disclosure
... (rest of the content)
