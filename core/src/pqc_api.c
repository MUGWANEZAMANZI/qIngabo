#include "pqc_api.h"
#include <stdlib.h>
#include <time.h>
#include <math.h>

// Multiply matrices yourself using C
void multiply_matrices(const int* A, int A_rows, int A_cols, const int* B, int B_cols, int* C) {
    for (int i = 0; i < A_rows; i++) {
        for (int j = 0; j < B_cols; j++) {
            C[i * B_cols + j] = 0;
            for (int k = 0; k < A_cols; k++) {
                C[i * B_cols + j] += A[i * A_cols + k] * B[k * B_cols + j];
            }
        }
    }
}

void generate_keypair(int* pub_key, int* sec_key) {
    static int seeded = 0;
    if (!seeded) {
        srand((unsigned int)time(NULL));
        seeded = 1;
    }

    int A[16];
    int S[4];
    int E[4];
    
    // Generate A
    for(int i=0; i<16; i++) A[i] = rand() % PQC_Q;
    // Generate S
    for(int i=0; i<4; i++) S[i] = rand() % PQC_Q;
    // Generate E (small error: -1, 0, or 1)
    for(int i=0; i<4; i++) E[i] = (rand() % 3) - 1;
    
    int AS[4];
    multiply_matrices(A, 4, 4, S, 1, AS);
    
    int P[4];
    for(int i=0; i<4; i++) {
        P[i] = (AS[i] + E[i]) % PQC_Q;
        if (P[i] < 0) P[i] += PQC_Q;
    }
    
    // Copy to output
    for(int i=0; i<16; i++) pub_key[i] = A[i];
    for(int i=0; i<4; i++) pub_key[16+i] = P[i];
    for(int i=0; i<4; i++) sec_key[i] = S[i];
}

void encrypt_bit(int bit, const int* pub_key, int* ct) {
    const int* A = pub_key;
    const int* P = pub_key + 16;
    
    int R[4];
    for(int i=0; i<4; i++) R[i] = rand() % PQC_Q;
    
    int AT[16];
    for(int i=0; i<4; i++) {
        for(int j=0; j<4; j++) {
            AT[i*4+j] = A[j*4+i];
        }
    }
    
    int U[4];
    multiply_matrices(AT, 4, 4, R, 1, U);
    for(int i=0; i<4; i++) {
        U[i] = U[i] % PQC_Q;
        if(U[i] < 0) U[i] += PQC_Q;
    }
    
    int V_part[1];
    multiply_matrices(P, 1, 4, R, 1, V_part); // P^T * R
    
    int V = (V_part[0] + bit * (PQC_Q / 2)) % PQC_Q;
    if (V < 0) V += PQC_Q;
    
    for(int i=0; i<4; i++) ct[i] = U[i];
    ct[4] = V;
}

int decrypt_bit(const int* ct, const int* sec_key) {
    const int* U = ct;
    int V = ct[4];
    
    int SU[1];
    multiply_matrices(sec_key, 1, 4, U, 1, SU); // S^T * U
    
    int result = (V - SU[0]) % PQC_Q;
    if (result < 0) result += PQC_Q;
    
    // Check if result is closer to 0 or Q/2
    int dist0 = result;
    if (dist0 > PQC_Q/2) dist0 = PQC_Q - dist0;
    
    int distQ2 = result - PQC_Q/2;
    if (distQ2 < 0) distQ2 = -distQ2;
    
    if (distQ2 < dist0) return 1;
    return 0;
}
