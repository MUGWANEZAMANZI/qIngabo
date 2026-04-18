import ctypes
import os
import platform
import sys

# Load the shared library
lib_name = "pqc.dll" if platform.system() == "Windows" else "libpqc.so"
if platform.system() == "Darwin":
    lib_name = "libpqc.dylib"

# Possible search paths
search_paths = [
    os.path.join(os.path.dirname(__file__), lib_name), # Bundle with package
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "core", "build", lib_name), # Local dev build
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "core", "build", "Release", lib_name), # MSVC build
    os.path.abspath(lib_name), # Local working directory
]

pqc_lib = None
for p in search_paths:
    if os.path.exists(p):
        try:
            pqc_lib = ctypes.CDLL(p)
            print(f"Successfully loaded library from {p}")
            break
        except OSError as e:
            print(f"Failed to load from {p}: {e}")

if not pqc_lib:
    # Try system paths as last resort
    try:
        pqc_lib = ctypes.CDLL(lib_name)
    except OSError:
        pass

if pqc_lib:
    pqc_lib.generate_keypair.argtypes = [ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.encrypt_bit.argtypes = [ctypes.c_int, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.decrypt_bit.argtypes = [ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.decrypt_bit.restype = ctypes.c_int
else:
    print(f"Warning: Could not load {lib_name} from any path")

def generate_keypair():
    if not pqc_lib: raise RuntimeError("Library not loaded")
    pub = (ctypes.c_int * 20)()
    sec = (ctypes.c_int * 4)()
    pqc_lib.generate_keypair(pub, sec)
    return list(pub), list(sec)

def encrypt_bit(bit, pub_key):
    if not pqc_lib: raise RuntimeError("Library not loaded")
    pub_arr = (ctypes.c_int * 20)(*pub_key)
    ct = (ctypes.c_int * 5)()
    pqc_lib.encrypt_bit(bit, pub_arr, ct)
    return list(ct)

def decrypt_bit(ct, sec_key):
    if not pqc_lib: raise RuntimeError("Library not loaded")
    ct_arr = (ctypes.c_int * 5)(*ct)
    sec_arr = (ctypes.c_int * 4)(*sec_key)
    return pqc_lib.decrypt_bit(ct_arr, sec_arr)
