package com.pqc;

import com.sun.jna.Library;
import com.sun.jna.Native;

public class QuantumSafeSDK {
    public interface PqcLibrary extends Library {
        // We will try loading pqc.dll / libpqc.so
        PqcLibrary INSTANCE = Native.load("pqc", PqcLibrary.class);

        void generate_keypair(int[] pub_key, int[] sec_key);
        void encrypt_bit(int bit, int[] pub_key, int[] ct);
        int decrypt_bit(int[] ct, int[] sec_key);
    }

    public static class KeyPair {
        public int[] publicKey = new int[20];
        public int[] secretKey = new int[4];
    }

    public static KeyPair generateKeyPair() {
        KeyPair kp = new KeyPair();
        PqcLibrary.INSTANCE.generate_keypair(kp.publicKey, kp.secretKey);
        return kp;
    }

    public static int[] encryptBit(int bit, int[] publicKey) {
        int[] ct = new int[5];
        PqcLibrary.INSTANCE.encrypt_bit(bit, publicKey, ct);
        return ct;
    }

    public static int decryptBit(int[] ct, int[] secretKey) {
        return PqcLibrary.INSTANCE.decrypt_bit(ct, secretKey);
    }

    public static void main(String[] args) {
        // Use property passed from command line or environment
        KeyPair kp = generateKeyPair();
        int[] ciphertext = encryptBit(1, kp.publicKey);
        int decrypted = decryptBit(ciphertext, kp.secretKey);
        
        System.out.println("Decrypted bit: " + decrypted);
        if (decrypted == 1) {
            System.out.println("Java Wrapper test passed!");
        } else {
            System.err.println("Java Wrapper test failed!");
        }
    }
}
