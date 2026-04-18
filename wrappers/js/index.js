const ffi = require('ffi-napi');
const path = require('path');
const os = require('os');

let libName = 'libpqc.so';
if (os.platform() === 'win32') libName = 'pqc.dll';
if (os.platform() === 'darwin') libName = 'libpqc.dylib';

// Try to find the library
let libPath = path.join(__dirname, '..', '..', 'core', 'build', libName);

const IntArray = require('ref-array-di')(require('ref-napi'))(require('ref-napi').types.int);

let pqcLib;
try {
    pqcLib = ffi.Library(libPath, {
        'generate_keypair': ['void', [IntArray, IntArray]],
        'encrypt_bit': ['void', ['int', IntArray, IntArray]],
        'decrypt_bit': ['int', [IntArray, IntArray]]
    });
} catch (e) {
    console.warn("Could not load library from " + libPath + ", falling back to current directory");
    try {
        pqcLib = ffi.Library(path.join(__dirname, libName), {
            'generate_keypair': ['void', [IntArray, IntArray]],
            'encrypt_bit': ['void', ['int', IntArray, IntArray]],
            'decrypt_bit': ['int', [IntArray, IntArray]]
        });
    } catch (e2) {
        console.error("Failed to load PQC library.");
    }
}

function generateKeypair() {
    if (!pqcLib) throw new Error("Library not loaded");
    let pub_key = new IntArray(20);
    let sec_key = new IntArray(4);
    pqcLib.generate_keypair(pub_key, sec_key);
    return { pub: pub_key.toArray(), sec: sec_key.toArray() };
}

function encryptBit(bit, pub) {
    if (!pqcLib) throw new Error("Library not loaded");
    let pub_key = new IntArray(pub);
    let ct = new IntArray(5);
    pqcLib.encrypt_bit(bit, pub_key, ct);
    return ct.toArray();
}

function decryptBit(ct, sec) {
    if (!pqcLib) throw new Error("Library not loaded");
    let ct_arr = new IntArray(ct);
    let sec_arr = new IntArray(sec);
    return pqcLib.decrypt_bit(ct_arr, sec_arr);
}

module.exports = { generateKeypair, encryptBit, decryptBit };
