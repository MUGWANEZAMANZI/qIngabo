cmake_minimum_required(VERSION 3.10)
project(quantum_safe_sdk C)

set(CMAKE_C_STANDARD 99)

add_library(pqc SHARED src/pqc_api.c)
target_include_directories(pqc PUBLIC include)
