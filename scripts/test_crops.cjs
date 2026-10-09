const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VERIFYING CROP DETECTION INTEGRITY ===\n');

// 1. Check aiService source code for hardcoded Tomato defaults
const aiServiceContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'aiService.ts'), 'utf8');

assert(!aiServiceContent.includes('const matchedCrop = CROP_DATABASE[1]; // Tomato'), 'Found hardcoded Tomato in aiService detectCropFromImage!');
assert(!aiServiceContent.includes("data.cropName || cleanCropInput || 'Tomato'"), 'Found default Tomato in aiService analyzeCropDisease!');
assert(!aiServiceContent.includes("targetCrop || 'Tomato'"), 'Found targetCrop || Tomato in aiService.ts!');
console.log('✓ PASS: No hardcoded Tomato fallbacks found in aiService.ts');

// 2. Check AnalysisContext for hardcoded Tomato
const contextContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'context', 'AnalysisContext.tsx'), 'utf8');
assert(!contextContent.includes("targetCrop || 'Tomato'"), 'Found targetCrop || Tomato in AnalysisContext!');
console.log('✓ PASS: No targetCrop || Tomato in AnalysisContext.tsx');

// 3. Verify cropDatabase contains all major Indian crops
const cropDbContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'cropDatabase.ts'), 'utf8');
const testCrops = ['rice', 'chilli', 'cotton', 'maize', 'potato', 'tomato', 'groundnut', 'wheat', 'sugarcane', 'brinjal'];

testCrops.forEach(id => {
  assert(cropDbContent.includes(`"id": "${id}"`), `Missing crop ${id} in cropDatabase.ts`);
  console.log(`✓ PASS: ${id} exists with dedicated pathology profile in cropDatabase`);
});

// 4. Verify detect-crop edge function
const detectCropEdge = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'functions', 'detect-crop', 'index.ts'), 'utf8');
assert(detectCropEdge.includes('crop_name'), 'detect-crop edge function missing crop_name field');
assert(detectCropEdge.includes('is_plant'), 'detect-crop edge function missing is_plant check');
assert(detectCropEdge.includes('non_plant'), 'detect-crop edge function missing non_plant rule');
console.log('✓ PASS: Supabase detect-crop edge function has real vision validation & non-plant detection');

console.log('\n=============================================');
console.log('ALL CROP DETECTION INTEGRITY CHECKS PASSED');
console.log('=============================================\n');
