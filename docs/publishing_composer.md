# Publishing to Packagist (Composer)

This guide explains how to publish the PHP wrapper for the `qIngabo` SDK.

## 1. Prerequisites
- A [Packagist account](https://packagist.org/).
- The PHP `FFI` extension enabled.

## 2. Package Configuration
Ensure `wrappers/php/composer.json` is correctly configured:
- `name`: Should be unique (e.g., `qingabo/qingabo`).
- `version`: Follow [Semantic Versioning](https://semver.org/).
- `autoload`: Ensure the `Pqc` namespace is mapped to `src/` (if you've moved `PqcClient.php` there).

## 3. Bundling the Shared Library
Composer packages are typically installed from a Git repository. You should:
1. Include the C library binaries in the repository within a `lib/` directory.
2. Update `PqcClient.php` to search for these binaries within the vendor directory where the package will be installed.

## 4. Submitting to Packagist
1. Host your code on a public Git repository (e.g., GitHub).
2. Login to [Packagist.org](https://packagist.org/).
3. Click "Submit" and provide the URL to your repository.
4. Set up a [GitHub hook](https://packagist.org/about#how-to-update-packages) to automatically update the package on every push.

## 5. Testing the Package
In a separate project:
```bash
composer require qingabo/qingabo
```
Then use it in your code:
```php
use Pqc\PqcClient;
$client = new PqcClient();
```
