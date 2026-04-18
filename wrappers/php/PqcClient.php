<?php

namespace Pqc;

use FFI;

class PqcClient
{
    private $ffi;
    private $libPath;

    public function __construct($libPath = null)
    {
        if ($libPath === null) {
            $os = PHP_OS_FAMILY;
            $libName = 'libpqc.so';
            if ($os === 'Windows') {
                $libName = 'pqc.dll';
            } elseif ($os === 'Darwin') {
                $libName = 'libpqc.dylib';
            }
            
            // Try common paths
            $paths = [
                __DIR__ . '/' . $libName,
                __DIR__ . '/../../core/build/' . $libName,
                '/usr/local/lib/' . $libName
            ];

            foreach ($paths as $path) {
                if (file_exists($path)) {
                    $libPath = $path;
                    break;
                }
            }
        }

        if (!$libPath || !file_exists($libPath)) {
            throw new \Exception("PQC library not found. Checked: " . implode(', ', $paths));
        }

        $this->libPath = $libPath;
        $this->ffi = FFI::cdef("
            void generate_keypair(int* pub_key, int* sec_key);
            void encrypt_bit(int bit, const int* pub_key, int* ct);
            int decrypt_bit(const int* ct, const int* sec_key);
        ", $this->libPath);
    }

    public function generateKeyPair()
    {
        $pub = FFI::new("int[20]");
        $sec = FFI::new("int[4]");
        $this->ffi->generate_keypair($pub, $sec);
        
        return [
            'pub' => $this->ffiArrayToArray($pub, 20),
            'sec' => $this->ffiArrayToArray($sec, 4)
        ];
    }

    public function encryptBit(int $bit, array $pubKey)
    {
        $pub = FFI::new("int[20]");
        foreach ($pubKey as $i => $val) $pub[$i] = $val;
        
        $ct = FFI::new("int[5]");
        $this->ffi->encrypt_bit($bit, $pub, $ct);
        
        return $this->ffiArrayToArray($ct, 5);
    }

    public function decryptBit(array $ct, array $secKey)
    {
        $ct_ffi = FFI::new("int[5]");
        foreach ($ct as $i => $val) $ct_ffi[$i] = $val;
        
        $sec = FFI::new("int[4]");
        foreach ($secKey as $i => $val) $sec[$i] = $val;
        
        return (int)$this->ffi->decrypt_bit($ct_ffi, $sec);
    }

    private function ffiArrayToArray($ffiArr, $size)
    {
        $res = [];
        for ($i = 0; $i < $size; $i++) {
            $res[] = $ffiArr[$i];
        }
        return $res;
    }
}
