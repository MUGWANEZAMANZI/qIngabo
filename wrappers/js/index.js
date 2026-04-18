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
    } catch (e) {
        // Continue searching
    }
}

if (!pqcLib) {
    console.error("Failed to load PQC library from any search path.");
}

// Define functions if library loaded
let generate_keypair, encrypt_bit, decrypt_bit;
if (pqcLib) {
    generate_keypair = pqcLib.func('void generate_keypair(int *out pub_key, int *out sec_key)');
    encrypt_bit = pqcLib.func('void encrypt_bit(int bit, const int *in pub_key, int *out ct)');
    decrypt_bit = pqcLib.func('int decrypt_bit(const int *in ct, const int *in sec_key)');
}

function generateKeypair() {
    if (!pqcLib) throw new Error("Library not loaded");
    let pub_key = new Array(20).fill(0);
    let sec_key = new Array(4).fill(0);
    generate_keypair(pub_key, sec_key);
    return { pub: pub_key, sec: sec_key };
}

function encryptBit(bit, pub) {
    if (!pqcLib) throw new Error("Library not loaded");
    let ct = new Array(5).fill(0);
    encrypt_bit(bit, pub, ct);
    return ct;
}

function decryptBit(ct, sec) {
    if (!pqcLib) throw new Error("Library not loaded");
    return decrypt_bit(ct, sec);
}

module.exports = { generateKeypair, encryptBit, decryptBit };
