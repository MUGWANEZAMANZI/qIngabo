// This file implement lattice based encryption in two dimension
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include <math.h>

#ifndef M_PI
    #define M_PI 3.14159265358979323846
#endif

typedef struct {
    int32_t *data;
    size_t rows;
    size_t cols;
} Matrix;

typedef struct {
    int32_t x;
    int32_t y;
} Vector2D;

// --- Initialization ---

Matrix* init_matrix(size_t rows, size_t cols) {
    Matrix *m = malloc(sizeof(Matrix));
    m->rows = rows;
    m->cols = cols;
    m->data = (int32_t *)calloc(rows * cols, sizeof(int32_t));
    return m;
}

// --- Randomization ---

void fill_matrix_random(Matrix *m, int32_t limit) {
    for (size_t i = 0; i < m->rows * m->cols; i++) {
        m->data[i] = rand() % limit;
    }
}

// --- The "Random Angle" Logic ---
// This rotates a 2D vector by a random angle theta
void apply_random_rotation(Vector2D *v) {
    // Generate random angle between 0 and 2*PI
    double angle = ((double)rand() / RAND_MAX) * 2.0 * M_PI;
    
    // Rotation Matrix Formula:
    // x' = x*cos(theta) - y*sin(theta)
    // y' = x*sin(theta) + y*cos(theta)
    double new_x = (double)v->x * cos(angle) - (double)v->y * sin(angle);
    double new_y = (double)v->x * sin(angle) + (double)v->y * cos(angle);

    // Cast back to integer for the lattice grid
    v->x = (int32_t)round(new_x);
    v->y = (int32_t)round(new_y);
    
    printf("Rotated by %.2f degrees to new coordinates: (%d, %d)\n", 
            angle * (180.0 / M_PI), v->x, v->y);
}

void free_matrix(Matrix *m) {
    free(m->data);
    free(m);
}
