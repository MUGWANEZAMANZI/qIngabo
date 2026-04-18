#ifndef PQC_API_H
#define PQC_API_H

#ifdef _WIN32
#define PQC_EXPORT __declspec(dllexport)
#else
#define PQC_EXPORT
#endif

#define PQC_DIM 4
#define PQC_Q 256

// Generate keys
// pub_key: 4x4 matrix A + 4x1 vector P = 20 integers
// sec_key: 4x1 vector S = 4 integers
PQC_EXPORT void generate_keypair(int* pub_key, int* sec_key);

// Encrypt a single integer (0 or 1)
// ct: 4x1 vector U + 1 integer V = 5 integers
PQC_EXPORT void encrypt_bit(int bit, const int* pub_key, int* ct);

// Decrypt to a single integer (0 or 1)
PQC_EXPORT int decrypt_bit(const int* ct, const int* sec_key);

// Multiply matrices yourself
PQC_EXPORT void multiply_matrices(const int* A, int A_rows, int A_cols, const int* B, int B_cols, int* C);

#endif
