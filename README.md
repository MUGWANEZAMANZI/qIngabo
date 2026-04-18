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

### Python
```python
from pqc_sdk import generate_keypair, encrypt_bit, decrypt_bit
pub, sec = generate_keypair()
ct = encrypt_bit(1, pub)
decrypted = decrypt_bit(ct, sec)
```

### Node.js
```javascript
const pqc = require('./wrappers/js');
const {pub, sec} = pqc.generateKeypair();
const ct = pqc.encryptBit(1, pub);
const res = pqc.decryptBit(ct, sec);
```

### Java
```java
KeyPair kp = QuantumSafeSDK.generateKeyPair();
int[] ct = QuantumSafeSDK.encryptBit(1, kp.publicKey);
int decrypted = QuantumSafeSDK.decryptBit(ct, kp.secretKey);
```

### PHP
```php
$client = new Pqc\PqcClient();
$kp = $client->generateKeyPair();
$ct = $client->encryptBit(1, $kp['pub']);
$res = $client->decryptBit($ct, $kp['sec']);
```

## Security Disclosure
This project is currently for educational and experimental purposes. Lattice parameters (`PQC_DIM=4`, `PQC_Q=256`) are illustrative and should be increased for production environments.

## License
Distributed under the MIT License. See `LICENSE` for more information.
