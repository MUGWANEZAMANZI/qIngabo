import ctypes
import os
import platform

# Load the shared library
lib_name = "pqc.dll" if platform.system() == "Windows" else "libpqc.so"
if platform.system() == "Darwin":
    lib_name = "libpqc.dylib"

# Try to find the library in core/build
lib_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "core", "build", lib_name)

if not os.path.exists(lib_path):
    # Fallback to local directory
    lib_path = os.path.abspath(lib_name)

try:
    pqc_lib = ctypes.CDLL(lib_path)
    
    pqc_lib.generate_keypair.argtypes = [ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.encrypt_bit.argtypes = [ctypes.c_int, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.decrypt_bit.argtypes = [ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int)]
    pqc_lib.decrypt_bit.restype = ctypes.c_int
except OSError:
    pqc_lib = None
    print(f"Warning: Could not load {lib_path}")

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
