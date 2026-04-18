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
let lastError = null;
for (const p of searchPaths) {
    try {
        pqcLib = koffi.load(p);
        console.log(`Successfully loaded PQC library from ${p}`);
        break;
    } catch (e) {
        lastError = e;
    }
}

if (!pqcLib) {
    console.error("Failed to load PQC library. Last error:", lastError ? lastError.message : "No error message");
    throw new Error("PQC library not found in search paths: " + JSON.stringify(searchPaths));
}

// Use most explicit signature for stability
const generate_keypair = pqcLib.func('generate_keypair', 'void', ['int *', 'int *']);
const encrypt_bit = pqcLib.func('encrypt_bit', 'void', ['int', 'int *', 'int *']);
const decrypt_bit = pqcLib.func('decrypt_bit', 'int', ['int *', 'int *']);

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
