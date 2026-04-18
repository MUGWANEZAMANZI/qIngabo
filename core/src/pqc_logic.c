#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

typedef struct {
    int32_t *data;
    size_t rows;
    size_t cols;
} Matrix;

typedef struct {
    int32_t x;
    int32_t y;
} Vector2D;

Matrix* init_matrix(size_t rows, size_t cols);
void fill_matrix_random(Matrix *m, int32_t limit);
void apply_random_rotation(Vector2D *v);
void free_matrix(Matrix *m);

int main(void) {
    srand((unsigned int)time(NULL));

    Matrix *basis = init_matrix(2, 2);
    fill_matrix_random(basis, 10);

    printf("Initial Random Basis Matrix:\n");
    printf("[%d, %d]\n[%d, %d]\n\n",
           basis->data[0], basis->data[1],
           basis->data[2], basis->data[3]);

    Vector2D point = {5, 0};
    printf("Original Point: (%d, %d)\n", point.x, point.y);
    apply_random_rotation(&point);

    free_matrix(basis);
    return 0;
}