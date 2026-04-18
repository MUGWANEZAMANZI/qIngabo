const koffi = require('koffi');
const path = require('path');
const os = require('os');

let libName = 'libpqc.so';
if (os.platform() === 'win32') libName = 'pqc.dll';
if (os.platform() === 'darwin') libName = 'libpqc.dylib';

// Try to find the library in several places
const searchPaths = [
    path.join(__dirname, libName),
    path.join(__dirname, '..', '..', 'core', 'build', libName),
    path.join(__dirname, '..', '..', 'core', 'build', 'Release', libName),
    libName // System path
];

let pqcLib = null;
for (const p of searchPaths) {
    try {
        pqcLib = koffi.load(p);
        console.log(`Successfully loaded PQC library from ${p}`);
        break;
    } catch (e) {}
}

if (!pqcLib) {
    throw new Error("Failed to load PQC library from any search path.");
}

// Use standard C-style pointer notation which koffi handles well with TypedArrays
const generate_keypair = pqcLib.func('void generate_keypair(int *pub_key, int *sec_key)');
const encrypt_bit = pqcLib.func('void encrypt_bit(int bit, const int *pub_key, int *ct)');
const decrypt_bit = pqcLib.func('int decrypt_bit(const int *ct, const int *sec_key)');

function generateKeypair() {
    const pub = new Int32Array(20);
    const sec = new Int32Array(4);
    generate_keypair(pub, sec);
    return { pub: Array.from(pub), sec: Array.from(sec) };
}

function encryptBit(bit, pub) {
    const pub_arr = new Int32Array(pub);
    const ct = new Int32Array(5);
    encrypt_bit(bit, pub_arr, ct);
    return Array.from(ct);
}

function decryptBit(ct, sec) {
    const ct_arr = new Int32Array(ct);
    const sec_arr = new Int32Array(sec);
    return decrypt_bit(ct_arr, sec_arr);
}

module.exports = { generateKeypair, encryptBit, decryptBit };
