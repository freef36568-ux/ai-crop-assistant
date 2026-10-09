/**
 * Helper to generate or update public/.well-known/assetlinks.json
 * Usage:
 *   node scripts/generate-assetlinks.cjs <YOUR_SHA256_FINGERPRINT>
 *
 * Example:
 *   node scripts/generate-assetlinks.cjs 14:6D:E9:D2:0F:4B:5F:82:3F:89:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC
 */

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json');
const distPath = path.join(__dirname, '..', 'dist', '.well-known', 'assetlinks.json');

const sha256Input = process.argv[2];

if (!sha256Input) {
  console.log('=== Digital Asset Links Generator ===');
  console.log('Please provide your SHA-256 fingerprint from your keystore or Google Play Console.');
  console.log('Usage: node scripts/generate-assetlinks.cjs <SHA256_FINGERPRINT>\n');
  console.log('Where to find in Google Play Console:');
  console.log('  1. Open Google Play Console');
  console.log('  2. Select your app (AI Crop Assistant)');
  console.log('  3. Go to: Release -> Setup -> App Integrity');
  console.log('  4. Copy "SHA-256 certificate fingerprint" under "App signing key certificate"\n');
  process.exit(0);
}

const fingerprint = sha256Input.trim().toUpperCase();

const assetlinksContent = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.aicropassistant.app',
      sha256_cert_fingerprints: [fingerprint]
    }
  }
];

const jsonString = JSON.stringify(assetlinksContent, null, 2) + '\n';

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, jsonString, 'utf8');
console.log(`✅ Successfully updated ${targetPath}`);

if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, jsonString, 'utf8');
  console.log(`✅ Also updated ${distPath}`);
}
console.log(`Package: com.aicropassistant.app`);
console.log(`SHA-256: ${fingerprint}`);
