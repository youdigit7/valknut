import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUD_NAME = 'ofrariny';
const UPLOAD_PRESET = 'valknut_preset';

const productsDir = path.join(__dirname, '../src/assets/products');

async function uploadFile(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', path.parse(fileName).name);
  formData.append('folder', 'valknut/products');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload ${fileName}: ${err}`);
  }

  const data = await res.json();
  return data.secure_url;
}

async function main() {
  console.log(`Starting Cloudinary migration for local product assets...`);
  const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const results = {};
  for (const file of files) {
    try {
      process.stdout.write(`Uploading ${file}... `);
      const url = await uploadFile(path.join(productsDir, file), file);
      results[file] = url;
      console.log(`OK -> ${url}`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  console.log(`\nMigration completed! Output mapping:`);
  fs.writeFileSync(path.join(__dirname, 'cloudinary_asset_map.json'), JSON.stringify(results, null, 2));
  console.log(`Saved mapping to scripts/cloudinary_asset_map.json`);
}

main().catch(console.error);
