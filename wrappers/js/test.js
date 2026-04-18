const pqc = require('./index');

try {
    console.log('--- Starting PQC SDK Test ---');
    
    console.log('Testing generateKeypair()...');
    const kp = pqc.generateKeypair();
    console.log('Public Key (first 5):', kp.pub.slice(0, 5));
    console.log('Secret Key:', kp.sec);

    const testBit = 1;
    console.log(`Testing encryptBit(${testBit})...`);
    const ct = pqc.encryptBit(testBit, kp.pub);
    console.log('Ciphertext:', ct);

    console.log('Testing decryptBit()...');
    const decrypted = pqc.decryptBit(ct, kp.sec);
    console.log('Decrypted result:', decrypted);

    if (decrypted !== testBit) {
        console.error(`FAILED: Expected ${testBit}, got ${decrypted}`);
        process.exit(1);
    }

    console.log('--- Test Passed Successfully ---');
} catch (err) {
    console.error('--- Test Failed with Error ---');
    console.error(err);
    process.exit(1);
}
